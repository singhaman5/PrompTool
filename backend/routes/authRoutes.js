// ============================================
// routes/authRoutes.js — Authentication Routes
// ============================================
// ROUTES define: "When someone visits THIS URL, run THIS function."
// Routes are THIN — they only map URLs to controller functions.
// All the logic lives in the controllers.
//
// Route Pattern:
//   router.METHOD('/path', middleware?, controllerFunction)
//
// API Design:
//   POST /api/auth/signup  → Create account (public)
//   POST /api/auth/login   → Sign in (public)
//   GET  /api/auth/me      → Get my profile (protected)

const express = require('express');
const router = express.Router();
const { signup, login, getMe, getAllUsers } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes (anyone can access)
router.post('/signup', signup);
router.post('/login', login);

// Protected route (must be logged in)
// verifyToken runs FIRST → if token is valid → getMe runs
router.get('/me', verifyToken, getMe);
router.get('/users', verifyToken, getAllUsers);

module.exports = router;
