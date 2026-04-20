/**
 * Profile Controller
 * Location: backend/controllers/profileController.js
 * Purpose: Handle HTTP requests for user profiles (basic details, photo, credentials)
 */
const profileService = require('../services/profileService');
const { validationResult } = require('express-validator');

class ProfileController {
  async listConsultationSpecialists(req, res, next) {
    try {
      const specialists = await profileService.listConsultationSpecialists();
      res.json({ specialists });
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.userId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const body = { ...req.body };
      if (body.consultationRate !== undefined) body.consultation_rate = body.consultationRate;
      if (body.expertise !== undefined && !Array.isArray(body.expertise)) body.expertise = [];
      if (body.skills !== undefined && !Array.isArray(body.skills)) body.skills = [];
      if (body.education !== undefined && !Array.isArray(body.education)) body.education = [];
      const profile = await profileService.updateProfile(req.user.userId, body);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async uploadProfilePhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const profile = await profileService.setProfilePhoto(req.user.userId, req.file.path);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async uploadCredentialDocs(req, res, next) {
    try {
      const files = req.files || [];
      if (files.length === 0) {
        return res.status(400).json({ error: 'No documents uploaded' });
      }
      const profile = await profileService.addCredentialDocuments(req.user.userId, files);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }

  async deleteCredentialDoc(req, res, next) {
    try {
      const docId = parseInt(req.params.id, 10);
      if (isNaN(docId)) {
        return res.status(400).json({ error: 'Invalid document id' });
      }
      await profileService.deleteCredentialDocument(req.user.userId, docId);
      res.json({ deleted: true });
    } catch (err) {
      next(err);
    }
  }

  async submitIdVerification(req, res, next) {
    try {
      const profile = await profileService.submitIdVerification(req.user.userId);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProfileController();
