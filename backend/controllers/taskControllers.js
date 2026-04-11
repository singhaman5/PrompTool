// ============================================
// controllers/taskControllers.js — Task CRUD
// ============================================
// Full CRUD operations for tasks.
// All routes are PROTECTED — user must be logged in.
// Each user can only see/edit/delete THEIR OWN tasks.

const Task = require('../models/Task');

// ========== 1. GET ALL TASKS ==========
// GET /api/tasks
// Returns all tasks for the logged-in user, newest first

const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id })
            .populate('project', 'title color')   // Replace project ID with {title, color}
            .sort({ createdAt: -1 });              // Newest first

        res.json({ success: true, data: tasks });
    } catch (error) {
        next(error);
    }
};

// ========== 2. CREATE TASK ==========
// POST /api/tasks
// Body: { title, description, project, priority, dueDate, status }

const createTask = async (req, res, next) => {
    try {
        const { title, description, project, priority, dueDate, status } = req.body;

        const newTask = await Task.create({
            title,
            description,
            project: project || null,    // If no project selected, set null
            priority,
            dueDate,
            status,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask
        });
    } catch (error) {
        next(error);
    }
};

// ========== 3. UPDATE TASK ==========
// PUT /api/tasks/:id
// Body: any fields to update { title?, status?, priority?, ... }
// THIS WAS MISSING BEFORE — needed for changing task status on Board, etc.

const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        res.json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

// ========== 4. DELETE TASK ==========
// DELETE /api/tasks/:id

const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user._id
        });

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };