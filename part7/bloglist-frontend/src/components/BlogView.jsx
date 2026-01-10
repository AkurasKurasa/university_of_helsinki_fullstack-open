import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material'
import { updateBlogThunk, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const BlogView = () => {
    const dispatch = useDispatch()
    const id = useParams().id
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const blog = blogs.find(b => b.id === id)
    const [comment, setComment] = useState('')

    if (!blog) {
        return null
    }

    const handleLike = () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id || blog.user
        }
        dispatch(updateBlogThunk(updatedBlog))
    }

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            dispatch(removeBlog(blog.id))
            dispatch(setNotification(`Removed blog ${blog.title}`))
        }
    }

    const handleCommentSubmit = async (event) => {
        event.preventDefault()
        try {
            const updatedBlog = await blogService.addComment(blog.id, comment)
            dispatch(updateBlogThunk(updatedBlog))
            setComment('')
            dispatch(setNotification('Comment added'))
        } catch (exception) {
            console.error(exception)
            dispatch(setNotification('Error adding comment', 'error'))
        }
    }

    return (
        <div>
            <h2>{blog.title} by {blog.author}</h2>
            <div>
                <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
            </div>
            <div>
                {blog.likes} likes
                <Button onClick={handleLike} variant="contained" size="small" style={{ marginLeft: 5 }}>
                    like
                </Button>
            </div>
            <div>added by {blog.user.name || blog.user.username}</div>
            {user && blog.user.username === user.username && (
                <Button onClick={handleDelete} variant="contained" color="error" size="small" style={{ marginTop: 10 }}>
                    remove
                </Button>
            )}

            <h3>comments</h3>
            <form onSubmit={handleCommentSubmit}>
                <TextField
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                    size="small"
                    style={{ marginRight: 5 }}
                />
                <Button type="submit" variant="contained" size="small">
                    add comment
                </Button>
            </form>
            <List>
                {blog.comments && blog.comments.map((c, i) =>
                    <ListItem key={i}>
                        <ListItemText primary={c} />
                    </ListItem>
                )}
            </List>
        </div>
    )
}

export default BlogView
