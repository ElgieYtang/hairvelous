/**
 * Recommendation Controller
 * Location: backend/controllers/recommendationController.js
 * Purpose: Handle HTTP requests for recommendations
 */
const recommendationService = require('../services/recommendationService');
const { requireAuth, optionalAuth } = require('../middleware/auth');

class RecommendationController {
  /**
   * Generate recommendations from user profile (requires auth)
   */
  async generateFromProfile(req, res, next) {
    try {
      const preferences = {
        budget: req.body.budget || req.query.budget || 'medium',
        productType: req.body.productType || req.query.productType || 'all',
      };

      // Get user's profile
      const pool = require('../config/db');
      const [profileRows] = await pool.query(
        'SELECT hair_type, scalp_condition, issues_detected FROM hair_profiles WHERE user_id = ?',
        [req.user.userId]
      );

      if (profileRows.length === 0) {
        return res.status(404).json({
          error: 'Profile not found',
          message: 'Complete an assessment first',
        });
      }

      const profile = profileRows[0];
      const issues = profile.issues_detected ? profile.issues_detected.split(', ') : [];

      const result = await recommendationService.generateRecommendations(
        {
          hairType: profile.hair_type,
          scalpCondition: profile.scalp_condition,
          issues,
        },
        preferences
      );
      await recommendationService.replaceUserRecommendations(
        req.user.userId,
        result.recommendations || []
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generate recommendations from direct input (for testing/demo)
   */
  async generateFromInput(req, res, next) {
    try {
      const { hairType, scalpCondition, issues, preferences } = req.body;

      if (!hairType || !scalpCondition || !issues || !Array.isArray(issues)) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['hairType', 'scalpCondition', 'issues'],
        });
      }

      const prefs = preferences || {
        budget: 'medium',
        productType: 'all',
      };

      const result = await recommendationService.generateRecommendations(
        { hairType, scalpCondition, issues },
        prefs
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get user's saved recommendations
   */
  async getUserRecommendations(req, res, next) {
    try {
      const recommendations = await recommendationService.getUserRecommendations(req.user.userId);
      res.json({ recommendations });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RecommendationController();
