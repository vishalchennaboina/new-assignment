# Task Manager – Intern Assignment

A full-stack task manager built for an intern-level evaluation. Frontend is the primary focus with a clean UI, authentication, and CRUD task management. Backend is minimal, secure, and correct with JWT-based auth.

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Axios
- React Hook Form

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs
- jsonwebtoken
- express-validator

## Project Structure

```
.
├── backend
├── frontend
└── README.md
```

## Setup Instructions

### 1) Environment Variables (Backend)
Create a `.env` file in `backend/`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_jwt_secret
```

### 2) Install Dependencies

**Backend**
```
cd backend
npm install
```

**Frontend**
```
cd frontend
npm install
```

### 3) Run the App

**Backend**
```
cd backend
npm run dev
```

**Frontend**
```
cd frontend
npm run dev
```

### 4) Demo Credentials

Create a user via the signup screen. Example:
- Email: demo@taskapp.com
- Password: password123

## API Overview

Base URL: `http://localhost:5000/api/v1`

### Auth
- `POST /auth/signup`
- `POST /auth/login`

### Profile (JWT protected)
- `GET /me`
- `PUT /me`

### Tasks (JWT protected)
- `POST /tasks`
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`

## Postman Collection

A Postman collection JSON is included at `postman_collection.json`. It contains requests for:
- Auth signup/login
- Profile get/update
- Task CRUD

Use the `token` from the login response as a Bearer token in the Authorization header.

## How would you scale this for production?

- Add structured logging and centralized observability (e.g., OpenTelemetry).
- Use HTTPS, secure cookies, refresh tokens, and rotate secrets.
- Run the API behind a gateway with rate limiting and WAF.
- Add indexing and query optimization in MongoDB.
- Containerize and deploy with autoscaling (Kubernetes or ECS).
- Introduce caching for heavy read endpoints.
- Add tests (unit/integration) and CI/CD pipelines.
