const express = require('express');
require('express-async-errors');
const app = express();

const { PORT } = require('./util/config');
const { connectToDatabase } = require('./util/db');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const authorsRouter = require('./controllers/authors');
const readingListsRouter = require('./controllers/readinglists');

const { tokenExtractor, userExtractor } = require('./util/middleware');

app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);

app.use(tokenExtractor);
app.use('/api/logout', userExtractor, logoutRouter);
app.use('/api/readinglists', userExtractor, readingListsRouter);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'SequelizeValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

app.use(errorHandler);

const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start();
