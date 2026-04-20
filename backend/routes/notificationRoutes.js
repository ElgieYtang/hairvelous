const express = require('express');
const { requireAuth } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

router.get('/', requireAuth, (req, res, next) => notificationController.list(req, res, next));
router.patch('/read-all', requireAuth, (req, res, next) => notificationController.markAllRead(req, res, next));
router.patch('/:notificationId/read', requireAuth, (req, res, next) => notificationController.markRead(req, res, next));

module.exports = router;
