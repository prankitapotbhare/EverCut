/**
 * Standardized error response format
 * @param {string} message - Error message
 * @param {number} code - Error code (optional)
 * @param {Object} details - Additional error details (optional)
 * @returns {Object} Formatted error response
 */
const getErrorResponse = (message, code = null, details = null) => {
  const response = {
    success: false,
    error: {
      message: message || 'An unexpected error occurred'
    }
  };

  if (code) {
    response.error.code = code;
  }

  if (details) {
    response.error.details = details;
  }

  return response;
};

/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware for Express
 */
const errorHandler = (err, req, res, next) => {
  // Skip logging 404 errors in test environment
  if (!(process.env.NODE_ENV === 'test' && err.statusCode === 404)) {
    console.error('Error:', err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      getErrorResponse(err.message, err.statusCode, err.details)
    );
  }

  // Handle Firebase Admin errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json(
      getErrorResponse(err.message || 'Authentication error', err.code)
    );
  }

  // Default error response
  return res.status(500).json(
    getErrorResponse('Internal server error')
  );
};

module.exports = {
  getErrorResponse,
  ApiError,
  errorHandler
};