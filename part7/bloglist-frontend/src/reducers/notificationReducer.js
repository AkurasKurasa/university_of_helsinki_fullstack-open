import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotificationState(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return null
        }
    }
})

export const { setNotificationState, clearNotification } = notificationSlice.actions

export const setNotification = (message, type = 'success', time = 5) => {
    return async dispatch => {
        dispatch(setNotificationState({ message, type }))
        setTimeout(() => {
            dispatch(clearNotification())
        }, time * 1000)
    }
}

export default notificationSlice.reducer
