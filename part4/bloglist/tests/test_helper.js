const Blog = require('../models/blog')
const User = require('../models/user')

const multipleUsers = [
  {
    _id: '6996c8991a396bbc9ab2f2d3',
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    passwordHash: '$2b$10$Z3o1ZCt6KiZvso5EoiHc/u2K5gZDNJgCMzJVcC4r22rDGMvcj4nhS',
    __v: 0
  },
  {
    _id: '6996c83f25678b8519dbc73f',
    username: 'hellas',
    name: 'Arto Hellas',
    passwordHash: '$2b$10$33jOShUcOFZt1ecdtBwjMOq6UFCRObCVVC/vdQ3M4Yv6WUyjVhA6q',
    __v: 0
  }
]

const noBlogs = []
const oneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]
const multipleBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'Will R. T. Soon',
    url: 'www.illremovethissoon.com',
    likes: 5,
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find()
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  multipleUsers,
  noBlogs,
  oneBlog,
  multipleBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}
