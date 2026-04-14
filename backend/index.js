// ============================================
// index.js — Server Entry Point
// ============================================
// This is the FIRST file that runs when you do: npm run dev
// It sets up Express, connects to DB, and starts listening.
//
// EXECUTION ORDER:
// 1. Load environment variables (.env)
// 2. Import everything
// 3. Create Express app
// 4. Add middleware (JSON parser, CORS)
// 5. Mount routes
// 6. Add error handlers
// 7. Connect to DB
// 8. Start server

// ---- STEP 1: Load .env FIRST (before anything else uses process.env) ----
const dotenv = require('dotenv');
dotenv.config();

// ---- STEP 2: Imports ----
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const teamRoutes = require('./routes/teamRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// ---- STEP 3: Create app ----
const app = express();

// ---- STEP 4: Middleware ----
// Middleware = functions that run BEFORE your routes.

// express.json() parses JSON from request body
// Without this, req.body would be undefined
app.use(express.json());

// CORS = Cross-Origin Resource Sharing
// Your frontend (localhost:5173) and backend (localhost:3001) are DIFFERENT origins.
// Without CORS, the browser would BLOCK the frontend from talking to the backend.
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ---- STEP 5: Mount Routes ----
// app.use('/api/auth', authRoutes) means:
//   All routes in authRoutes get prefixed with /api/auth
//   So router.post('/login') becomes → POST /api/auth/login
//   This keeps URLs organized and RESTful.

app.use('/api/auth', authRoutes);       // /api/auth/login, /api/auth/signup, /api/auth/me
app.use('/api/tasks', taskRoutes);      // /api/tasks, /api/tasks/:id
app.use('/api/projects', projectRoutes); // /api/projects, /api/projects/:id
app.use('/api/teams', teamRoutes);
// ---- STEP 6: Error Handling ----
// These MUST come AFTER routes.
// notFound catches any URL that didn't match a route.
// errorHandler catches all errors thrown in controllers.
app.use(notFound);
app.use(errorHandler);

// ---- STEP 7 & 8: Connect DB, then Start Server ----
const PORT = process.env.PORT || 3001;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});