// ============================================
// controllers/authController.js — Auth Logic
// ============================================
// Controllers contain the BUSINESS LOGIC.
// Routes say "WHICH URL does what", controllers say "HOW to do it".
//
// We have 3 functions here:
//   1. signup  → Create new account
//   2. login   → Sign in and get token
//   3. getMe   → Get current user's profile (requires token)

const UserModel = require('../models/User');
const generateToken = require('../utils/generateToken');

// ========== 1. SIGNUP ==========
// POST /api/auth/signup
// Body: { name, email, password }
// Public (no token needed)

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User with this email already exists');
        }

        // Create user in database
        // NOTE: Password gets auto-hashed by the "pre save" hook in User model
        // We write "password: password" but Mongoose runs bcrypt BEFORE saving
        const user = await UserModel.create({ name, email, password });

        // Send back user info + token
        // The frontend stores this token in localStorage
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);  // Pass error to errorMiddleware
    }
};

// ========== 2. LOGIN ==========
// POST /api/auth/login
// Body: { email, password }
// Public (no token needed)

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        // .select('+password') because we set select:false in the model
        // Without this, password would be undefined and we couldn't compare
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Compare entered password with hashed password in DB
        // matchPassword() is the custom method we defined in User model
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid email or password');
        }

        // Password matched! Send token
        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// ========== 3. GET CURRENT USER ==========
// GET /api/auth/me
// Protected (token required)
// The verifyToken middleware already found the user and put it in req.user

const getMe = async (req, res, next) => {
    try {
        // req.user was set by verifyToken middleware
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find().select('-password -__v');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login, getMe, getAllUsers };
