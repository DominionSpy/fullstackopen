import {useDispatch, useSelector} from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = id => {
    console.log('vote', id)
    dispatch(addVote(id))
  }

  const addVote = (id) => {
    return {
      type: 'VOTE',
      payload: { id }
    }
  }

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }

  const generateId = () =>
    Number((Math.random() * 1000000).toFixed(0))

  const createAnecdote = (content) => {
    return {
      type: 'NEW_ANECDOTE',
      payload: {
        content,
        id: generateId(),
        votes: 0
      }
    }
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
