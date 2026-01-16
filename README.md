# Full-Stack Productivity Suite (API + Client)

## Project Overview

The Full-Stack Productivity Suite is a production-ready backend system designed to help users manage notes, tasks, and files efficiently while enabling real-time communication and flexible data access through REST and GraphQL APIs.

This project demonstrates mastery of backend development concepts including authentication, role-based access control, real-time systems, and API architecture using Node.js and MongoDB.

---

## Project Objectives

- Build a secure authentication system with role-based access control (RBAC)
- Implement full CRUD operations for notes, tasks, and file management
- Integrate real-time communication using Socket.io
- Expose selected data via GraphQL in addition to REST APIs
- Deploy a scalable backend service with professional documentation

---

## Tech Stack

- **Runtime:** Node.js.
- **Framework:** Express.js.
- **Database:** MongoDB + Mongoose.
- **Authentication:** JWT + bcrypt.
- **Real-Time:** Socket.io.
- **API Types:** REST & GraphQL.
- **Deployment:** Render / Railway.
- **Documentation:** Postman.

---

## 5. Project Structure

```
vephla-productivity-suite/
├── src/
│   ├── app.js                 # Express app setup, routes mounting
│   ├── config/
│   │   └── db.js              # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js  # Register, login logic
│   │   ├── noteController.js  # CRUD for notes
│   │   ├── taskController.js  # CRUD for tasks
│   │   └── fileController.js  # File upload and retrieval
│   ├── middlewares/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── roleMiddleware.js  # RBAC enforcement
│   ├── models/
│   │   ├── User.js            # User schema with password hashing
│   │   ├── Note.js            # Note schema with tags
│   │   ├── Task.js            # Task schema with assignment
│   │   ├── File.js            # File metadata schema
│   │   └── Message.js         # Chat message schema
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth endpoints
│   │   ├── noteRoutes.js      # /api/notes endpoints (protected)
│   │   ├── taskRoutes.js      # /api/tasks endpoints (protected)
│   │   ├── fileRoutes.js      # /api/files endpoints (protected)
│   │   └── rootRoutes.js      # Root and health check
│   ├── sockets/
│   │   └── socket.js          # Socket.IO connection handlers
│   ├── graphql/
│   │   ├── schema.js          # GraphQL type definitions
│   │   └── resolvers.js       # Query and mutation resolvers
│   └── utils/
│       └── upload.js          # Multer storage & validation config
├── docs/
│   ├── postman-collection.json    # Postman collection
│   ├── postman-environment.json   # Postman environment template
│   └── ERD.png / system-design.png
├── server.js                  # Entry point (HTTP server + Socket.IO init)
├── package.json               # Dependencies and scripts
├── .env.example               # Environment variable template
└── README.md                  # This file
```

---

## 6. API Endpoints Summary

### Authentication (Public)

| Method | Endpoint             | Description           | Auth Required |
| ------ | -------------------- | --------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user     | ❌ No         |
| POST   | `/api/auth/login`    | Login and receive JWT | ❌ No         |

### Notes (Protected)

| Method | Endpoint                              | Description                             | Auth Required |
| ------ | ------------------------------------- | --------------------------------------- | ------------- |
| POST   | `/api/notes`                          | Create a note                           | ✅ Yes        |
| GET    | `/api/notes?page=1&limit=10&tag=work` | Fetch paginated notes (with tag filter) | ✅ Yes        |
| GET    | `/api/notes/:id`                      | Get note by ID (owner only)             | ✅ Yes        |
| PUT    | `/api/notes/:id`                      | Update note (owner only)                | ✅ Yes        |
| DELETE | `/api/notes/:id`                      | Delete note (owner only)                | ✅ Yes        |

### Tasks (Protected)

| Method | Endpoint         | Description                          | Auth Required |
| ------ | ---------------- | ------------------------------------ | ------------- |
| POST   | `/api/tasks`     | Create a task                        | ✅ Yes        |
| GET    | `/api/tasks`     | Get tasks assigned to user           | ✅ Yes        |
| GET    | `/api/tasks/:id` | Get task by ID (assigned or creator) | ✅ Yes        |
| PUT    | `/api/tasks/:id` | Update task (creator only)           | ✅ Yes        |
| DELETE | `/api/tasks/:id` | Delete task (creator only)           | ✅ Yes        |

