import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)

    if (notification === null) {
        return null
    }

    const { message, type } = notification

    const style = {
        color: type === 'error' ? 'red' : 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Notification
