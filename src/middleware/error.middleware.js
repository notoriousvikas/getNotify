// Custom error class
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Validation Error class for Zod / input errors
export class ValidationError extends AppError {
    constructor(message = "Validation failed", errors = []) {
        super(message, 400);
        this.errors = errors;
        
    }
}

// Error handler wrapper for async functions
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export const notificationSchema = catchAsync;

// Global Express error handler middleware
export const errorHandler = (err, req, res, next) => {
    console.error(err)
    const statusCode = err.statusCode || 500;
    const status = err.status || "error";

    res.status(statusCode).json({
        status,
        message: err.message || "Internal server error",
        ...(err.errors && { errors: err.errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
