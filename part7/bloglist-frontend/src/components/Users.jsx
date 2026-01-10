import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import userService from '../services/users'

const Users = () => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        userService.getAll().then(users => {
            setUsers(users)
        })
    }, [])

    return (
        <div>
            <h2>Users</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Name</b></TableCell>
                            <TableCell><b>Blogs created</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user =>
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                                </TableCell>
                                <TableCell>{user.blogs.length}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Users
