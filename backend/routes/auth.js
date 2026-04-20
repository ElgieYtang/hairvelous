const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { requireAuth, signToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const [rows] = await pool.query(
        'SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role_id, u.is_suspended, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
        [req.body.email]
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const user = rows[0];
      if (user.is_suspended) {
        return res.status(403).json({ error: 'Account is suspended' });
      }
      const match = await bcrypt.compare(req.body.password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = signToken(user.id);
      res.json({
        token,
        user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, role: user.role_name },
      });
    } catch (e) {
      next(e);
    }
  }
);

// POST /api/auth/logout (client discards token; optional server-side blacklist stub)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

// POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [req.body.email]);
      const token = rows.length ? require('crypto').randomBytes(32).toString('hex') : 'stub-token';
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      if (rows.length) {
        await pool.query('UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?', [token, expires, rows[0].id]);
      }
      // In production: send email with reset link. For prototype we return token in response.
      res.json({
        message: 'If an account exists, a reset link has been sent.',
        resetToken: rows.length ? token : undefined,
      });
    } catch (e) {
      next(e);
    }
  }
);

// POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const [rows] = await pool.query('SELECT id FROM users WHERE reset_token = ? AND reset_token_expires_at > NOW()', [req.body.token]);
      if (rows.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      await pool.query('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?', [hash, rows[0].id]);
      res.json({ message: 'Password reset successful' });
    } catch (e) {
      next(e);
    }
  }
);

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.first_name,
      lastName: req.user.last_name,
      role: req.user.role_name,
    },
  });
});

module.exports = router;
