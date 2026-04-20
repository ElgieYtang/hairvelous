/**
 * Admin Routes
 * Location: backend/routes/adminRoutes.js
 * Purpose: Define admin endpoints
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { body } = require('express-validator');

router.get('/clients', requireAdmin, adminController.listClients);
router.get('/users', requireAdmin, adminController.listUsers);
router.post('/users', requireAdmin, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('roleName')
    .isIn(['specialist'])
    .withMessage('Role must be specialist'),
], adminController.createUserAccount);
router.get('/users/:userId/id-verification', requireAdmin, adminController.getSpecialistVerificationDetails);
router.post('/users/:userId/id-verification', requireAdmin, [
  body('status').isIn(['verified', 'rejected', 'pending_review']).withMessage('Invalid verification status'),
], adminController.setSpecialistVerificationStatus);
router.patch('/users/:userId/status', requireAdmin, adminController.toggleUserStatus);
router.post('/users/:userId/reset-password', requireAdmin, [
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], adminController.resetUserPassword);
router.get('/reports', requireAdmin, adminController.getReports);
router.post(
  '/consultations/:consultationId/verify-payment',
  requireAdmin,
  adminController.verifyConsultationPayment
);
router.post(
  '/consultations/:consultationId/reject-payment',
  requireAdmin,
  adminController.rejectConsultationPayment
);

module.exports = router;
