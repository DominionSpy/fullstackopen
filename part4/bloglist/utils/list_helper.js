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
  return _(blogs)
    .countBy("author")
    .entries()
    .map(([author, blogs]) => ({
      author: author,
      blogs: blogs
    }))
    .orderBy("blogs", "desc")
    .head()
}

const mostLikes = (blogs) => {
  return _(blogs)
    .groupBy("author")
    .map(item => ({
      author: item[0].author,
      likes: item.reduce((total, blog) => total + blog.likes, 0)
    }))
    .orderBy("likes", "desc")
    .head()
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
