const express = require('express');
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');
const {
  listSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
} = require('../controllers/siteController');

const router = express.Router();

const mongoIdParam = param('id').isMongoId().withMessage('Invalid id');

const siteCreateValidators = [
  body('name').trim().isLength({ min: 1, max: 120 }).withMessage('Name is required (max 120 chars)'),
  body('url').trim().matches(/^https?:\/\/.+/i).withMessage('URL must start with http:// or https://'),
  body('status').optional().isIn(['healthy', 'warning', 'critical']).withMessage('Invalid status'),
  body('lastChecked').optional().isISO8601().withMessage('lastChecked must be a valid date'),
  body('notes').optional().isString().isLength({ max: 2000 }).withMessage('Notes too long (max 2000 chars)'),
  body('owner').optional().isMongoId().withMessage('owner must be a valid user id'),
];

const siteUpdateValidators = [
  body('name').optional().trim().isLength({ min: 1, max: 120 }),
  body('url').optional().trim().matches(/^https?:\/\/.+/i).withMessage('URL must start with http:// or https://'),
  body('status').optional().isIn(['healthy', 'warning', 'critical']).withMessage('Invalid status'),
  body('lastChecked').optional().isISO8601().withMessage('lastChecked must be a valid date'),
  body('notes').optional().isString().isLength({ max: 2000 }).withMessage('Notes too long (max 2000 chars)'),
  body('owner').optional().isMongoId().withMessage('owner must be a valid user id'),
];

// All site routes require a logged-in user.
router.use(requireAuth);

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['healthy', 'warning', 'critical']),
    query('search').optional().isString().isLength({ max: 200 }),
  ],
  validate,
  listSites
);

router.get('/:id', [mongoIdParam], validate, getSite);

// Mutations are admin-only. A viewer hitting these gets a 403 via requireRole,
// never a 500 - the route exists, they're just not allowed to use it.
router.post('/', requireRole('admin'), siteCreateValidators, validate, createSite);
router.patch('/:id', requireRole('admin'), [mongoIdParam, ...siteUpdateValidators], validate, updateSite);
router.delete('/:id', requireRole('admin'), [mongoIdParam], validate, deleteSite);

module.exports = router;
