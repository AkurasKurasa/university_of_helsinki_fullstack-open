# Part 4 - Blog List Application

This application is a backend for a blog list, allowing users to save and share information about interesting blogs.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the project root with:
   ```
   MONGODB_URI=your-mongodb-connection-string-here
   PORT=3003
   TEST_MONGODB_URI=your-test-mongodb-connection-string-here
   SECRET=your-secret-key-for-jwt
   ```

   **Note:** You can copy your MongoDB URI from your part3 `.env` file.

3. **Run the application:**
   ```bash
   npm start        # production mode
   npm run dev      # development mode with nodemon
   ```

4. **Run tests:**
   ```bash
   npm test         # run all tests
   npm run test:watch  # run tests in watch mode
   ```

## API Endpoints

### Blogs (`/api/blogs`)
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create a new blog (requires authentication)
- `DELETE /api/blogs/:id` - Delete a blog (requires authentication as creator)
- `PUT /api/blogs/:id` - Update a blog

### Users (`/api/users`)
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

### Login (`/api/login`)
- `POST /api/login` - Login and get token

## Features

✅ Unit tests for helper functions
✅ Integration tests with SuperTest
✅ User management with password hashing
✅ JWT token authentication
✅ Protected routes (create/delete blogs)
✅ User-blog relationships with populate

## Completed Exercises

- 4.1-4.2: Project structure
- 4.3-4.7: Helper functions and unit tests
- 4.8-4.14: Integration tests
- 4.15-4.17: User management
- 4.18-4.23: Token authentication
