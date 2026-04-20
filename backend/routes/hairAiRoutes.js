/**
 * Hair AI Routes
 * Location: backend/routes/hairAiRoutes.js
 * Purpose: Analyze hair/scalp from uploaded image using Gemini, with assessment context
 */
const express = require('express');
const router = express.Router();
const hairAiController = require('../controllers/hairAiController');
const { requireAuth } = require('../middleware/auth');

router.post('/analyze', requireAuth, hairAiController.analyze);

module.exports = router;

