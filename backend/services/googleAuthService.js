/**
 * Google OAuth Service
 * Location: backend/services/googleAuthService.js
 * Purpose: Handle Google OAuth 2.0 authentication
 */
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const pool = require('../config/db');
const { signToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

class GoogleAuthService {
  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL?.trim();
    
    if (!clientId || !clientSecret || !callbackUrl || 
        clientId === '' || clientSecret === '' || callbackUrl === '') {
      // Silently handle missing config - Google button will be disabled on frontend
      this.client = null;
      this.isConfigured = false;
      return;
    }
    
    this.client = new OAuth2Client(clientId, clientSecret, callbackUrl);
    this.isConfigured = true;
  }

  /**
   * Get Google OAuth authorization URL
   */
  getAuthUrl(state) {
    if (!this.client || !this.isConfigured) {
      throw new Error('Google OAuth is not configured');
    }
    
    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
      state: state, // CSRF protection
      prompt: 'select_account', // Force account selection
    });
  }

  /**
   * Exchange authorization code for tokens and verify ID token
   */
  async verifyIdToken(code) {
    if (!this.client || !this.isConfigured) {
      throw new Error('Google OAuth is not configured');
    }
    
    try {
      // Exchange code for tokens
      const { tokens } = await this.client.getToken(code);
      const idToken = tokens.id_token;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Verify ID token
      const ticket = await this.client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID?.trim(),
      });

      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new Error(`Google token verification failed: ${error.message}`);
    }
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
   * Handle Google OAuth callback - create or link user account
   */
  async handleGoogleCallback(googlePayload) {
    const { sub, email, name, email_verified } = googlePayload;

    // Verify email is verified
    if (!email_verified) {
      throw new Error('Google email is not verified.');
    }

    // Check if columns exist
    const hasGoogleColumns = await this.hasGoogleOAuthColumns();
    
    if (!hasGoogleColumns) {
      throw new Error('Google OAuth columns not found. Please run the migration: database/migration_add_google_oauth_final.sql');
    }

    // Check if user exists by google_sub
    const [existingBySub] = await pool.query(
      'SELECT user_id, name, email, role_id, auth_provider FROM users WHERE google_sub = ?',
      [sub]
    );

    if (existingBySub.length > 0) {
      // User exists with this Google account - log them in
      const user = existingBySub[0];
      const [roleRows] = await pool.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);
      
      const token = signToken(user.user_id);
      return {
        token,
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          roleId: user.role_id,
          roleName: roleRows[0]?.role_name || 'user',
        },
      };
    }

    // Check if user exists by email (local account)
    const [existingByEmail] = await pool.query(
      'SELECT user_id, name, email, role_id, auth_provider FROM users WHERE email = ?',
      [email]
    );

    if (existingByEmail.length > 0) {
      // User exists with local account - link Google account
      const user = existingByEmail[0];
      
      // Update user to link Google account
      await pool.query(
        'UPDATE users SET auth_provider = ?, google_sub = ?, is_email_verified = ? WHERE user_id = ?',
        ['google', sub, email_verified ? 1 : 0, user.user_id]
      );

      const [roleRows] = await pool.query('SELECT role_name FROM roles WHERE role_id = ?', [user.role_id]);
      
      const token = signToken(user.user_id);
      return {
        token,
        user: {
          userId: user.user_id,
          name: user.name,
          email: user.email,
          roleId: user.role_id,
          roleName: roleRows[0]?.role_name || 'user',
        },
      };
    }

    // New user - create account
    // Generate a placeholder password hash (required by schema, but won't be used)
    const placeholderHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
    
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password_hash, role_id, auth_provider, google_sub, is_email_verified) 
       VALUES (?, ?, ?, 1, 'google', ?, ?)`,
      [name, email, placeholderHash, sub, email_verified ? 1 : 0]
    );

    const token = signToken(result.insertId);
    return {
      token,
      user: {
        userId: result.insertId,
        name: name,
        email: email,
        roleId: 1,
        roleName: 'user',
      },
    };
  }
}

module.exports = new GoogleAuthService();
