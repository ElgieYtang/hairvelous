/**
 * Profile Routes
 * Location: backend/routes/profileRoutes.js
 * Purpose: Define profile endpoints (basic details, photo, credential docs)
 */
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { requireAuth } = require('../middleware/auth');
const requireConsultationAccess = require('../middleware/requireConsultationAccess');
const { validateUpdateProfile } = require('../middleware/validation');
const { uploadProfilePhoto: multerProfilePhoto, uploadCredentialDocs: multerCredentialDocs } = require('../config/upload');

router.get(
  '/consultation-specialists',
  requireAuth,
  requireConsultationAccess,
  profileController.listConsultationSpecialists
);
router.get('/', requireAuth, profileController.getProfile);
router.patch('/', requireAuth, validateUpdateProfile, profileController.updateProfile);
router.post('/photo', requireAuth, multerProfilePhoto.single('photo'), profileController.uploadProfilePhoto);
router.post('/documents', requireAuth, multerCredentialDocs, profileController.uploadCredentialDocs);
router.post('/documents/submit', requireAuth, profileController.submitIdVerification);
router.delete('/documents/:id', requireAuth, profileController.deleteCredentialDoc);

module.exports = router;
