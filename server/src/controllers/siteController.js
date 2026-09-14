const sanitizeHtml = require('sanitize-html');
const Site = require('../models/Site');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// Strips any HTML/script content from free-text fields before it's stored,
// so a note like "<script>alert(1)</script>" is neutralized at write time
// rather than trusted and rendered verbatim later.
function clean(text) {
  if (typeof text !== 'string') return text;
  return sanitizeHtml(text, { allowedTags: [], allowedAttributes: {} }).trim();
}

// GET /api/sites?page=1&limit=10&status=critical&search=acme
const listSites = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const { status, search } = req.query;

  const filter = {};
  if (status) {
    if (!['healthy', 'warning', 'critical'].includes(status)) {
      throw ApiError.badRequest('status filter must be healthy, warning, or critical');
    }
    filter.status = status;
  }
  if (search) {
    filter.$text = { $search: clean(String(search)) };
  }

  const [items, total] = await Promise.all([
    Site.find(filter)
      .populate('owner', 'name email')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Site.countDocuments(filter),
  ]);

  return sendSuccess(res, 200, items, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  });
});

// GET /api/sites/:id
const getSite = asyncHandler(async (req, res) => {
  const site = await Site.findById(req.params.id).populate('owner', 'name email');
  if (!site) throw ApiError.notFound('Site not found');
  return sendSuccess(res, 200, site);
});

// POST /api/sites (admin only)
const createSite = asyncHandler(async (req, res) => {
  const { name, url, status, lastChecked, notes, owner } = req.body;

  const site = await Site.create({
    name: clean(name),
    url: clean(url),
    status,
    lastChecked: lastChecked || Date.now(),
    notes: clean(notes || ''),
    owner: owner || req.user._id,
  });

  const populated = await site.populate('owner', 'name email');
  return sendSuccess(res, 201, populated);
});

// PATCH /api/sites/:id (admin only)
const updateSite = asyncHandler(async (req, res) => {
  const site = await Site.findById(req.params.id);
  if (!site) throw ApiError.notFound('Site not found');

  const { name, url, status, lastChecked, notes, owner } = req.body;
  if (name !== undefined) site.name = clean(name);
  if (url !== undefined) site.url = clean(url);
  if (status !== undefined) site.status = status;
  if (lastChecked !== undefined) site.lastChecked = lastChecked;
  if (notes !== undefined) site.notes = clean(notes);
  if (owner !== undefined) site.owner = owner;

  await site.save();
  const populated = await site.populate('owner', 'name email');
  return sendSuccess(res, 200, populated);
});

// DELETE /api/sites/:id (admin only)
const deleteSite = asyncHandler(async (req, res) => {
  const site = await Site.findById(req.params.id);
  if (!site) throw ApiError.notFound('Site not found');

  await site.deleteOne();
  return sendSuccess(res, 200, { id: req.params.id });
});

module.exports = { listSites, getSite, createSite, updateSite, deleteSite };
