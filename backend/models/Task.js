// ============================================
// models/Task.js — Task Schema & Model
// ============================================
// Tasks are the core of the app. Each task belongs to a user
// and optionally belongs to a project.

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Task title is required'],
        trim: true
    },
    description: { 
        type: String,
        default: ''
    },
    // ---- LINK TO PROJECT ----
    // Before: project was just a String (text)
    // Now: it references the Project model by its _id
    // This lets us do: Task.find().populate('project') to get full project details
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null       // A task can exist without a project
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],  // Only these 3 values allowed
        default: 'Todo'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    // ---- WHO CREATED THIS TASK? ----
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { 
    timestamps: true    // createdAt + updatedAt
});

module.exports = mongoose.model("Task", taskSchema);