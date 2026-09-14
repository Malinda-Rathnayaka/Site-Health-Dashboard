// Every endpoint responds with the same envelope shape, success or failure,
// so the client never has to guess the response structure per-route.
//
// Success: { success: true, data: <payload>, meta?: {...} }
// Error:   { success: false, error: { message, details? } }

function sendSuccess(res, statusCode, data, meta) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

function sendError(res, statusCode, message, details) {
  const body = { success: false, error: { message } };
  if (details) body.error.details = details;
  return res.status(statusCode).json(body);
}

module.exports = { sendSuccess, sendError };
