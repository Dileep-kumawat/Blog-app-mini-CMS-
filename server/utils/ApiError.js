/**
 * Extends the native Error class with an HTTP status code.
 * Throwing an ApiError inside any async route handler will be caught
 * by the global error middleware and formatted consistently.
 */
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguish from unexpected programmer errors
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Wraps an async Express handler so we never need try/catch boilerplate
 * in every controller. Errors propagate to the global errorHandler middleware.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
