import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import anecdoteReducer from './anecdoteReducer'

describe('anecdoteReducer', () => {
  test('returns new state with action NEW_ANECDOTE', () => {
    const state = []
    const action = {
      type: 'NEW_ANECDOTE',
      payload: {
        content: 'But it works on my machine',
        id: 1,
        votes: 0
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })

  test('returns new state with action VOTE', () => {
    const state = [
      {
        content: 'But it works on my machine',
        id: 1,
        votes: 8
      },
      {
        content: 'If it hurts, do it more often',
        id: 2,
        votes: 2
      }
    ]

    const action = {
      type: 'VOTE',
      payload: {
        id: 2
      }
    }

    deepFreeze(state)
    const newState = anecdoteReducer(state, action)

    expect(newState).toHaveLength(2)

    expect(newState).toContainEqual(state[0])

    expect(newState).toContainEqual({
      content: 'If it hurts, do it more often',
      id: 2,
      votes: 3
    })
  })
})
