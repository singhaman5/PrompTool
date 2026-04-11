// ============================================
// middleware/authMiddleware.js — Protect Routes
// ============================================
// PURPOSE: Check if the user is logged in before allowing access.
//
// HOW JWT AUTH WORKS (step by step):
// 1. User logs in → server creates a JWT token → sends it to frontend
// 2. Frontend stores token in localStorage
// 3. Frontend sends token in EVERY request header: "Authorization: Bearer <token>"
// 4. THIS middleware reads that header, decodes the token, and finds the user
// 5. If valid → allows the request to continue (calls next())
// 6. If invalid → sends 401 Unauthorized
//
// USAGE IN ROUTES:
//   router.get('/tasks', verifyToken, getTasks)
//   ↑ verifyToken runs BEFORE getTasks. If it fails, getTasks never runs.

const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const verifyToken = async (req, res, next) => {
    try {
        // ---- STEP 1: Get token from request header ----
        // Header looks like: "Authorization: Bearer eyJhbGciOi..."
        // We split by space and take the second part (the actual token)
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : null;

        if (!token) {
            res.status(401);
            throw new Error('Not authorized — no token provided');
        }

        // ---- STEP 2: Verify (decode) the token ----
        // jwt.verify checks: is this token valid? has it expired?
        // If valid, it returns the payload we stored: { id: "user_id_here" }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ---- STEP 3: Find the user in database ----
        // We use the ID from the token to find the real user
        // .select('-password') = get everything EXCEPT password
        req.user = await UserModel.findById(decoded.id).select('-password');

        if (!req.user) {
            res.status(401);
            throw new Error('Not authorized — user not found');
        }

        // ---- STEP 4: Allow request to continue ----
        // req.user is now available in ALL subsequent controllers
        // So in taskController, we can do: req.user._id
        next();
    } catch (error) {
        res.status(401);
        next(new Error('Not authorized — invalid token'));
    }
};

module.exports = { verifyToken };
