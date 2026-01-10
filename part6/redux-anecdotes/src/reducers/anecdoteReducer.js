import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        },
        updateAnecdote(state, action) {
            const changedAnecdote = action.payload
            return state.map(n => n.id !== changedAnecdote.id ? n : changedAnecdote)
        }
    }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const vote = id => {
    return async (dispatch, getState) => {
        const state = getState()
        const anecdoteToChange = state.anecdotes.find(n => n.id === id)
        const changedAnecdote = {
            ...anecdoteToChange,
            votes: anecdoteToChange.votes + 1
        }
        const response = await anecdoteService.update(id, changedAnecdote)
        dispatch(updateAnecdote(response))
    }
}

export default anecdoteSlice.reducer
