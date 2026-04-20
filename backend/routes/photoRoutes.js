/**
 * Photo Routes
 * Location: backend/routes/photoRoutes.js
 * Purpose: Define photo upload endpoints
 */
const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const { requireAuth } = require('../middleware/auth');
const upload = require('../config/upload');

router.get('/', requireAuth, photoController.getUserPhotos);
router.post('/', requireAuth, upload.single('photo'), photoController.uploadPhoto);
router.put('/:photoId', requireAuth, upload.single('photo'), photoController.replacePhoto);
router.delete('/:photoId', requireAuth, photoController.deletePhoto);

module.exports = router;
