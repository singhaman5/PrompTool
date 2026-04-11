// ============================================
// config/db.js — Database Connection
// ============================================
// PURPOSE: Connect to MongoDB using Mongoose.
// WHY SEPARATE FILE? So index.js stays clean, and we can
// reuse or change the DB logic in one place.

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // mongoose.connect() returns a promise
        // process.env.MONGO_URI comes from our .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        // Exit the process if DB connection fails (can't run without DB)
        process.exit(1);
    }
};

module.exports = connectDB;
