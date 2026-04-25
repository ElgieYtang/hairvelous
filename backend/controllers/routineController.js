/**
 * Routine Controller
 * Location: backend/controllers/routineController.js
 * Purpose: Handle HTTP requests for routine tracking
 */
const routineService = require('../services/routineService');
const billingService = require('../services/billingService');
const consultationService = require('../services/consultationService');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;

class RoutineController {
  async createLogWithMedia(req, res, next) {
    try {
      const activityType = (req.body.activityType || '').trim();
      const dateLogged = (req.body.dateLogged || '').trim();
      const notesRaw = (req.body.notes || '').trim();
      const notes = notesRaw || null;

      if (!activityType) {
        return res.status(400).json({ error: 'Activity type is required' });
      }
      if (!dateLogged) {
        return res.status(400).json({ error: 'Date is required' });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateLogged)) {
        return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format' });
      }

      const ent = await billingService.getEntitlements(req.user.userId);
      const canUploadVideo = !!(ent && ent.canUploadRoutineVideo);
      const mediaType = routineService.mediaTypeFromFile(req.file || null);
      if (req.file && mediaType === 'video' && !canUploadVideo) {
        try {
          await fs.unlink(req.file.path);
        } catch (_cleanupErr) {
          // Ignore cleanup errors.
        }
        return res.status(403).json({ error: 'Video uploads are available for Pro users only' });
      }

      const result = await routineService.createLogWithMedia(
        req.user.userId,
        activityType,
        dateLogged,
        notes,
        req.file || null
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async createLog(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { activityType, dateLogged, notes } = req.body;
      const result = await routineService.createLog(req.user.userId, activityType, dateLogged, notes);

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUserLogs(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const ent = await billingService.getEntitlements(req.user.userId);
      const daysWindow = ent && Number.isFinite(Number(ent.routineHistoryDays))
        ? Number(ent.routineHistoryDays)
        : null;
      const logs = await routineService.getUserLogs(req.user.userId, limit, daysWindow);
      res.json({ logs, appliedHistoryDays: daysWindow });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Specialist: read a client's routine logs when there is an accepted consultation link
   * and the client opted in (shareRoutineWithSpecialist).
   */
  async getClientLogsForSpecialist(req, res, next) {
    try {
      const clientUserId = Number(req.params.clientUserId);
      if (!Number.isFinite(clientUserId) || clientUserId <= 0) {
        return res.status(400).json({ error: 'Invalid client id' });
      }
      const access = await consultationService.canSpecialistViewClientRoutine(req.user, clientUserId);
      if (!access.ok) {
        const messages = {
          not_specialist: 'Only specialists can view client routines here.',
          no_accepted_consultation:
            'You can only view routines for clients who accepted your consultation request (same specialist–client link).',
          consent_required:
            'This client has not enabled sharing their routine with their specialist. They can turn it on in Profile settings.',
          invalid_client: 'Invalid client.',
          self: 'Invalid request.',
        };
        return res.status(403).json({ error: messages[access.reason] || 'Not allowed', code: access.reason });
      }
      const limit = Math.min(200, Math.max(1, parseInt(req.query.limit, 10) || 100));
      const ent = await billingService.getEntitlements(clientUserId);
      const daysWindow =
        ent && Number.isFinite(Number(ent.routineHistoryDays)) ? Number(ent.routineHistoryDays) : null;
      const logs = await routineService.getUserLogs(clientUserId, limit, daysWindow);
      res.json({ logs, appliedHistoryDays: daysWindow, clientUserId });
    } catch (err) {
      next(err);
    }
  }

  async getProgressSummary(req, res, next) {
    try {
      const weeks = parseInt(req.query.weeks) || 4;
      const summary = await routineService.getProgressSummary(req.user.userId, weeks);
      res.json({ summary });
    } catch (err) {
      next(err);
    }
  }

  async getAdvancedAnalytics(req, res, next) {
    try {
      const isProUser = await billingService.isUserPro(req.user.userId);
      if (!isProUser) {
        return res.status(403).json({ error: 'Advanced analytics are available for Pro users only' });
      }
      const analytics = await routineService.getAdvancedAnalytics(req.user.userId);
      res.json({ analytics });
    } catch (err) {
      next(err);
    }
  }

  async getReminders(req, res, next) {
    try {
      const isProUser = await billingService.isUserPro(req.user.userId);
      if (!isProUser) {
        return res.status(403).json({ error: 'Enhanced reminders are available for Pro users only' });
      }
      const reminders = await routineService.getReminders(req.user.userId, true);
      res.json({ reminders, level: 'pro' });
    } catch (err) {
      next(err);
    }
  }

  async updateLog(req, res, next) {
    try {
      const { routineId } = req.params;
      const result = await routineService.updateLog(parseInt(routineId), req.user.userId, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteLog(req, res, next) {
    try {
      const { routineId } = req.params;
      const result = await routineService.deleteLog(parseInt(routineId), req.user.userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RoutineController();