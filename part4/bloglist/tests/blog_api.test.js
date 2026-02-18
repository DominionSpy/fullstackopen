const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
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
      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
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
    })

    test('with no likes defaults to zero', async () => {
      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
      }

      await api
        .post('/api/blogs')
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
      const newBlog = {
        author: "Matthew Wilson",
        url: "https://le-fin-est-ici.blogspot.com/",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect(/Path `title` is required/)
    })

    test.only('with no url fails with status code 400', async () => {
      const newBlog = {
        title: "Le Fin Est Ici",
        author: "Matthew Wilson",
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect(/Path `url` is required/)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length - 1)
    })

    test('succeeds with status code 204 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(validNonexistingId))
      assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
