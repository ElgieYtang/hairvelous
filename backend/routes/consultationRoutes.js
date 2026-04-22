const express = require('express');
const consultationController = require('../controllers/consultationController');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { uploadConsultationMessage, uploadConsultationPaymentReceipt } = require('../config/upload');

const router = express.Router();

/** Multer skips non-multipart requests (JSON body already parsed by express.json). */
router.post('/', requireAuth, (req, res, next) => consultationController.create(req, res, next));
router.get('/', requireAuth, (req, res, next) => consultationController.list(req, res, next));
router.get('/specialist/analytics', requireAuth, (req, res, next) =>
  consultationController.specialistAnalytics(req, res, next)
);
router.get('/specialist-feedback-summaries', requireAuth, (req, res, next) =>
  consultationController.specialistFeedbackSummaries(req, res, next)
);
router.get('/specialist-feedback/:specialistUserId', requireAuth, (req, res, next) =>
  consultationController.specialistFeedbackList(req, res, next)
);
router.get('/specialist/revenue', requireAuth, (req, res, next) =>
  consultationController.specialistRevenue(req, res, next)
);
router.post('/specialist/payout-request', requireAuth, (req, res, next) =>
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
router.get('/:consultationId/client-summary', requireAuth, (req, res, next) =>
  consultationController.clientConsultSummary(req, res, next)
);
router.get('/:consultationId/feedback', requireAuth, (req, res, next) =>
  consultationController.getFeedback(req, res, next)
);
router.post('/:consultationId/feedback', requireAuth, (req, res, next) =>
  consultationController.submitFeedback(req, res, next)
);
router.patch('/:consultationId', requireAuth, (req, res, next) => consultationController.update(req, res, next));
router.delete('/:consultationId', requireAuth, (req, res, next) =>
  consultationController.deleteConsultation(req, res, next)
);
/** POST fallback — some proxies block DELETE; same behavior as DELETE /:consultationId */
router.post('/:consultationId/delete', requireAuth, (req, res, next) =>
  consultationController.deleteConsultation(req, res, next)
);
router.get('/:consultationId/messages', requireAuth, (req, res, next) => consultationController.listMessages(req, res, next));
router.delete('/:consultationId/messages/:messageId', requireAuth, (req, res, next) =>
  consultationController.deleteMessage(req, res, next)
);
router.post(
  '/:consultationId/messages',
  requireAuth,
  uploadConsultationMessage.single('photo'),
  (req, res, next) => consultationController.sendMessage(req, res, next)
);
router.post(
  '/:consultationId/payment-proof',
  requireAuth,
  uploadConsultationPaymentReceipt.single('receipt'),
  (req, res, next) => consultationController.submitPayment(req, res, next)
);
router.post('/:consultationId/demo-payment', requireAuth, (req, res, next) =>
  consultationController.submitDemoPayment(req, res, next)
);
router.post('/:consultationId/paymongo/checkout', requireAuth, (req, res, next) =>
  consultationController.createPayMongoCheckout(req, res, next)
);
router.post('/:consultationId/paymongo/qr', requireAuth, (req, res, next) =>
  consultationController.createPayMongoQr(req, res, next)
);
router.get('/:consultationId/paymongo/sync', requireAuth, (req, res, next) =>
  consultationController.syncPayMongo(req, res, next)
);

module.exports = router;
