# Site Health Dashboard

A complete MERN stack application for tracking the health and status of client websites and services. It provides a beautiful, responsive dashboard to monitor operational metrics, complete with role-based access control.

## 🚀 Features

- **Role-Based Access Control (RBAC)**: 
  - `Admin`: Full access to create, edit, delete, and assign endpoints.
  - `Viewer`: Read-only access to monitor global mission status and telemetry.
- **Real-Time Monitoring Dashboard**: Dynamic and highly polished UI using Tailwind CSS, glassmorphism, and a cinematic topology background.
- **RESTful API**: Robust Express backend with complete CRUD operations, input validation, and centralized error handling.
- **Secure Authentication**: Stateless JWT authentication with bcrypt password hashing.
- **Rate Limiting & Sanitization**: Built-in protections against brute-force attacks and NoSQL/XSS injections.

## 📂 Project Structure

This is a monorepo containing both the frontend and backend applications:

```text
/server   # Express + Mongoose API
/client   # React (Vite) frontend
```

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS (v4), React Router, Axios, Lucide React, Three.js.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Bcryptjs, Express-Validator, Helmet.

## 🚦 Getting Started

### 1. Configure Environment Variables

Before starting the application, ensure your `.env` files are correctly set up.

**Server (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_string
JWT_EXPIRES_IN=1d
CLIENT_ORIGIN=http://localhost:5173

# Rate Limiting
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10

# Seed Admin Credentials (required for npm run seed)
SEED_ADMIN_EMAIL=your_admin_email
SEED_ADMIN_PASSWORD=your_secure_password
SEED_ADMIN_NAME=your_admin_name
```

**Client (`client/.env`)**:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Start the Backend Server

Open a terminal, navigate to the `server` directory, and start the development server:

```bash
cd server
npm install
npm run dev
```
The API will be available at `http://localhost:5000`.

### 3. Start the Frontend Client

Open a second terminal, navigate to the `client` directory, and start the Vite development server:

```bash
cd client
npm install
npm run dev
```
The web app will be available at `http://localhost:5173`.

## 🔐 Creating an Admin Account

By default, public registration via the web interface only provisions `viewer` accounts for security purposes. To create your first `admin` account, you must run the database seed script. 

Ensure your database is running, then execute the following in the `server` directory:

```bash
npm run seed
```

This will read the `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` from your `server/.env` file and provision the master administrator account.

## 📡 API Reference

All API responses follow a consistent envelope structure:
`{ "success": true, "data": ... }` or `{ "success": false, "error": { "message": "..." } }`

| Method | Endpoint              | Auth Required   | Description                               |
|--------|-----------------------|-----------------|-------------------------------------------|
| POST   | `/api/auth/register`  | Public          | Creates a new `viewer` account.           |
| POST   | `/api/auth/login`     | Public          | Authenticates a user and returns a JWT.   |
| GET    | `/api/auth/me`        | Logged In       | Returns the current user's profile.       |
| GET    | `/api/users`          | Admin Only      | Lists all users (used for assignments).   |
| GET    | `/api/sites`          | Logged In       | Fetches site targets (supports filters).  |
| GET    | `/api/sites/:id`      | Logged In       | Fetches a specific site target by ID.     |
| POST   | `/api/sites`          | Admin Only      | Creates a new site target.                |
| PATCH  | `/api/sites/:id`      | Admin Only      | Updates an existing site target.          |
| DELETE | `/api/sites/:id`      | Admin Only      | Deletes a site target.                    |
