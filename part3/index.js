require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Exercise 3.7 & 3.8: Morgan middleware with custom token for POST body
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

// Exercise 3.1: GET /api/persons (Updated for 3.13)
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

// Exercise 3.2: GET /info (Updated for 3.18)
app.get('/info', (req, res) => {
    Person.find({}).then(persons => {
        const count = persons.length
        const date = new Date()
        res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
    })
})

// Exercise 3.3: GET /api/persons/:id (Updated for 3.18)
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// Exercise 3.4: DELETE /api/persons/:id (Updated for 3.15)
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

// Exercise 3.5: POST /api/persons (Updated for 3.14)
app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error)) // Use middleware for error
})

// Exercise 3.17: PUT /api/persons/:id
app.put('/api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    const person = {
        name,
        number,
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// Exercise 3.16: Error handling middleware
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
