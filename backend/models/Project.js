// ============================================
// models/Project.js — Project Schema & Model
// ============================================
// A Project groups related tasks together.
// Example: "Website Redesign" project has 24 tasks inside it.

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Active', 'Completed', 'On Hold'],  // Only these 3 values allowed
        default: 'Active'
    },
    color: {
        // For the UI — each project card has a color theme
        type: String,
        default: 'orange'
    },
    // ---- WHO CREATED THIS PROJECT? ----
    // This links to the User model using their _id
    // "ref: 'users'" tells Mongoose which collection to look up
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, {
    timestamps: true    // Adds createdAt, updatedAt automatically
});

module.exports = mongoose.model('Project', ProjectSchema);
