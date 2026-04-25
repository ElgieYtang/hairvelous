/**
 * Admin Controller
 * Location: backend/controllers/adminController.js
 * Purpose: Handle HTTP requests for admin operations
 */
const adminService = require('../services/adminService');
const consultationService = require('../services/consultationService');
const { validationResult } = require('express-validator');

class AdminController {
  async listClients(req, res, next) {
    try {
      const clients = await adminService.listClients();
      res.json({ clients });
    } catch (err) {
      next(err);
    }
  }

  async listSpecialists(req, res, next) {
    try {
      const specialists = await adminService.listSpecialists();
      res.json({ specialists });
    } catch (err) {
      next(err);
    }
  }

  async listUsers(req, res, next) {
    try {
      const users = await adminService.listUsers();
      res.json({ users });
    } catch (err) {
      next(err);
    }
  }

  async toggleUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { isSuspended } = req.body;
      const result = await adminService.toggleUserStatus(parseInt(userId), isSuspended);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetUserPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params;
      const { newPassword } = req.body;
      const result = await adminService.resetUserPassword(parseInt(userId), newPassword);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async createUserAccount(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const result = await adminService.createUserAccount(req.body || {});
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getSpecialistVerificationDetails(req, res, next) {
    try {
      const result = await adminService.getSpecialistVerificationDetails(req.params.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async setSpecialistVerificationStatus(req, res, next) {
    try {
      const result = await adminService.setSpecialistVerificationStatus(req.params.userId, req.body || {});
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getReports(req, res, next) {
    try {
      const reports = await adminService.getReports();
      res.json({ reports });
    } catch (err) {
      next(err);
    }
  }

  async verifyConsultationPayment(req, res, next) {
    try {
      const result = await consultationService.verifyPayment(
        req.user.userId,
        req.params.consultationId
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async rejectConsultationPayment(req, res, next) {
    try {
      const result = await consultationService.rejectPayment(
        req.user.userId,
        req.params.consultationId,
        req.body || {}
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();
