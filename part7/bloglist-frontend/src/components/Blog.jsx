import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id || blog.user
        }
        updateBlog(blog.id, updatedBlog)
    }

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            deleteBlog(blog.id)
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const showWhenVisible = { display: visible ? '' : 'none' }

    return (
        <div style={blogStyle} className='blog'>
            <div className='blog-title'>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
            </div>
            <div style={showWhenVisible} className='blog-details'>
                <div className='blog-url'>{blog.url}</div>
                <div className='blog-likes'>
                    likes {blog.likes}
                    <button onClick={handleLike}>like</button>
                </div>
                <div>{blog.user.name || blog.user.username}</div>
                {user && blog.user.username === user.username && (
                    <button onClick={handleDelete} style={{ background: 'lightblue' }}>remove</button>
                )}
            </div>
        </div>
    )
}

export default Blog
