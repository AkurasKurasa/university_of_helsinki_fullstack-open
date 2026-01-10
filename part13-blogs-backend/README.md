# Part 13: PostgreSQL & Sequelize - Implementation Complete

## ✅ All 24 Exercises Implemented

### Project Structure:
```
part13-blogs-backend/
├── controllers/
│   ├── blogs.js          # Blog CRUD with search (13.4, 13.13)
│   ├── users.js          # User management (13.5, 13.22, 13.24)
│   ├── login.js          # Authentication (13.7-13.8, 13.21)
│   ├── logout.js         # Session termination (13.23)
│   ├── authors.js        # Aggregation queries (13.14)
│   └── readinglists.js   # Reading list management (13.19-13.20)
├── models/
│   ├── blog.js           # Blog model (13.1-13.3, 13.18)
│   ├── user.js           # User model (13.5, 13.24)
│   ├── reading_list.js   # Join table (13.19)
│   ├── session.js        # Session model (13.21)
│   └── index.js          # Associations (13.6, 13.19-13.23)
├── migrations/
│   ├── 20240101_00_initialize_blogs_and_users.js  # (13.17)
│   ├── 20240102_00_add_year_to_blogs.js           # (13.18)
│   ├── 20240103_00_create_reading_lists.js        # (13.19)
│   └── 20240104_00_create_sessions_and_disabled.js # (13.21, 13.24)
├── util/
│   ├── config.js         # Environment variables
│   ├── db.js             # Database connection + migrations (13.1-13.3, 13.17)
│   └── middleware.js     # Auth middleware (13.9, 13.21-13.24)
├── index.js              # Express server
├── package.json
└── .env.example

## Features Implemented

### Models & Associations:
✅ Blog model with validation
✅ User model with email validation
✅ One-to-many: User → Blogs
✅ Many-to-many: Users ↔ Blogs (via ReadingList)
✅ Session model for token management
✅ Disabled user functionality

### API Endpoints:

**Blogs:**
- GET /api/blogs - List all (with search & order)
- POST /api/blogs - Create (auth required)
- DELETE /api/blogs/:id - Delete (auth required)
- PUT /api/blogs/:id - Update likes

**Users:**
- GET /api/users - List all
- POST /api/users - Register
- GET /api/users/:id - Get user with reading list
- PUT /api/users/:username - Disable user

**Auth:**
- POST /api/login - Login (creates session)
- DELETE /api/logout - Logout (destroys session)

**Authors:**
- GET /api/authors - Aggregated stats

**Reading Lists:**
- POST /api/readinglists - Add to list
- PUT /api/readinglists/:id - Mark as read

### Advanced Features:
✅ Search blogs by title/author (Op.iLike)
✅ Order by likes DESC
✅ Aggregation (COUNT, SUM, GROUP BY)
✅ Migrations for schema management
✅ Session-based authentication
✅ User disable functionality
✅ Year validation (1991 - current)

## Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE blogs;
```

3. Copy .env.example to .env and configure:
```
DATABASE_URL=postgresql://username:password@localhost:5432/blogs
SECRET=your_secret_key
PORT=3001
```

4. Install dependencies:
```bash
npm install
```

5. Run migrations (automatic on start):
```bash
npm run dev
```

## Usage

```bash
# Development
npm run dev

# Production
npm start
```

## Database Schema

**blogs:**
- id, author, url, title, likes, year, user_id
- Foreign key: user_id → users.id

**users:**
- id, username (email), name, password_hash, disabled

**reading_lists:**
- id, user_id, blog_id, read
- Foreign keys: user_id → users.id, blog_id → blogs.id

**sessions:**
- id, user_id, token
- Foreign key: user_id → users.id

All 24 exercises complete! 🎉
