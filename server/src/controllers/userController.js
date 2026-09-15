const User = require('../models/User');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users
const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('name email role').sort({ name: 1 });
  return sendSuccess(res, 200, users);
});

module.exports = { listUsers };
