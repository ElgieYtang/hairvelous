const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../config/upload');
const billingController = require('../controllers/billingController');

const router = express.Router();

router.get('/plans', requireAuth, (req, res, next) => billingController.listPlans(req, res, next));
router.get('/status', requireAuth, (req, res, next) => billingController.status(req, res, next));
router.post('/gcash/submit', requireAuth, upload.single('receipt'), (req, res, next) =>
  billingController.submitGcash(req, res, next)
);
router.post('/card/submit', requireAuth, upload.single('receipt'), (req, res, next) =>
  billingController.submitCard(req, res, next)
);
router.post('/activate-pro', requireAuth, (req, res, next) =>
  billingController.activateProDirect(req, res, next)
);
router.post('/activate-free', requireAuth, (req, res, next) =>
  billingController.activateFreeDirect(req, res, next)
);
router.get('/report/export', requireAuth, (req, res, next) => billingController.exportProgressReport(req, res, next));

router.get('/payments', requireAuth, requireAdmin, (req, res, next) => billingController.listPayments(req, res, next));
router.patch('/payments/:paymentId/approve', requireAuth, requireAdmin, (req, res, next) =>
  billingController.approvePayment(req, res, next)
);
router.patch('/payments/:paymentId/reject', requireAuth, requireAdmin, (req, res, next) =>
  billingController.rejectPayment(req, res, next)
);

module.exports = router;
