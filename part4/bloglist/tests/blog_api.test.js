const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.multipleUsers)

    await Blog.deleteMany({})
    await Blog.insertMany(helper.multipleBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('unique identifier is named id', async () => {
    await api
      .get('/api/blogs')
      .expect(res => {
        if (!res.body[0].id) {
          throw new Error('id is required')
        }
      })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const token = await helper.loginToken(api)

      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      await api
        .get('/api/blogs')
        .expect(res => {
          if (res.body.length !== helper.multipleBlogs.length + 1) {
            throw new Error('blog not added')
          }
        })
        .expect(/Le Fin Est Ici/)
        .expect(/Arto Hellas/)
    })

    test('fails with status code 401 if no token', async () => {
      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect(/token invalid/)
    })

    test('fails with status code 401 if invalid token', async () => {
      const token = 'invalid'

      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(401)
        .expect(/token invalid/)
    })

    test('with no likes defaults to zero', async () => {
      const token = await helper.loginToken(api)

      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      await api
        .get('/api/blogs')
        .expect(res => {
          const blog = res.body.find(blog => blog.author === newBlog.author)
          if (blog.likes !== 0) {
            throw new Error('blog likes should be zero')
          }
        })
    })

    test('with no title fails with status code 400', async () => {
      const token = await helper.loginToken(api)

      const newBlog = {
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect(/Path `title` is required/)
    })

    test('with no url fails with status code 400', async () => {
      const token = await helper.loginToken(api)

      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect(/Path `url` is required/)
    })
  })

  describe('update of an existing blog', () => {
    test('succeeds with status code 200 with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({...blogToUpdate, likes: 20})
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, 20)
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status code 404 if note does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .put(`/api/blogs${validNonexistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .put(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const token = await helper.loginToken(api)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length - 1)
    })

    test('succeeds with status code 204 if blog does not exist', async () => {
      const token = await helper.loginToken(api)

      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(validNonexistingId))
      assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length)
    })

    test('fails with status code 401 if no token', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
        .expect(/token invalid/)
    })

    test('fails with status code 401 if invalid token', async () => {
      const token = 'invalid'

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect(/token invalid/)
    })

    test.skip('fails with status code 401 if incorrect user', async () => {
      const user = {
        username: 'mluukkai',
        password: 'salainen'
      }

      const response = await api
        .post('/api/login')
        .send(user)
      const token = response.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .expect(/not authorized/)
    })

    test('fails with status code 400 if id is malformed', async () => {
      const token = await helper.loginToken(api)

      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
        .expect(/malformatted id/)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
