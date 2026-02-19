const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  describe('addition of a new user', () => {
    test('succeeds with status code 201 if valid data', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails with status code 400 if username is missing', async () => {
      const newUser = {
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect(/required/)
    })

    test('fails with status code 400 if username too short', async () => {
      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect(/shorter than the minimum/)
    })

    test('fails with status code 400 if password is missing', async () => {
      const newUser = {
        username: 'mluukkainen',
        name: 'Matti Luukkainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect(/required/)
    })

    test('fails with status code 400 if password is too short', async () => {
      const newUser = {
        username: 'mluukkainen',
        name: 'Matti Luukkainen',
        password: 'sa'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect(/at least 3 characters/)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
