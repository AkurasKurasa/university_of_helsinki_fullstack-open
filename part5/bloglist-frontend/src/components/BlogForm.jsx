import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog}>
                <div>
                    title:
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        placeholder='title'
                        id='title-input'
                        data-testid='title'
                    />
                </div>
                <div>
                    author:
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        placeholder='author'
                        id='author-input'
                        data-testid='author'
                    />
                </div>
                <div>
                    url:
                    <input
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        placeholder='url'
                        id='url-input'
                        data-testid='url'
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm
