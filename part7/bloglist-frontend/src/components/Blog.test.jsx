import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 10,
        user: {
            username: 'root',
            name: 'Super User'
        }
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Component testing is done with react-testing-library Test Author')

    const details = container.querySelector('.blog-details')
    expect(details).toHaveStyle('display: none')
})

test('shows url and likes when view button is clicked', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 10,
        user: {
            username: 'root',
            name: 'Super User'
        }
    }

    const { container } = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const details = container.querySelector('.blog-details')
    expect(details).not.toHaveStyle('display: none')
    expect(details).toHaveTextContent('http://example.com')
    expect(details).toHaveTextContent('likes 10')
})

test('if like button is clicked twice, the event handler is called twice', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'http://example.com',
        likes: 10,
        user: {
            username: 'root',
            name: 'Super User'
        }
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})
