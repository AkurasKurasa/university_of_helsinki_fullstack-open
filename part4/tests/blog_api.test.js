const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
]

let token = null
let user = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    user = new User({ username: 'root', passwordHash })
    await user.save()

    // Generate token for the user
    const userForToken = { username: user.username, id: user._id }
    token = jwt.sign(userForToken, process.env.SECRET)

    // Add initial blogs linked to the user
    const blog1 = new Blog({ ...initialBlogs[0], user: user._id })
    await blog1.save()
    const blog2 = new Blog({ ...initialBlogs[1], user: user._id })
    await blog2.save()
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('blogs have id property instead of _id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

describe('addition of a new blog', () => {
    test('succeeds with valid data and token', async () => {
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length + 1)

        const titles = response.body.map(r => r.title)
        assert(titles.includes('Canonical string reduction'))
    })

    test('fails with 401 if token is missing', async () => {
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('defaults likes to 0 if missing', async () => {
        const newBlog = {
            title: 'Blog without likes',
            author: 'Test Author',
            url: 'http://example.com',
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

    test('fails with 400 if title is missing', async () => {
        const newBlog = {
            author: 'Test Author',
            url: 'http://example.com',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })

    test('fails with 400 if url is missing', async () => {
        const newBlog = {
            title: 'Test Blog',
            author: 'Test Author',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with 204 if id is valid and user is creator', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')
        assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
    })

    test('fails with 401 if token is missing', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
    })
})

describe('updating a blog', () => {
    test('succeeds in updating likes', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToUpdate = blogsAtStart.body[0]

        const updatedBlog = {
            ...blogToUpdate,
            likes: 100
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)

        assert.strictEqual(response.body.likes, 100)
    })
})

after(async () => {
    await mongoose.connection.close()
})
