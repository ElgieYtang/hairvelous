/**
 * Guide Routes
 * Location: backend/routes/guideRoutes.js
 * Purpose: Define DIY guide endpoints
 */
const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');
const { validateGuide } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, guideController.listGuides);
router.get('/:guideId', optionalAuth, guideController.getGuide);

// Admin routes
router.post('/', requireAdmin, validateGuide, guideController.createGuide);
router.put('/:guideId', requireAdmin, guideController.updateGuide);
router.patch('/:guideId', requireAdmin, guideController.updateGuide); // Support both PUT and PATCH
router.delete('/:guideId', requireAdmin, guideController.deleteGuide);

module.exports = router;
