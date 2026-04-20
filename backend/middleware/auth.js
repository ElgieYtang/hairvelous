/**
 * Authentication Middleware
 * Location: backend/middleware/auth.js
 * Purpose: JWT verification, role-based access control
 */
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SKIP_DB_FOR_TESTING = process.env.SKIP_DB_FOR_TESTING === 'true';

function getTestUser() {
  return {
    userId: 1,
    name: 'Test User',
    email: 'test@example.com',
    roleId: 1,
    roleName: 'user',
  };
}

/**
 * Optional authentication: sets req.user if token valid, else null
 */
async function optionalAuth(req, res, next) {
  // Testing mode: skip DB and pretend user is logged in
  if (SKIP_DB_FOR_TESTING) {
    req.user = getTestUser();
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.email, u.role_id, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.user_id = ?`,
      [decoded.userId]
    );

    if (rows.length === 0) {
      req.user = null;
      return next();
    }

    req.user = {
      userId: rows[0].user_id,
      name: rows[0].name,
      email: rows[0].email,
      roleId: rows[0].role_id,
      roleName: rows[0].role_name,
    };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

/**
 * Require authentication: returns 401 if not logged in
 */
function requireAuth(req, res, next) {
  // Testing mode: bypass auth and inject fake user
  if (SKIP_DB_FOR_TESTING) {
    if (!req.user) {
      req.user = getTestUser();
    }
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }
  next();
}

/**
 * Require admin role: returns 403 if not admin
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }
  if (req.user.roleName !== 'admin') {
    return res.status(403).json({
      error: 'Admin access required',
    });
  }
  next();
}

/**
 * Generate JWT token
 */
function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = {
  optionalAuth,
  requireAuth,
  requireAdmin,
  signToken,
  JWT_SECRET,
};

function requireSellerOrAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.roleName !== 'admin' && req.user.roleName !== 'seller') {
    return res.status(403).json({ error: 'Seller or admin access required' });
  }
  next();
}

module.exports = {
  optionalAuth,
  requireAuth,
  requireAdmin,
  requireSellerOrAdmin,
  signToken,
  JWT_SECRET,
};