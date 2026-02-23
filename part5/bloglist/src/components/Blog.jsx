import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, showRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = id => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    updateBlog(id, newBlog)
  }

  const remove = blog => {
    if (window.confirm(`Remove blog ${blog.title} ?`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <>
          <br />
          {blog.url}<br />
          likes {blog.likes}
          <button onClick={() => likeBlog(blog.id)}>
            like
          </button><br />
          {blog.user.name}<br />
          {showRemove && (
            <button onClick={() => remove(blog)}>
              remove
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Blog