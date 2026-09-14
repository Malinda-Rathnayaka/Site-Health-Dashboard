const ApiError = require('../utils/ApiError');
const { sendError } = require('../utils/ApiResponse');

// 404 fallback for unmatched routes.
function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Single place where every error in the app is turned into a response.
// - Known ApiError instances: pass through their status/message/details.
// - Mongoose validation errors: mapped to a 400 with field-level details.
// - Mongoose duplicate-key errors: mapped to a 409.
// - Anything else (bugs, driver errors): logged server-side, 500 returned
//   to the client with a generic message. Stack traces never leave the server.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return sendError(res, err.statusCode, err.message, err.details);
  }

  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return sendError(res, 400, 'Validation failed', details);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, 409, `That ${field} is already in use`);
  }

  if (err.name === 'CastError') {
    return sendError(res, 400, `Invalid value for ${err.path}`);
  }

  // Unexpected error - log full detail server-side only.
  console.error('[unhandled error]', err);
  return sendError(res, 500, 'Something went wrong on our end. Please try again.');
}

module.exports = { notFoundHandler, errorHandler };
