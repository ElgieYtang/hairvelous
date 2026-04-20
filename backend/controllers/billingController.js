const path = require('path');
const billingService = require('../services/billingService');

class BillingController {
  async listPlans(req, res, next) {
    try {
      const plans = await billingService.listPlans();
      res.json({ plans });
    } catch (err) {
      next(err);
    }
  }

  async status(req, res, next) {
    try {
      const status = await billingService.getStatus(req.user.userId);
      res.json({ status });
    } catch (err) {
      next(err);
    }
  }

  async submitGcash(req, res, next) {
    try {
      const receiptPath = req.file
        ? path.relative(path.join(__dirname, '..', '..'), req.file.path).replace(/\\/g, '/')
        : null;
      const result = await billingService.submitGcashPayment(req.user.userId, req.body || {}, receiptPath);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async submitCard(req, res, next) {
    try {
      const receiptPath = req.file
        ? path.relative(path.join(__dirname, '..', '..'), req.file.path).replace(/\\/g, '/')
        : null;
      const result = await billingService.submitCardPayment(req.user.userId, req.body || {}, receiptPath);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async activateProDirect(req, res, next) {
    try {
      const result = await billingService.activateProDirect(req.user.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async activateFreeDirect(req, res, next) {
    try {
      const result = await billingService.activateFreeDirect(req.user.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async exportProgressReport(req, res, next) {
    try {
      const status = await billingService.getStatus(req.user.userId);
      if (!status.isPro) {
        return res.status(403).json({ error: 'Progress export is available for Pro users only' });
      }
      const report = await billingService.getProgressReport(req.user.userId);
      res.json({ report });
    } catch (err) {
      next(err);
    }
  }

  async listPayments(req, res, next) {
    try {
      const payments = await billingService.listPayments(req.query.status || null);
      res.json({ payments });
    } catch (err) {
      next(err);
    }
  }

  async approvePayment(req, res, next) {
    try {
      const result = await billingService.reviewPayment(
        req.user.userId,
        req.params.paymentId,
        'approve',
        req.body && req.body.adminNote
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async rejectPayment(req, res, next) {
    try {
      const result = await billingService.reviewPayment(
        req.user.userId,
        req.params.paymentId,
        'reject',
        req.body && req.body.adminNote
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BillingController();
