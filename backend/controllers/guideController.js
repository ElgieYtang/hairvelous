/**
 * Guide Controller
 * Location: backend/controllers/guideController.js
 * Purpose: Handle HTTP requests for DIY guides
 */
const guideService = require('../services/guideService');
const billingService = require('../services/billingService');
const { validationResult } = require('express-validator');

class GuideController {
  async listGuides(req, res, next) {
    try {
      const filters = {
        category: req.query.category || null,
        difficulty: req.query.difficulty || null,
      };
      const isProUser = req.user ? await billingService.isUserPro(req.user.userId) : false;
      const guides = await guideService.listGuides(filters, { isProUser, isAdmin: req.user && req.user.roleName === 'admin' });
      res.json({ guides });
    } catch (err) {
      next(err);
    }
  }

  async getGuide(req, res, next) {
    try {
      const { guideId } = req.params;
      const isProUser = req.user ? await billingService.isUserPro(req.user.userId) : false;
      const guide = await guideService.getGuide(parseInt(guideId), { isProUser, isAdmin: req.user && req.user.roleName === 'admin' });
      res.json({
        guide,
      });
    } catch (err) {
      next(err);
    }
  }

  async createGuide(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const guide = await guideService.createGuide(req.body, req.user.userId);
      res.status(201).json({ guide });
    } catch (err) {
      next(err);
    }
  }

  async updateGuide(req, res, next) {
    try {
      const { guideId } = req.params;
      const guide = await guideService.updateGuide(parseInt(guideId), req.body);
      res.json({
        guide,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteGuide(req, res, next) {
    try {
      const { guideId } = req.params;
      const result = await guideService.deleteGuide(parseInt(guideId));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new GuideController();
