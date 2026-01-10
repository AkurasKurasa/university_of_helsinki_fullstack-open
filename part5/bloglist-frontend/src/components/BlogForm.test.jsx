import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing a form...')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://example.com')

    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
    expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
})
