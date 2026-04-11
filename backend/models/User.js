// ============================================
// models/User.js — User Schema & Model
// ============================================
// A "Model" defines the SHAPE of data in MongoDB.
// Think of it as a blueprint: "Every user MUST have a name, email, password."
// Mongoose takes this blueprint and creates a "collection" (table) in MongoDB.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    // ---- FIELD DEFINITIONS ----
    // Each field has a type + validation rules

    name: {
        type: String,
        required: [true, 'Please enter your name'],  // [rule, error message]
        trim: true       // Removes extra spaces: "  John  " → "John"
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,    // No two users can have the same email
        lowercase: true, // "John@Gmail.COM" → "john@gmail.com"
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false    // IMPORTANT: When we do User.find(), password is NOT included
        // We have to explicitly ask: User.findById(id).select('+password')
    },
    role: {
        type: String,
        default: "Member"
    },
    status: {
        type: String,
        enum: ["Online", "Offline", "Busy", "In Meeting"],
        default: "Online"
    },
    tags: {
        type: [String],
        default: []
    },
    color: {
        type: String,
        default: "bg-orange-100 text-orange-600"
    }

}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// ---- MIDDLEWARE (runs BEFORE saving to DB) ----
// "pre save" = "before saving this document, do this first"
// WHY? We NEVER want to store plain text passwords.
// bcrypt converts "mypassword123" → "$2a$10$xJ8k..." (unreadable hash)

UserSchema.pre('save', async function () {
    // Only hash if password was changed (not on every save)
    // Example: If user only updates their name, don't re-hash password
    if (!this.isModified('password')) return;

    // Hash the password with "salt rounds" = 10
    // More rounds = more secure but slower. 10 is the standard.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ---- CUSTOM METHOD ----
// We add a method to every User document to compare passwords.
// Used during login: user.matchPassword("typed_password")
// Returns true/false

UserSchema.methods.matchPassword = async function (enteredPassword) {
    // bcrypt.compare takes the plain text + the hash, and checks if they match
    return await bcrypt.compare(enteredPassword, this.password);
};

// mongoose.model("users", UserSchema) creates a "users" collection in MongoDB
const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
