/**
 * Admin Service
 * Location: backend/services/adminService.js
 * Purpose: Business logic for admin operations
 */
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

function toUrl(filePath) {
  if (!filePath) return null;
  const normalized = String(filePath).replace(/\\/g, '/');
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  return '/' + normalized.replace(/^\/+/, '');
}

class AdminService {
  constructor() {
    this.userSuspensionColumnReady = false;
    this.userVerificationColumnsReady = false;
  }

  async ensureUserSuspensionColumn() {
    if (this.userSuspensionColumnReady) return;
    try {
      await pool.query('ALTER TABLE users ADD COLUMN is_suspended TINYINT(1) NOT NULL DEFAULT 0');
    } catch (_err) {
      // Column likely already exists.
    }
    this.userSuspensionColumnReady = true;
  }

  async ensureUserVerificationColumns() {
    if (this.userVerificationColumnsReady) return;
    const tryAlter = async (sql) => {
      try {
        await pool.query(sql);
      } catch (_err) {
        // Column likely already exists.
      }
    };
    await tryAlter("ALTER TABLE user_profiles ADD COLUMN id_verification_status VARCHAR(24) NULL DEFAULT 'not_submitted'");
    await tryAlter('ALTER TABLE user_profiles ADD COLUMN id_verification_note VARCHAR(255) NULL');
    this.userVerificationColumnsReady = true;
  }

  /**
   * List clients only (registered users with role "user", excluding admins)
   */
  async listClients() {
    await this.ensureUserSuspensionColumn();
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.date_created, u.is_suspended, up.profile_photo_path
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN user_profiles up ON up.user_id = u.user_id
       WHERE r.role_name = 'user'
       ORDER BY u.date_created DESC`
    );
    return rows.map(r => ({
      userId: r.user_id,
      name: r.name,
      email: r.email,
      dateCreated: r.date_created,
      isSuspended: !!r.is_suspended,
      profilePhotoUrl: toUrl(r.profile_photo_path),
    }));
  }

  /**
   * List all users
   */
  async listUsers() {
    await this.ensureUserSuspensionColumn();
    await this.ensureUserVerificationColumns();
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.date_created, u.is_suspended, r.role_name,
              up.id_verification_status,
              (SELECT COUNT(*) FROM user_credential_documents d WHERE d.user_id = u.user_id) AS id_doc_count,
              (SELECT COUNT(*) FROM hair_assessment WHERE user_id = u.user_id) as assessment_count
       FROM users u
       JOIN roles r ON u.role_id = r.role_id
       LEFT JOIN user_profiles up ON up.user_id = u.user_id
       ORDER BY
         CASE
           WHEN r.role_name = 'admin' THEN 1
           WHEN r.role_name = 'specialist' THEN 2
           WHEN r.role_name = 'user' THEN 3
           ELSE 4
         END ASC,
         u.date_created DESC`
    );

