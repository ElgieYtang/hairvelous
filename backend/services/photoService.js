/**
 * Photo Service
 * Location: backend/services/photoService.js
 * Purpose: Business logic for hair photo uploads
 */
const pool = require('../config/db');
const path = require('path');
const fs = require('fs').promises;
const hairAiService = require('./hairAiService');

class PhotoService {
  constructor() {
    this.tableReady = false;
  }

  async ensureTable() {
    if (this.tableReady) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hair_photos (
        photo_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        ai_result TEXT NULL,
        date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_date_uploaded (date_uploaded),
        CONSTRAINT fk_photo_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
    this.tableReady = true;
  }

  /**
   * Upload photo
   */
  async uploadPhoto(userId, filePath, fileName, aiResult = null) {
    await this.ensureTable();
    const relativePath = path
      .relative(path.join(__dirname, '..', '..'), filePath)
      .replace(/\\/g, '/');

    let finalAiResult = aiResult;
    if (!finalAiResult) {
      try {
        const absolutePath = path.isAbsolute(filePath)
          ? filePath
          : path.join(__dirname, '..', '..', filePath);
        finalAiResult = await hairAiService.analyzePhoto(userId, absolutePath);
      } catch (err) {
        console.warn('[photoService] Hair AI analysis failed:', err.message);
      }
    }

    const storedAi = finalAiResult || 'AI analysis unavailable. This is for awareness only, not a medical diagnosis.';

    // Skip DB when running without a database (testing / demo mode)
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      return {
        photoId: null,
        imagePath: relativePath,
        aiResult: storedAi,
      };
    }

    const [result] = await pool.query(
      'INSERT INTO hair_photos (user_id, image_path, ai_result) VALUES (?, ?, ?)',
      [userId, relativePath, storedAi]
    );

    return {
      photoId: result.insertId,
      imagePath: relativePath,
      aiResult: storedAi,
    };
  }

  /**
   * Get user's photos
   */
  async getUserPhotos(userId) {
    await this.ensureTable();
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      return [];
    }

    const [rows] = await pool.query(
      'SELECT photo_id, image_path, ai_result, date_uploaded FROM hair_photos WHERE user_id = ? ORDER BY date_uploaded DESC',
      [userId]
    );

    return rows.map(r => ({
      photoId: r.photo_id,
      imagePath: r.image_path,
      aiResult: r.ai_result,
      dateUploaded: r.date_uploaded,
    }));
  }

  /**
   * Replace photo (delete old, upload new)
   */
  async replacePhoto(photoId, userId, newFilePath, newFileName) {
    await this.ensureTable();
    // Verify ownership
    const [existing] = await pool.query(
      'SELECT image_path FROM hair_photos WHERE photo_id = ? AND user_id = ?',
      [photoId, userId]
    );

    if (existing.length === 0) {
      throw new Error('Photo not found');
    }

    // Delete old file
    const oldPath = path.join(__dirname, '..', '..', existing[0].image_path);
    try {
      await fs.unlink(oldPath);
    } catch (err) {
      console.warn('Could not delete old file:', err.message);
    }

    // Update database
    const relativePath = path.relative(path.join(__dirname, '..', '..'), newFilePath).replace(/\\/g, '/');
    await pool.query(
      'UPDATE hair_photos SET image_path = ? WHERE photo_id = ?',
      [relativePath, photoId]
    );

    return { photoId, imagePath: relativePath };
  }

  /**
   * Delete photo
   */
  async deletePhoto(photoId, userId) {
    await this.ensureTable();
    const [existing] = await pool.query(
      'SELECT image_path FROM hair_photos WHERE photo_id = ? AND user_id = ?',
      [photoId, userId]
    );

    if (existing.length === 0) {
      throw new Error('Photo not found');
    }

    // Delete file
    const filePath = path.join(__dirname, '..', '..', existing[0].image_path);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn('Could not delete file:', err.message);
    }

    // Delete from database
    await pool.query('DELETE FROM hair_photos WHERE photo_id = ?', [photoId]);

    return { message: 'Photo deleted' };
  }
}

module.exports = new PhotoService();
