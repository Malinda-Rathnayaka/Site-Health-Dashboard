const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { listUsers } = require('../controllers/userController');

const router = express.Router();

router.use(requireAuth);

// Only admins can view all users for assigning owners
router.get('/', requireRole('admin'), listUsers);

module.exports = router;
