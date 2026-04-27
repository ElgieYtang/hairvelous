const pool = require('../config/db');

class NotificationService {
  constructor() {
    this.ready = false;
  }

  async ensureTable() {
    if (this.ready) return;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          notification_id INT PRIMARY KEY AUTO_INCREMENT,
          recipient_user_id INT NOT NULL,
          type VARCHAR(60) NOT NULL,
          title VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          link_url VARCHAR(255) NULL,
          is_read TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
      `);
    } catch (_err) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          notification_id INT PRIMARY KEY AUTO_INCREMENT,
          recipient_user_id INT NOT NULL,
          type VARCHAR(60) NOT NULL,
          title VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          link_url VARCHAR(255) NULL,
          is_read TINYINT(1) NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    this.ready = true;
  }

  async createForUser(recipientUserId, payload) {
    await this.ensureTable();
    const {
      type = 'general',
      title = 'Notification',
      message = '',
      linkUrl = null,
    } = payload || {};
    if (!recipientUserId || !message) {
      return null;
    }
    const [result] = await pool.query(
      `INSERT INTO notifications (recipient_user_id, type, title, message, link_url)
       VALUES (?, ?, ?, ?, ?)`,
      [recipientUserId, type, title, message, linkUrl]
    );
    return { notificationId: result.insertId };
  }

  async createForRoles(roleNames, payload, excludeUserId = null) {
    await this.ensureTable();
    if (!Array.isArray(roleNames) || !roleNames.length) return;
    const placeholders = roleNames.map(() => '?').join(',');
    const args = [...roleNames];
    let sql = `
      SELECT u.user_id
      FROM users u
      JOIN roles r ON r.role_id = u.role_id
      WHERE r.role_name IN (${placeholders})
    `;
    if (excludeUserId) {
      sql += ' AND u.user_id <> ?';
      args.push(excludeUserId);
    }
    const [rows] = await pool.query(sql, args);
    for (const row of rows) {
      await this.createForUser(row.user_id, payload);
    }
  }

  async listForUser(userId, limit = 20) {
    await this.ensureTable();
    const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 50));
    const [rows] = await pool.query(
      `SELECT notification_id, type, title, message, link_url, is_read, created_at
       FROM notifications
       WHERE recipient_user_id = ?
       ORDER BY created_at DESC, notification_id DESC
       LIMIT ?`,
      [userId, safeLimit]
    );
    const [countRows] = await pool.query(
      'SELECT COUNT(*) AS unread_count FROM notifications WHERE recipient_user_id = ? AND is_read = 0',
      [userId]
    );
    return {
      unreadCount: Number((countRows[0] && countRows[0].unread_count) || 0),
      notifications: rows.map((r) => ({
        notificationId: r.notification_id,
        type: r.type,
        title: r.title,
        message: r.message,
        linkUrl: r.link_url,
        isRead: !!r.is_read,
        createdAt: r.created_at,
      })),
    };
  }

  async markRead(userId, notificationId = null) {
    await this.ensureTable();
    if (notificationId) {
      await pool.query(
        'UPDATE notifications SET is_read = 1 WHERE recipient_user_id = ? AND notification_id = ?',
        [userId, Number(notificationId)]
      );
      return { updated: true, scope: 'single' };
    }
    await pool.query(
      'UPDATE notifications SET is_read = 1 WHERE recipient_user_id = ? AND is_read = 0',
      [userId]
    );
    return { updated: true, scope: 'all' };
  }
}

module.exports = new NotificationService();