    return rows.map(r => ({
      idVerificationStatus:
        r.role_name !== 'specialist'
          ? null
          : (r.id_verification_status || 'not_submitted'),
      userId: r.user_id,
      name: r.name,
      email: r.email,
      roleName: r.role_name,
      dateCreated: r.date_created,
      assessmentCount: r.assessment_count,
      isSuspended: !!r.is_suspended,
    }));
  }

  /**
   * Suspend/reactivate user
   */
  async toggleUserStatus(userId, isSuspended) {
    await this.ensureUserSuspensionColumn();
    const [rows] = await pool.query(
      `SELECT u.user_id, r.role_name
       FROM users u
       JOIN roles r ON r.role_id = u.role_id
       WHERE u.user_id = ?`,
      [userId]
    );
    if (!rows.length) throw new Error('User not found');
    if (rows[0].role_name === 'admin') {
      throw new Error('Admin accounts cannot be suspended');
    }

    await pool.query('UPDATE users SET is_suspended = ? WHERE user_id = ?', [isSuspended ? 1 : 0, userId]);
    return { userId, isSuspended: !!isSuspended, message: `User ${isSuspended ? 'suspended' : 'reactivated'}` };
  }

  /**
   * Reset user password (admin)
   */
  async resetUserPassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [passwordHash, userId]
    );

    return { message: 'Password reset successful' };
  }

  /**
   * Create a new account from admin panel.
   */
  async createUserAccount(payload) {
    const name = String(payload.name || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();
    const password = String(payload.password || '');
    const roleName = String(payload.roleName || 'specialist').trim().toLowerCase();
    const allowedRoles = new Set(['specialist']);

    if (!name) throw new Error('Name is required');
    if (!email) throw new Error('Email is required');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');
    if (!allowedRoles.has(roleName)) throw new Error('Invalid role');

    const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) throw new Error('Email already in use');

    const [roles] = await pool.query('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
    if (!roles.length) throw new Error(`Role "${roleName}" not found`);

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, roles[0].role_id]
    );

    return {
      userId: result.insertId,
      name,
      email,
      roleName,
      message: 'User account created',
    };
  }

  async getSpecialistVerificationDetails(userId) {
    await this.ensureUserVerificationColumns();
    const id = Number(userId);
    if (!Number.isFinite(id)) throw new Error('Invalid user ID');

    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, r.role_name, up.id_verification_status, up.id_verification_note
       FROM users u
       JOIN roles r ON r.role_id = u.role_id
       LEFT JOIN user_profiles up ON up.user_id = u.user_id
       WHERE u.user_id = ?
       LIMIT 1`,
      [id]
    );
    if (!rows.length) throw new Error('User not found');
    if (rows[0].role_name !== 'specialist') throw new Error('ID verification is available for specialists only');

    const [docs] = await pool.query(
      `SELECT id, file_path, original_name, uploaded_at
       FROM user_credential_documents
       WHERE user_id = ?
       ORDER BY uploaded_at DESC`,
      [id]
    );

    return {
      userId: rows[0].user_id,
      name: rows[0].name,
      email: rows[0].email,
      roleName: rows[0].role_name,
      status: rows[0].id_verification_status || 'not_submitted',
      note: rows[0].id_verification_note || null,
      documents: docs.map((d) => ({
        id: d.id,
        filePath: d.file_path ? '/' + String(d.file_path).replace(/\\/g, '/') : null,
        originalName: d.original_name,
        uploadedAt: d.uploaded_at,
      })),
    };
  }

  async setSpecialistVerificationStatus(userId, payload) {
    await this.ensureUserVerificationColumns();
    const id = Number(userId);
    if (!Number.isFinite(id)) throw new Error('Invalid user ID');
    const status = String(payload.status || '').trim().toLowerCase();
    const note = payload.note != null ? String(payload.note).trim().slice(0, 255) : null;
    if (!['verified', 'rejected', 'pending_review'].includes(status)) {
      throw new Error('Invalid verification status');
    }

    const details = await this.getSpecialistVerificationDetails(id);
    if ((status === 'verified' || status === 'rejected') && details.documents.length === 0) {
      throw new Error('No submitted ID documents to review');
    }

    await pool.query(
      `INSERT INTO user_profiles (user_id, id_verification_status, id_verification_note)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE id_verification_status = VALUES(id_verification_status),
                               id_verification_note = VALUES(id_verification_note)`,
      [id, status, note || null]
    );

    return this.getSpecialistVerificationDetails(id);
  }

  /**
   * Get basic reports (stub)
   */
  async getReports() {
    async function safeTotal(query, missingLabel, unavailable) {
      try {
        const [rows] = await pool.query(query);
        return Number((rows && rows[0] && rows[0].total) || 0);
      } catch (_err) {
        unavailable.push(missingLabel);
        return 0;
      }
    }

    const unavailable = [];
    const totalUsers = await safeTotal('SELECT COUNT(*) as total FROM users', 'users', unavailable);
    const totalAssessments = await safeTotal('SELECT COUNT(*) as total FROM hair_assessment', 'assessments', unavailable);
    const totalProducts = await safeTotal('SELECT COUNT(*) as total FROM products', 'products', unavailable);
    const totalRecommendations = await safeTotal('SELECT COUNT(*) as total FROM recommendations', 'recommendations', unavailable);

    const note = unavailable.length
      ? `Some stats are unavailable right now (${unavailable.join(', ')}).`
      : 'Full reports with charts and exports can be added here.';

    return {
      totalUsers,
      totalAssessments,
      totalProducts,
      totalRecommendations,
      note,
    };
  }
}

module.exports = new AdminService();
