import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        appendBlog(state, action) {
            state.push(action.payload)
        },
        updateBlog(state, action) {
            const updatedBlog = action.payload
            return state.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
        },
        removeBlogState(state, action) {
            const id = action.payload
            return state.filter(blog => blog.id !== id)
        }
    }
})

export const { setBlogs, appendBlog, updateBlog, removeBlogState } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        dispatch(appendBlog(newBlog))
    }
}

export const updateBlogThunk = (blog) => {
    return async dispatch => {
        const updated = await blogService.update(blog.id, blog)
        dispatch(updateBlog(updated))
    }
}

export const removeBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id)
        dispatch(removeBlogState(id))
    }
}

export default blogSlice.reducer
