import { useState, useEffect } from 'react'

import Togglable from './components/Togglable'
import Notification from './components/Notification'
import Blog from './components/Blog'

import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [successful, setSuccessful] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
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

  const addBlog = async event => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setNotification(`a new blog ${returnedBlog.title} added`)
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
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)} />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)} />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)} />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </Togglable>
  )

  const blogList = () => (
    <>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
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