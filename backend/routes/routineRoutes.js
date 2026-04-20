/**
 * Routine Routes
 * Location: backend/routes/routineRoutes.js
 * Purpose: Define routine tracking endpoints
 */
const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const { requireAuth } = require('../middleware/auth');
const { validateRoutineLog } = require('../middleware/validation');
const upload = require('../config/upload');

router.post('/logs', requireAuth, validateRoutineLog, routineController.createLog);
router.post('/logs/media', requireAuth, upload.single('media'), routineController.createLogWithMedia);
router.get('/logs', requireAuth, routineController.getUserLogs);
router.get('/progress', requireAuth, routineController.getProgressSummary);
router.get('/analytics', requireAuth, routineController.getAdvancedAnalytics);
router.get('/reminders', requireAuth, routineController.getReminders);
router.patch('/logs/:routineId', requireAuth, routineController.updateLog);
router.delete('/logs/:routineId', requireAuth, routineController.deleteLog);

module.exports = router;