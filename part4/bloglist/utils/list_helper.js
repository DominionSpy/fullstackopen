const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const index = likes.indexOf(Math.max(...likes))
  if (index >= 0) {
    return blogs[index]
  }
  return null
}

const mostBlogs = (blogs) => {
  const max = _(blogs)
    .countBy("author")
    .entries()
    .maxBy(1)
  if (!max) {
    return null
  }
  return {
    author: max[0],
    blogs: max[1],
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}
