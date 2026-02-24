import { useState, useEffect } from 'react'

import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Blog from './components/Blog'

import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [successful, setSuccessful] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification(`user ${user.name} logged in`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch {
      setSuccessful(false)
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification(null)
        setSuccessful(true)
      }, 5000)
    }
  }

  const handleLogout = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setNotification('user logged out')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async blogObject => {
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNotification(`a new blog ${returnedBlog.title} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const updateBlog = async (id, blogObject) => {
    const returnedBlog = await blogService.update(id, blogObject)
    setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
    setNotification(`${returnedBlog.user.name} liked ${returnedBlog.title}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const removeBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
    setNotification('blog removed')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const newBlogForm = () => (
    <Togglable buttonLabel="create new blog">
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const blogList = () => (
    <>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          showRemove={user.username === blog.user.username}
        />)
      }
    </>
  )

  return (
    <div>
      {!user && (
        <>
          <h2>log in to application</h2>
          <Notification message={notification} successful={successful} />
          {loginForm()}
        </>
      )}
      {user && (
        <>
          <h2>blogs</h2>
          <Notification message={notification} successful={successful} />
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>
             logout
            </button>
          </p>
          <h2>create new</h2>
          {newBlogForm()}
          {blogList()}
        </>
      )}
    </div>
  )
}

export default App