// ============================================
// middleware/errorMiddleware.js — Global Error Handler
// ============================================
// PURPOSE: Catch ALL errors in one place.
// WITHOUT THIS: Every controller needs its own try/catch with error formatting.
// WITH THIS:    Controllers just throw errors, and this catches them all.
//
// HOW IT WORKS:
// Express has a special middleware pattern: (err, req, res, next)
// When any route calls next(error) or throws, Express jumps here.

const errorHandler = (err, req, res, next) => {
    // If status code was already set, use it. Otherwise default to 500 (server error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Something went wrong';

    // ---- HANDLE SPECIFIC MONGOOSE ERRORS ----

    // 1. Bad ObjectId (e.g., GET /tasks/invalid-id-here)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    // 2. Duplicate key (e.g., signup with email that already exists)
    if (err.code === 11000) {
        statusCode = 400;
        message = 'Email already exists';
    }

    // 3. Validation errors (e.g., missing required fields)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        // Combine all validation errors into one message
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message,
        // Show error stack trace only in development (helps debugging)
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

// "Not Found" middleware — runs when no route matches the URL
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);  // Pass to errorHandler above
};

module.exports = { errorHandler, notFound };
