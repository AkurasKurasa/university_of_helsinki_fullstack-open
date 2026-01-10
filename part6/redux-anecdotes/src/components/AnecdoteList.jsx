import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return [...state.anecdotes].sort((a, b) => b.votes - a.votes)
        }
        return state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
            .sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const voteHandler = (id) => {
        console.log('vote', id)
        dispatch(vote(id))
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => voteHandler(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
