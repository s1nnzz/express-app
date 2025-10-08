# Express Full Stack App

A modern full-stack web application built with React frontend and Express.js backend, featuring user authentication, password reset functionality, and MySQL database integration.

## Info

### Frontend
- **React** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single-page application

### Backend
- **Express.js** - Fast, minimalist web framework for Node.js
- **MySQL** - Reliable relational database
- **Session Management** - Secure user sessions with express-session

## Project Structure

```
express-app/
├── client/               # React frontend
│   ├── src/
│   │   ├── Components/     # Reusable React components
│   │   ├── Pages/          # Application pages
│   │   ├── contexts/       # React context providers
│   │   └── styles/         # Modular CSS files
│   └── package.json
├── server/               # Express.js backend
│   ├── server.js           # Main server file
│   ├── db.js               # Database connection and utilities
│   ├── dbschema.sql        # Database schema
│   └── package.json
└── README.md
```

The client will run on localhost:3000
The server will run on localhost:5000

## Available Pages

- **Home** (`/`) - Landing page
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration
- **About** (`/about`) - Application information
- **Forgot Password** (`/forgot-password`) - Password recovery
- **Reset Password** (`/reset`) - Password reset with token
- **Logout** (`/logout`) - Session termination

## Dependencies

### Client Dependencies

- **React (latest)** (+ react-dom, react-router-dom)
  - Used for the frontend to create pages that use state.

### Server Dependencies

- **bcrypt**
  - A library used for password hashing.
- **chalk**
  - Used for logging to the terminal with colour.
- **cors**
  - Express middleware for allowing CORS between our different localhosts.
- **express**
  - Our website's backend runs using this.
- **express-session**
  - We use express-session for storing users who are logged in.
- **mysql2**
  - Used for connecting to a MySQL database.

## Development

### Database Schema
The database schema is automatically applied on first run. Check `server/dbschema.sql` for the table structure.

