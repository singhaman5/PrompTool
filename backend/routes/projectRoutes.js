// ============================================
// routes/projectRoutes.js — Project Routes
// ============================================
// All project routes are PROTECTED.
//
// API Design:
//   GET    /api/projects      → Get all my projects
//   POST   /api/projects      → Create a new project
//   GET    /api/projects/:id  → Get one project
//   PUT    /api/projects/:id  → Update a project
//   DELETE /api/projects/:id  → Delete a project

const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { verifyToken } = require('../middleware/authMiddleware');

router.route('/')
    .get(verifyToken, getProjects)
    .post(verifyToken, createProject);

router.route('/:id')
    .get(verifyToken, getProject)
    .put(verifyToken, updateProject)
    .delete(verifyToken, deleteProject);

module.exports = router;
