const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List users (admin) or own profile (user)
router.get('/', requireAuth, async (req, res, next) => {
  try {
    if (req.user.role_name === 'admin') {
      const [rows] = await pool.query(
        'SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, u.is_suspended, u.created_at, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.id'
      );
      return res.json({ users: rows });
    }
    const [rows] = await pool.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ user: rows[0] || null });
  } catch (e) {
    next(e);
  }
});

// Get single user (admin) or self
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (req.user.role_name !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const [rows] = await pool.query(
      'SELECT u.id, u.email, u.first_name, u.last_name, u.role_id, u.is_suspended, u.created_at, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Create user (admin only)
router.post(
  '/',
  requireAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('roleId').optional().isInt(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const roleId = req.body.roleId || 1;
      const hash = await bcrypt.hash(req.body.password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, role_id) VALUES (?, ?, ?, ?, ?)',
        [req.body.email, hash, req.body.firstName || null, req.body.lastName || null, roleId]
      );
      const [rows] = await pool.query('SELECT id, email, first_name, last_name, role_id, created_at FROM users WHERE id = ?', [result.insertId]);
      res.status(201).json({ user: rows[0] });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already registered' });
      next(e);
    }
  }
);

// Update user (admin: any; user: self, limited fields)
router.patch(
  '/:id',
  requireAuth,
  [
    body('firstName').optional().trim(),
    body('lastName').optional().trim(),
    body('email').optional().isEmail().normalizeEmail(),
    body('roleId').optional().isInt(),
    body('isSuspended').optional().isBoolean(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const id = parseInt(req.params.id, 10);
      if (req.user.role_name !== 'admin' && req.user.id !== id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updates = [];
      const values = [];
      if (req.body.firstName !== undefined) { updates.push('first_name = ?'); values.push(req.body.firstName); }
      if (req.body.lastName !== undefined) { updates.push('last_name = ?'); values.push(req.body.lastName); }
      if (req.body.email !== undefined) { updates.push('email = ?'); values.push(req.body.email); }
      if (req.user.role_name === 'admin') {
        if (req.body.roleId !== undefined) { updates.push('role_id = ?'); values.push(req.body.roleId); }
        if (req.body.isSuspended !== undefined) { updates.push('is_suspended = ?'); values.push(req.body.isSuspended ? 1 : 0); }
      }
      if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
      values.push(id);
      await pool.query('UPDATE users SET ' + updates.join(', ') + ' WHERE id = ?', values);
      const [rows] = await pool.query('SELECT id, email, first_name, last_name, role_id, is_suspended, updated_at FROM users WHERE id = ?', [id]);
      res.json({ user: rows[0] });
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already in use' });
      next(e);
    }
  }
);

// Admin: reset user password
router.post(
  '/:id/reset-password',
  requireAdmin,
  [body('newPassword').isLength({ min: 6 })],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const id = parseInt(req.params.id, 10);
      const hash = await bcrypt.hash(req.body.newPassword, 10);
      const [result] = await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?', [hash, id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ message: 'Password reset successful' });
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
