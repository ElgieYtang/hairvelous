/**
 * Routine Service
 * Location: backend/services/routineService.js
 * Purpose: Business logic for routine tracking
 */
const pool = require('../config/db');
const path = require('path');
const fs = require('fs').promises;

const projectRoot = path.join(__dirname, '..', '..');

class RoutineService {
  constructor() {
    this.mediaColumnsReady = false;
    this.tableReady = false;
  }

  async ensureTable() {
    if (this.tableReady) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS routine_logs (
        routine_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        activity_type VARCHAR(120) NOT NULL,
        date_logged DATE NOT NULL,
        notes TEXT NULL,
        media_path VARCHAR(500) NULL,
        media_type ENUM('image','video') NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    this.tableReady = true;
  }

  async ensureMediaColumns() {
    await this.ensureTable();
    if (this.mediaColumnsReady) return;
    const tryAlter = async (sql) => {
      try {
        await pool.query(sql);
      } catch (_e) {
        // Ignore when columns already exist / incompatible alter.
      }
    };
    await tryAlter('ALTER TABLE routine_logs ADD COLUMN media_path VARCHAR(500) NULL');
    await tryAlter("ALTER TABLE routine_logs ADD COLUMN media_type ENUM('image','video') NULL");
    this.mediaColumnsReady = true;
  }

  mediaTypeFromFile(file) {
    if (!file || !file.mimetype) return null;
    if (file.mimetype.startsWith('video/')) return 'video';
    if (file.mimetype.startsWith('image/')) return 'image';
    const ext = path.extname(file.originalname || '').slice(1).toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    return null;
  }

  resolveFilePathForDelete(mediaPath) {
    if (!mediaPath) return null;
    let p = String(mediaPath).replace(/\\/g, '/');
    if (/^[a-zA-Z]:/.test(p)) return path.normalize(p);
    if (p.startsWith('/')) p = p.slice(1);
    return path.join(projectRoot, p);
  }

  toPublicMediaUrl(mediaPath) {
    if (!mediaPath) return null;
    let s = String(mediaPath).trim().replace(/\\/g, '/');
    if (!s) return null;
    const lower = s.toLowerCase();
    const uploadsIdx = lower.indexOf('/uploads/');
    if (uploadsIdx >= 0) {
      s = s.slice(uploadsIdx + 1);
    } else if (lower.startsWith('uploads/')) {
      // keep as-is
    } else {
      const innerUploadsIdx = lower.indexOf('uploads/');
      if (innerUploadsIdx >= 0) s = s.slice(innerUploadsIdx);
      else s = `uploads/${s.replace(/^\/+/, '')}`;
    }
    s = s.replace(/^\/+/, '');
    return `/${s}`;
  }

  /**
   * Create routine log
   */
  async createLog(userId, activityType, dateLogged, notes = null) {
    await this.ensureMediaColumns();
    const [result] = await pool.query(
      'INSERT INTO routine_logs (user_id, activity_type, date_logged, notes) VALUES (?, ?, ?, ?)',
      [userId, activityType, dateLogged, notes]
    );

    return {
      routineId: result.insertId,
      activityType,
      dateLogged,
      notes,
    };
  }

  async createLogWithMedia(userId, activityType, dateLogged, notes = null, file = null) {
    await this.ensureMediaColumns();
    const mediaType = this.mediaTypeFromFile(file);
    const mediaPath = file ? `uploads/${path.basename(file.path)}`.replace(/\\/g, '/') : null;

    if (file && !mediaType) {
      throw new Error('Unsupported media type');
    }

    const [result] = await pool.query(
      `INSERT INTO routine_logs (user_id, activity_type, date_logged, notes, media_path, media_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, activityType, dateLogged, notes, mediaPath, mediaType]
    );

    return {
      routineId: result.insertId,
      activityType,
      dateLogged,
      notes,
      mediaPath,
      mediaUrl: this.toPublicMediaUrl(mediaPath),
      mediaType,
    };
  }

  /**
   * Get user's routine logs
   */
  async getUserLogs(userId, limit = 100, daysWindow = null) {
    await this.ensureMediaColumns();
    const hasWindow = Number.isFinite(Number(daysWindow)) && Number(daysWindow) > 0;
    const sql = hasWindow
      ? `SELECT routine_id, activity_type, notes, date_logged,
                DATE_FORMAT(date_logged, '%Y-%m-%d') AS date_logged_key,
                media_path, media_type
         FROM routine_logs
         WHERE user_id = ?
           AND date_logged >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
         ORDER BY date_logged DESC, routine_id DESC
         LIMIT ?`
      : `SELECT routine_id, activity_type, notes, date_logged,
                DATE_FORMAT(date_logged, '%Y-%m-%d') AS date_logged_key,
                media_path, media_type
         FROM routine_logs
         WHERE user_id = ?
         ORDER BY date_logged DESC, routine_id DESC
         LIMIT ?`;
    const args = hasWindow ? [userId, Number(daysWindow), limit] : [userId, limit];
    const [rows] = await pool.query(sql, args);

    return rows.map(r => ({
      routineId: r.routine_id,
      activityType: r.activity_type,
      notes: r.notes,
      dateLogged: r.date_logged_key || r.date_logged,
      mediaPath: r.media_path || null,
      mediaUrl: this.toPublicMediaUrl(r.media_path || null),
      mediaType: r.media_type || null,
    }));
  }

  /**
   * Get progress summary (weekly counts)
   */
  async getProgressSummary(userId, weeks = 4) {
    await this.ensureMediaColumns();
    const [rows] = await pool.query(
      `SELECT 
         DATE_FORMAT(date_logged, '%Y-%u') as week,
         COUNT(*) as count,
         GROUP_CONCAT(DISTINCT activity_type) as activities
       FROM routine_logs
       WHERE user_id = ? 
         AND date_logged >= DATE_SUB(CURDATE(), INTERVAL ? WEEK)
       GROUP BY week
       ORDER BY week DESC`,
      [userId, weeks]
    );

    return rows.map(r => ({
      week: r.week,
      count: r.count,
      activities: r.activities ? r.activities.split(',') : [],
    }));
  }

  async getAdvancedAnalytics(userId) {
    await this.ensureMediaColumns();
    const [rows] = await pool.query(
      `SELECT activity_type, COUNT(*) AS total
       FROM routine_logs
       WHERE user_id = ? AND date_logged >= DATE_SUB(CURDATE(), INTERVAL 60 DAY)
       GROUP BY activity_type
       ORDER BY total DESC`,
      [userId]
    );
    const [consistencyRows] = await pool.query(
      `SELECT COUNT(DISTINCT date_logged) AS active_days,
              COUNT(*) AS total_logs
       FROM routine_logs
       WHERE user_id = ? AND date_logged >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`,
      [userId]
    );
    return {
      topActivities: rows.map((r) => ({ activityType: r.activity_type, total: Number(r.total) })),
      monthlyConsistency: {
        activeDays: Number((consistencyRows[0] && consistencyRows[0].active_days) || 0),
        totalLogs: Number((consistencyRows[0] && consistencyRows[0].total_logs) || 0),
      },
    };
  }

  async getReminders(userId, isProUser = false) {
    await this.ensureMediaColumns();
    const [recentRows] = await pool.query(
      `SELECT MAX(date_logged) AS last_log
       FROM routine_logs
       WHERE user_id = ?`,
      [userId]
    );
    const reminders = [];
    const lastLog = recentRows[0] && recentRows[0].last_log ? new Date(recentRows[0].last_log) : null;
    if (!lastLog) {
      reminders.push('Start your first routine log today to build your progress baseline.');
    } else {
      const daysSince = Math.floor((Date.now() - new Date(lastLog).getTime()) / 86400000);
      if (daysSince >= 2) reminders.push(`You have not logged for ${daysSince} days. Add today\'s routine to stay consistent.`);
    }
    reminders.push('Hydration check: include water intake and scalp comfort in your daily notes.');
    if (isProUser) {
      reminders.push('Pro insight: compare your week-over-week pattern every Sunday.');
      reminders.push('Pro reminder: attach photo evidence twice a week for better specialist validation.');
    }
    return reminders;
  }

  /**
   * Update routine log
   */
  async updateLog(routineId, userId, updates) {
    await this.ensureMediaColumns();
    // Verify ownership
    const [existing] = await pool.query(
      'SELECT routine_id FROM routine_logs WHERE routine_id = ? AND user_id = ?',
      [routineId, userId]
    );

    if (existing.length === 0) {
      throw new Error('Routine log not found');
    }

    const fields = [];
    const values = [];

    if (updates.activityType !== undefined) {
      fields.push('activity_type = ?');
      values.push(updates.activityType);
    }
    if (updates.dateLogged !== undefined) {
      fields.push('date_logged = ?');
      values.push(updates.dateLogged);
    }
    if (updates.notes !== undefined) {
      fields.push('notes = ?');
      values.push(updates.notes);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(routineId);
    await pool.query(`UPDATE routine_logs SET ${fields.join(', ')} WHERE routine_id = ?`, values);

    const [updated] = await pool.query(
      'SELECT * FROM routine_logs WHERE routine_id = ?',
      [routineId]
    );

    return {
      routineId: updated[0].routine_id,
      activityType: updated[0].activity_type,
      dateLogged: updated[0].date_logged,
      notes: updated[0].notes,
    };
  }

  /**
   * Delete routine log
   */
  async deleteLog(routineId, userId) {
    await this.ensureMediaColumns();
    const [rows] = await pool.query(
      'SELECT media_path FROM routine_logs WHERE routine_id = ? AND user_id = ?',
      [routineId, userId]
    );
    if (rows.length && rows[0].media_path) {
      try {
        const full = this.resolveFilePathForDelete(rows[0].media_path);
        if (full) await fs.unlink(full);
      } catch (_e) {
        // Ignore missing file cleanup issues
      }
    }
    const [result] = await pool.query(
      'DELETE FROM routine_logs WHERE routine_id = ? AND user_id = ?',
      [routineId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error('Routine log not found');
    }

    return { message: 'Routine log deleted' };
  }
}

module.exports = new RoutineService();