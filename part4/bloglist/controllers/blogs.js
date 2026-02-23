const blogsRouter = require('express').Router()
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find()
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user._id,
  })

  const savedBlog = await Blog
    .create(blog)
  await savedBlog.populate('user', { username: 1, name: 1 })
  user.notes = user.notes.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const requestUser = request.user
  if (!requestUser) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = {
    title: title,
    author: author,
    url: url,
    likes: likes,
    user: user,
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { returnDocument: 'after' })
    .populate('user', { username: 1, name: 1 })
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const returnedBlog = await Blog.findById(request.params.id)
  if (!returnedBlog) {
    return response.status(204).end()
  }

  if (user._id.toString() !== returnedBlog.user.toString()) {
    return response.status(401).json({ error: 'user not authorized to delete this' })
  }

  await returnedBlog.deleteOne()
  response.status(204).end()
})

module.exports = blogsRouter
