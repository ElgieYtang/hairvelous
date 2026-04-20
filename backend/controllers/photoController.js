/**
 * Photo Controller
 * Location: backend/controllers/photoController.js
 * Purpose: Handle HTTP requests for photo uploads
 */
const photoService = require('../services/photoService');

class PhotoController {
  async uploadPhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      const result = await photoService.uploadPhoto(
        req.user.userId,
        req.file.path,
        req.file.originalname,
        req.body.aiResult || null
      );

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUserPhotos(req, res, next) {
    try {
      const photos = await photoService.getUserPhotos(req.user.userId);
      res.json({ photos });
    } catch (err) {
      next(err);
    }
  }

  async replacePhoto(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      const { photoId } = req.params;
      const result = await photoService.replacePhoto(
        parseInt(photoId),
        req.user.userId,
        req.file.path,
        req.file.originalname
      );

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async deletePhoto(req, res, next) {
    try {
      const { photoId } = req.params;
      const result = await photoService.deletePhoto(parseInt(photoId), req.user.userId);
      res.json({
        ...result,
        disclaimer: 'This system is for preventive awareness only. It does not diagnose or treat.',
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PhotoController();
