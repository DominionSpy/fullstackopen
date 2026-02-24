import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      id: '123',
      title: 'test title',
      author: 'test author',
      url: 'https://test.com/',
      likes: 4,
      user: {
        id: '456',
        name: 'test user',
        username: 'testusername',
      },
    }
    render(
      <Blog blog={blog} />
    )
  })

  test('renders only title and author', () => {
    const title = screen.queryByText('test title', { exact: false })
    expect(title).toBeVisible()
    const author = screen.queryByText('test author', { exact: false })
    expect(author).toBeVisible()

    const url = screen.queryByText('https://test.com/', { exact: false })
    expect(url).toBeNull()
    const likes = screen.queryByText('likes 4', { exact: false })
    expect(likes).toBeNull()
    const user = screen.queryByText('test user', { exact: false })
    expect(user).toBeNull()
  })

  test('renders url and likes when view is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText('https://test.com/', { exact: false })
    expect(url).toBeVisible()
    const likes = screen.queryByText('likes 4', { exact: false })
    expect(likes).toBeVisible()
  })
})
