/**
 * Auth Service
 * Location: backend/services/authService.js
 * Purpose: Business logic for authentication
 */
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('../config/db');
const { signToken } = require('../middleware/auth');
const emailService = require('./emailService');

class AuthService {
  async ensureUserProfileDemographicColumns() {
    await pool.query(`
      ALTER TABLE user_profiles
        ADD COLUMN IF NOT EXISTS sex VARCHAR(32) NULL,
        ADD COLUMN IF NOT EXISTS birthdate DATE NULL,
        ADD COLUMN IF NOT EXISTS race VARCHAR(120) NULL
    `);
  }

  /**
   * Check if Google OAuth columns exist
   */
  async hasGoogleOAuthColumns() {
    try {
      const [columns] = await pool.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME IN ('auth_provider', 'google_sub', 'is_email_verified')
      `);
      return columns.length === 3;
    } catch (err) {
      return false;
    }
  }

  /**
 * Register a new user
 */
async register(name, email, password, profile = {}) {
  // Temporary testing bypass: skip DB and return a fake user/token
  if (process.env.SKIP_DB_FOR_TESTING === 'true') {
    const fakeUserId = 1;
    const token = signToken(fakeUserId);
    return { userId: fakeUserId, token, note: 'SKIP_DB_FOR_TESTING enabled – no DB writes performed.' };
  }

  let existing;
  try {
    [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      throw new Error('Database unavailable. Start MySQL and ensure DB_HOST/DB_USER/DB_NAME are correct in .env');
    }
    throw err;
  }
  if (existing.length > 0) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const hasGoogleColumns = await this.hasGoogleOAuthColumns();

  let result;
  if (hasGoogleColumns) {
    // Use columns if they exist
    [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id, auth_provider, is_email_verified) VALUES (?, ?, ?, 1, ?, 1)',
      [name, email, passwordHash, 'local']
    );
  } else {
    // Fallback: insert without Google OAuth columns
    [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, 1)',
      [name, email, passwordHash]
    );
  }

  const userId = result.insertId;

  // Create/Update extended profile (sex, birthdate, race)
  await this.ensureUserProfileDemographicColumns();
  const sex = profile.sex || null;
  const birthdate = profile.birthdate || null;
  const race = profile.race || null;

  await pool.query(
    `INSERT INTO user_profiles (user_id, sex, birthdate, race)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       sex = VALUES(sex),
       birthdate = VALUES(birthdate),
       race = VALUES(race)`,
    [userId, sex, birthdate, race]
  );

  const token = signToken(userId);
  return { userId, token };
}

  /**
   * Login user
   */
  async login(email, password) {
    const hasGoogleColumns = await this.hasGoogleOAuthColumns();
    
    let query;
    if (hasGoogleColumns) {
      query = `SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, u.auth_provider, r.role_name 
               FROM users u 
               JOIN roles r ON u.role_id = r.role_id 
               WHERE u.email = ?`;
    } else {
      query = `SELECT u.user_id, u.name, u.email, u.password_hash, u.role_id, r.role_name 
               FROM users u 
               JOIN roles r ON u.role_id = r.role_id 
               WHERE u.email = ?`;
    }
    
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = rows[0];
    
    // Allow dual auth: Google-linked accounts can still use email/password
    // after they set a password via forgot-password/reset flow.
    if (!user.password_hash) {
      throw new Error('No password is set for this account yet. Use "Forgot password" to create one.');
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      if (hasGoogleColumns && user.auth_provider === 'google') {
        throw new Error('Incorrect password. If this is a Google account, use "Forgot password" to set an email password.');
      }
      throw new Error('Invalid email or password');
    }

    const token = signToken(user.user_id);
    return {
      token,
      user: {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name,
      },
    };
  }

  /**
   * Generate reset token and send reset email.
   */
  async forgotPassword(email) {
    const [rows] = await pool.query('SELECT user_id, name, email FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      // Don't reveal if email exists (security best practice)
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE user_id = ?',
      [token, expiresAt, user.user_id]
    );

    const appPublicUrl = String(process.env.APP_PUBLIC_URL || 'http://localhost:3000').trim().replace(/\/+$/, '');
    const resetLink = `${appPublicUrl}/reset-password.html?token=${encodeURIComponent(token)}`;
    let mailResult = { sent: false, reason: 'unknown' };
    try {
      mailResult = await emailService.sendPasswordResetEmail(user.email, user.name, resetLink);
    } catch (err) {
      console.error('[authService] Failed to send reset email:', err.message);
      mailResult = { sent: false, reason: 'send_failed' };
    }
    const payload = {
      message: 'If an account exists, a reset link has been sent.',
    };
    // Dev fallback so local testing still works without SMTP.
    if (!mailResult.sent && process.env.NODE_ENV !== 'production') {
      payload.devResetLink = resetLink;
      payload.devNotice = 'SMTP is not configured. Use devResetLink for local testing.';
    }
    return payload;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token, newPassword) {
    const [rows] = await pool.query(
      'SELECT user_id FROM users WHERE reset_token = ? AND reset_token_expires_at > NOW()',
      [token]
    );

    if (rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE user_id = ?',
      [passwordHash, rows[0].user_id]
    );

    return { message: 'Password reset successful' };
  }
}

module.exports = new AuthService();
