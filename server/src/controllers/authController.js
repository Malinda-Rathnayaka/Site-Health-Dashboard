const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

// POST /api/auth/register
// Anyone can register as a viewer. Admin accounts are provisioned by an
// existing admin (see userController) rather than self-service, so a
// stranger can never grant themselves write access. See README for how to
// create the first admin.
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with that email already exists');
  }

  const user = await User.create({ name, email, password, role: 'viewer' });
  const token = signToken(user);

  return sendSuccess(res, 201, { user: publicUser(user), token });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  // Same error message whether the email doesn't exist or the password is
  // wrong, so we don't leak which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken(user);
  return sendSuccess(res, 200, { user: publicUser(user), token });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  return sendSuccess(res, 200, { user: publicUser(req.user) });
});

module.exports = { register, login, me };
