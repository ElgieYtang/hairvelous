const notificationService = require('../services/notificationService');

class NotificationController {
  async list(req, res, next) {
    try {
      const limit = req.query.limit || 20;
      const result = await notificationService.listForUser(req.user.userId, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async markRead(req, res, next) {
    try {
      const result = await notificationService.markRead(req.user.userId, req.params.notificationId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async markAllRead(req, res, next) {
    try {
      const result = await notificationService.markRead(req.user.userId, null);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new NotificationController();
