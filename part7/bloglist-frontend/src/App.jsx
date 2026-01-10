import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Container, Button, TextField, Typography, Paper } from '@mui/material'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Menu from './components/Menu'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import loginService from './services/login'

import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, updateBlogThunk, removeBlog } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/userReducer'

const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      dispatch(setNotification('Logged in successfully'))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('Wrong credentials', 'error'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    blogService.setToken(null)
    dispatch(setNotification('Logged out'))
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await dispatch(createBlog(blogObject))
      dispatch(setNotification(`A new blog ${blogObject.title} by ${blogObject.author} added`))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('Error creating blog', 'error'))
    }
  }

  const handleUpdateBlog = async (id, blogObject) => {
    try {
      await dispatch(updateBlogThunk(blogObject))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('Error updating blog', 'error'))
    }
  }

  const handleDeleteBlog = async (id) => {
    try {
      await dispatch(removeBlog(id))
      dispatch(setNotification('Blog removed'))
    } catch (exception) {
      console.error(exception)
      dispatch(setNotification('Error deleting blog', 'error'))
    }
  }

  // Sort blogs by likes
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  if (user === null) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
      </Container>
    )
  }

  return (
    <Router>
      <Container>
        <Menu />
        <Typography variant="h2" style={{ marginTop: 20, marginBottom: 10 }}>
          Blog Application
        </Typography>
        <Notification />
        <div>
          <em>{user.name} logged in</em>
          <Button onClick={handleLogout} style={{ marginLeft: 10 }} size="small">
            logout
          </Button>
        </div>

        <Routes>
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/" element={
            <div>
              <Togglable buttonLabel='create new blog' ref={blogFormRef}>
                <BlogForm createBlog={handleCreateBlog} />
              </Togglable>

              {sortedBlogs.map(blog =>
                <Paper key={blog.id} style={{ padding: 10, marginTop: 5, marginBottom: 5 }}>
                  <Link to={`/blogs/${blog.id}`} style={{ textDecoration: 'none' }}>
                    {blog.title} by {blog.author}
                  </Link>
                </Paper>
              )}
            </div>
          } />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
