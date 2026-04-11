// ============================================
// utils/generateToken.js — JWT Token Helper
// ============================================
// PURPOSE: Generate a JWT token for a user.
// WHY SEPARATE FILE? We generate tokens in both login and signup,
// so we put it in one place to avoid repeating ourselves (DRY principle).

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    // jwt.sign(payload, secret, options)
    //   payload: what data to store inside the token (user's ID)
    //   secret:  the key used to encrypt/decrypt (from .env)
    //   expiresIn: when the token becomes invalid
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

module.exports = generateToken;
