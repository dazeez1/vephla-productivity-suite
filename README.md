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

## Project Structure

```text
src/
 ├── config/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── sockets/
 ├── graphql/
 ├── utils/
docs/
 ├── ERD.png
 ├── system-design.png
server.js
.env.example
README.md
```

## Authentication & Roles

The system uses JWT-based authentication with role-based access control.

### User Roles

| Role     | Description                                    |
| -------- | ---------------------------------------------- |
| admin    | Manages users, roles, and system logs          |
| standard | Regular user access to notes, tasks, and chats |

### Authentication Flow

1. User registers with email and password
2. Password is hashed using bcrypt
3. JWT is issued upon successful login
4. Protected routes verify JWT and user role

## Core Modules

- **Notes:** Create, update, delete, retrieve notes
- **Tasks:** Assign and track task completion
- **Files:** Upload and manage attachments
- **Chat:** Real-time communication via Socket.io

## API Overview

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/notes         | Fetch notes      |
| POST   | /api/tasks         | Create task      |
| POST   | /api/files         | Upload file      |
| GET    | /graphql           | GraphQL endpoint |

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB
- Git

### Installation

```bash
git clone https://github.com/dazeez1/vephla-productivity-suite.gitvephla-productivity-suite.git
cd vephla-productivity-suite
npm install
```

### Environment Variables

Create a `.env` file using `.env.example`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### Run Server

```bash
npm run dev
```

## Live Deployment

The backend API is deployed on Render.

**Base URL:**  
https://vephla-productivity-suite.onrender.com

### Services Available

- REST API (`/api/*`)
- GraphQL API (`/graphql`)
- Real-time communication via Socket.io

## Documentation

- Postman Collection (Coming Soon)
- Swagger API Docs (Coming Soon)
- ERD & System Design Diagrams located in `/docs`

## Author

**Azeez Damilare Gbenga**
Capstone Project – Vephla University
