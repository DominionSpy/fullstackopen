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

module.exports = {
  dummy, totalLikes, favoriteBlog
}
