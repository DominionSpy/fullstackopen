import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', async () => {
  test('event handler is called with correct details', async () => {
    const mockHandler = vi.fn()
    render(<BlogForm createBlog={mockHandler} />)

    const user = userEvent.setup()

    const titleField = screen.getByLabelText('title:')
    await user.type(titleField, 'new blog')

    const authorField = screen.getByLabelText('author:')
    await user.type(authorField, 'new author')

    const urlField = screen.getByLabelText('url:')
    await user.type(urlField, 'https://new.com')

    const button = screen.getByText('create')
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
    expect(mockHandler.mock.calls[0][0].title).toBe('new blog')
    expect(mockHandler.mock.calls[0][0].author).toBe('new author')
    expect(mockHandler.mock.calls[0][0].url).toBe('https://new.com')
  })
})
