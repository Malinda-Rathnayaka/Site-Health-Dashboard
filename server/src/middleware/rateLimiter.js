const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/ApiResponse');

// Throttles brute-force login attempts. Keyed by IP by default; in front of
// a proxy/load balancer, set `app.set('trust proxy', 1)` (done in index.js)
// so the real client IP is used instead of the proxy's.
const loginLimiter = rateLimit({
  windowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.LOGIN_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'Too many login attempts. Please try again later.');
  },
});

module.exports = { loginLimiter };
