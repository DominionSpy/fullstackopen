const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require("../models/user");

const api = supertest(app)

describe('when there are no users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('fails with status code 401', async () => {
    const body = {
      username: 'root',
      password: 'sekret',
    }

    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect(/invalid username or password/)
  })
})

describe('when there is one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('succeeds with status code 200 if credentials are valid', async () => {
    const body = {
      username: 'root',
      password: 'sekret',
    }

    await api
      .post('/api/login')
      .send(body)
      .expect(200)
      .expect(/token/)
  })

  test('fails with status code 401 if user does not exist', async () => {
    const body = {
      username: 'fake',
      password: 'sekret',
    }

    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect(/invalid username or password/)
  })

  test('fails with status code 401 if password is incorrect', async () => {
    const body = {
      username: 'root',
      password: 'wrong',
    }

    await api
      .post('/api/login')
      .send(body)
      .expect(401)
      .expect(/invalid username or password/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
