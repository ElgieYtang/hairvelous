const express = require('express');
const consultationController = require('../controllers/consultationController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const requireConsultationAccess = require('../middleware/requireConsultationAccess');
const { uploadConsultationMessage, uploadConsultationPaymentReceipt } = require('../config/upload');

const router = express.Router();

/** Multer skips non-multipart requests (JSON body already parsed by express.json). */
router.post('/', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.create(req, res, next)
);
router.get('/', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.list(req, res, next)
);
router.get('/specialist/analytics', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.specialistAnalytics(req, res, next)
);
router.get('/specialist-feedback-summaries', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.specialistFeedbackSummaries(req, res, next)
);
router.get('/specialist-feedback/:specialistUserId', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.specialistFeedbackList(req, res, next)
);
router.get('/specialist/revenue', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.specialistRevenue(req, res, next)
);
router.post('/specialist/presence', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.specialistPresence(req, res, next)
);
router.post('/specialist/payout-request', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.requestSpecialistPayout(req, res, next)
);
router.get('/admin/transactions', requireAdmin, (req, res, next) =>
  consultationController.adminTransactionReport(req, res, next)
);
router.get('/admin/payout-requests', requireAdmin, (req, res, next) =>
  consultationController.adminPayoutRequests(req, res, next)
);
router.patch('/admin/payout-requests/:payoutRequestId', requireAdmin, (req, res, next) =>
  consultationController.adminProcessPayoutRequest(req, res, next)
);
router.get('/:consultationId/client-summary', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.clientConsultSummary(req, res, next)
);
router.get('/:consultationId/feedback', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.getFeedback(req, res, next)
);
router.post('/:consultationId/feedback', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.submitFeedback(req, res, next)
);
router.patch('/:consultationId', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.update(req, res, next)
);
router.delete('/:consultationId', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.deleteConsultation(req, res, next)
);
/** POST fallback — some proxies block DELETE; same behavior as DELETE /:consultationId */
router.post('/:consultationId/delete', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.deleteConsultation(req, res, next)
);
router.get('/:consultationId/messages', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.listMessages(req, res, next)
);
router.delete('/:consultationId/messages/:messageId', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.deleteMessage(req, res, next)
);
router.post(
  '/:consultationId/messages',
  requireAuth,
  requireConsultationAccess,
  uploadConsultationMessage.single('photo'),
  (req, res, next) => consultationController.sendMessage(req, res, next)
);
router.post(
  '/:consultationId/payment-proof',
  requireAuth,
  requireConsultationAccess,
  uploadConsultationPaymentReceipt.single('receipt'),
  (req, res, next) => consultationController.submitPayment(req, res, next)
);
router.post('/:consultationId/demo-payment', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.submitDemoPayment(req, res, next)
);
router.post('/:consultationId/paymongo/checkout', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.createPayMongoCheckout(req, res, next)
);
router.post('/:consultationId/paymongo/qr', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.createPayMongoQr(req, res, next)
);
router.get('/:consultationId/paymongo/sync', requireAuth, requireConsultationAccess, (req, res, next) =>
  consultationController.syncPayMongo(req, res, next)
);

module.exports = router;
