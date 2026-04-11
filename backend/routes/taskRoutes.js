// ============================================
// routes/taskRoutes.js — Task Routes
// ============================================
// All task routes are PROTECTED (verifyToken required).
// A user can only access their own tasks.
//
// API Design:
//   GET    /api/tasks      → Get all my tasks
//   POST   /api/tasks      → Create a new task
//   PUT    /api/tasks/:id  → Update a task (status, title, etc.)
//   DELETE /api/tasks/:id  → Delete a task

const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskControllers');
const { verifyToken } = require('../middleware/authMiddleware');

// All routes below need authentication
// router.route() is a shorthand to chain multiple methods on the same path

router.route('/')
    .get(verifyToken, getTasks)       // GET /api/tasks
    .post(verifyToken, createTask);   // POST /api/tasks

router.route('/:id')
    .put(verifyToken, updateTask)     // PUT /api/tasks/:id
    .delete(verifyToken, deleteTask); // DELETE /api/tasks/:id

module.exports = router;
