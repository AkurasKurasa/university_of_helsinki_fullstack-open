import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
    test.beforeEach(async ({ page, request }) => {
        // Empty the database
        await request.post('http://localhost:3003/api/testing/reset')

        // Create a new user for testing
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Test User',
                username: 'testuser',
                password: 'password'
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        await expect(page.getByText('Log in to application')).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })

    test('user can login', async ({ page }) => {
        await page.getByTestId('username').fill('testuser')
        await page.getByTestId('password').fill('password')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
        await page.getByTestId('username').fill('testuser')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()

        const notification = page.getByText('Wrong credentials')
        await expect(notification).toBeVisible()
        await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    test.describe('When logged in', () => {
        test.beforeEach(async ({ page }) => {
            await page.getByTestId('username').fill('testuser')
            await page.getByTestId('password').fill('password')
            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'create new blog' }).click()

            await page.getByTestId('title').fill('A blog created by playwright')
            await page.getByTestId('author').fill('Playwright Author')
            await page.getByTestId('url').fill('http://playwright.dev')
            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('A new blog A blog created by playwright by Playwright Author added')).toBeVisible()
            await expect(page.getByText('A blog created by playwright Playwright Author')).toBeVisible()
        })

        test.describe('and a blog exists', () => {
            test.beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'create new blog' }).click()
                await page.getByTestId('title').fill('Another blog')
                await page.getByTestId('author').fill('Another Author')
                await page.getByTestId('url').fill('http://another.com')
                await page.getByRole('button', { name: 'create' }).click()
                await expect(page.getByText('Another blog Another Author')).toBeVisible()
            })

            test('it can be liked', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'like' }).click()
                await expect(page.getByText('likes 1')).toBeVisible()
            })

            test('it can be deleted by creator', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()

                page.on('dialog', dialog => dialog.accept())

                await page.getByRole('button', { name: 'remove' }).click()

                await expect(page.getByText('Another blog Another Author')).not.toBeVisible()
            })

            test('only the creator can see the delete button', async ({ page, request }) => {
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        name: 'Other User',
                        username: 'otheruser',
                        password: 'password'
                    }
                })

                await page.getByRole('button', { name: 'logout' }).click()

                await page.getByTestId('username').fill('otheruser')
                await page.getByTestId('password').fill('password')
                await page.getByRole('button', { name: 'login' }).click()

                await expect(page.getByText('Another blog Another Author')).toBeVisible()
                await page.getByRole('button', { name: 'view' }).click()

                await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
            })
        })
    })
})
