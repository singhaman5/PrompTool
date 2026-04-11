// ============================================
// controllers/projectController.js — Project CRUD
// ============================================
// CRUD = Create, Read, Update, Delete
// These are the 4 basic operations for any resource.
// All routes here are PROTECTED (user must be logged in).

const Project = require('../models/Project');

// ========== 1. GET ALL PROJECTS ==========
// GET /api/projects
// Returns only projects created by the logged-in user

const getProjects = async (req, res, next) => {
    try {
        // Find all projects where createdBy matches the logged-in user's ID
        // .sort({ createdAt: -1 }) = newest first
        const projects = await Project.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: projects });
    } catch (error) {
        next(error);
    }
};

// ========== 2. GET SINGLE PROJECT ==========
// GET /api/projects/:id
// :id is a URL parameter — e.g., /api/projects/abc123

const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,        // Match the project ID from URL
            createdBy: req.user._id    // Make sure it belongs to this user
        });

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

// ========== 3. CREATE PROJECT ==========
// POST /api/projects
// Body: { title, description, color }

const createProject = async (req, res, next) => {
    try {
        const { title, description, color } = req.body;

        const project = await Project.create({
            title,
            description,
            color,
            createdBy: req.user._id    // Link project to logged-in user
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    } catch (error) {
        next(error);
    }
};

// ========== 4. UPDATE PROJECT ==========
// PUT /api/projects/:id
// Body: any fields to update { title?, description?, status?, color? }

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },  // Find condition
            req.body,                                           // New data
            { new: true, runValidators: true }                  // Options:
            //   new: true → return the UPDATED document (not the old one)
            //   runValidators: true → still check enum/required rules
        );

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        res.json({ success: true, data: project });
    } catch (error) {
        next(error);
    }
};

// ========== 5. DELETE PROJECT ==========
// DELETE /api/projects/:id

const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!project) {
            res.status(404);
            throw new Error('Project not found');
        }

        res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