### Files (Protected)

| Method | Endpoint     | Description                | Auth Required |
| ------ | ------------ | -------------------------- | ------------- |
| POST   | `/api/files` | Upload a file              | ✅ Yes        |
| GET    | `/api/files` | Get files uploaded by user | ✅ Yes        |

### GraphQL (Public)

| Type | Endpoint   | Description                       | Auth Required                  |
| ---- | ---------- | --------------------------------- | ------------------------------ |
| POST | `/graphql` | GraphQL endpoint with GraphiQL UI | ❌ No (ready for auth context) |

---

## 7. Authentication & Authorization

### JWT Flow

1. User calls `/api/auth/register` with name, email, password
2. Password hashed with bcrypt (10 rounds) and stored in MongoDB
3. User calls `/api/auth/login` with email and password
4. Server verifies password and issues JWT: `{ id, email, role, iat, exp }`
5. Client includes token in Authorization header: `Bearer <token>`
6. Middleware verifies signature and attaches `req.user` to request
7. Protected routes check `req.user.role` for RBAC

### RBAC Logic

- Two roles: `admin` (system administrator) and `standard` (regular user)
- `authorizeRoles()` middleware restricts routes
- Default role for new users: `standard`
- Ready for admin-only features (user management, system logs, etc.)

### Ownership Enforcement

- **Notes**: Only owner can read, update, delete
- **Tasks**: Creator can update/delete; assigned user can read
- **Files**: Only uploader can access their files
- Enforced in controllers via `req.user.id` comparison

---

## 8. Real-Time Communication

### Socket.IO Usage

- Initialized on HTTP server in `server.js`
- Events:
  - `joinRoom(room)`: User subscribes to a room
  - `sendMessage({ sender, receiver, content, room })`: Broadcast or direct message
  - `newMessage` (emit): Server broadcasts received message to clients
  - `disconnect`: User connection closed

### Message Persistence

- Every message saved to MongoDB via `Message` model
- Stores sender, receiver (optional), content, room, and timestamp
- Messages retrieved via REST API (future enhancement)
- Enables message history and offline access

---

## 9. Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Clone Repository

```bash
git clone https://github.com/dazeez1/vephla-productivity-suite.git
cd vephla-productivity-suite
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/vephla-productivity-suite
JWT_SECRET=your_super_secret_jwt_key_change_this
```

### Run Locally

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000` by default.

---

## 10. Deployment

### Render Deployment

1. Push code to GitHub
2. Connect Render to GitHub repository
3. Set environment variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random secret
   - `NODE_ENV`: `production`
4. Deploy: Render auto-builds and starts `npm start`

### Environment Variable Handling

- Development: Load from `.env` via `dotenv`
- Production: Set in Render dashboard (or CI/CD secrets)
- Never commit `.env` to Git (use `.env.example` as template)

### Live API

**Base URL**: `https://vephla-productivity-suite.onrender.com`

---

## 11. Testing

### Postman Collection

- **File**: `docs/postman-collection.json`
- **Environment**: `docs/postman-environment.json`

### Authorized vs Unauthorized Scenarios

1. **Unauthorized**: Omit `Authorization` header → 401 response
2. **Authorized**: Include `Authorization: Bearer <token>` header → Success response

---

## 12. Future Improvements

### Frontend Integration

- React/Vue.js frontend consuming REST API
- Real-time updates via Socket.IO client library
- Authentication UI (login, register, profile)

### Enhanced Collaboration

- Shared notes with multiple editors
- Task team assignments and notifications
- File commenting and version control

---

## 13. Author & Acknowledgment

**Author**: Azeez Damilare Gbenga  
**Institution**: Vephla University  
**Course**: Capstone Project  
**Date**: January 2026

---

## License

MIT License — See [LICENSE](LICENSE) file for details.

---

**Deployed API**: https://vephla-productivity-suite.onrender.com
