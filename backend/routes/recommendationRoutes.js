/**
 * Recommendation Routes
 * Location: backend/routes/recommendationRoutes.js
 * Purpose: Define recommendation endpoints
 */
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// Generate from user's profile (requires auth)
router.get('/profile', requireAuth, recommendationController.generateFromProfile);
router.post('/profile', requireAuth, recommendationController.generateFromProfile);

// Generate from direct input (for testing/demo - optional auth)
router.post('/generate', optionalAuth, recommendationController.generateFromInput);

// Get user's saved recommendations
router.get('/saved', requireAuth, recommendationController.getUserRecommendations);

module.exports = router;
