const consultationService = require('../services/consultationService');

class ConsultationController {
  async create(req, res, next) {
    try {
      const result = await consultationService.createRequest(req.user.userId, req.body || {});
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const consultations = await consultationService.listConsultations(req.user);
      res.json({ consultations });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await consultationService.updateConsultation(
        req.user,
        req.params.consultationId,
        req.body || {}
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteConsultation(req, res, next) {
    try {
      const result = await consultationService.deleteConsultationAsOwner(req.user, req.params.consultationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async listMessages(req, res, next) {
    try {
      const result = await consultationService.listMessages(req.user, req.params.consultationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const body = { ...(req.body || {}) };
      if (req.file) {
        body.imageRelativePath = `uploads/consultation-chat/${req.file.filename}`;
      }
      const result = await consultationService.sendMessage(req.user, req.params.consultationId, body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const result = await consultationService.deleteMessage(
        req.user,
        req.params.consultationId,
        req.params.messageId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async submitPayment(req, res, next) {
    try {
      const body = { ...(req.body || {}) };
      if (req.file) {
        body.receiptRelativePath = `uploads/consultation-payments/${req.file.filename}`;
      }
      const result = await consultationService.submitPaymentProof(req.user, req.params.consultationId, body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async submitDemoPayment(req, res, next) {
    try {
      const result = await consultationService.submitDemoPayment(req.user, req.params.consultationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async createPayMongoCheckout(req, res, next) {
    try {
      const result = await consultationService.createPayMongoCheckoutForOwner(
        req.user,
        req.params.consultationId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async createPayMongoQr(req, res, next) {
    try {
      const result = await consultationService.createPayMongoQrForOwner(req.user, req.params.consultationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async syncPayMongo(req, res, next) {
    try {
      const result = await consultationService.syncPayMongoPaymentIntentForOwner(
        req.user,
        req.params.consultationId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async specialistAnalytics(req, res, next) {
    try {
      if (req.user.roleName !== 'specialist') {
        return res.status(403).json({ error: 'Specialist access only' });
      }
      const data = await consultationService.getSpecialistAnalytics(req.user.userId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async clientConsultSummary(req, res, next) {
    try {
      const data = await consultationService.getClientConsultSummary(req.user, req.params.consultationId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async submitFeedback(req, res, next) {
    try {
      const result = await consultationService.submitFeedback(
        req.user,
        req.params.consultationId,
        req.body || {}
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getFeedback(req, res, next) {
    try {
      const result = await consultationService.getFeedback(req.user, req.params.consultationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async specialistFeedbackSummaries(req, res, next) {
    try {
      const raw = String(req.query.specialistUserIds || '')
        .split(',')
        .map((v) => Number(v.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      const result = await consultationService.getSpecialistFeedbackSummaries(raw);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async specialistRevenue(req, res, next) {
    try {
      const result = await consultationService.getSpecialistRevenue(req.user);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async requestSpecialistPayout(req, res, next) {
    try {
      const result = await consultationService.requestSpecialistPayout(req.user);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async adminTransactionReport(req, res, next) {
    try {
      const result = await consultationService.getAdminTransactionReport(req.user);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async adminPayoutRequests(req, res, next) {
    try {
      const result = await consultationService.listPayoutRequests(req.user);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async adminProcessPayoutRequest(req, res, next) {
    try {
      const result = await consultationService.processPayoutRequest(
        req.user,
        req.params.payoutRequestId,
        req.body || {}
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConsultationController();
