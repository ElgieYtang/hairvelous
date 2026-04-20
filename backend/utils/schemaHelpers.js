/**
 * Cached checks for optional DB columns (migrations may add these over time).
 */
const pool = require('../config/db');

let cachedHasIsSuspended = null;

async function hasIsSuspendedColumn() {
  if (cachedHasIsSuspended !== null) return cachedHasIsSuspended;
  try {
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_suspended'`
    );
    cachedHasIsSuspended = cols.length > 0;
    return cachedHasIsSuspended;
  } catch (_e) {
    cachedHasIsSuspended = false;
    return false;
  }
}

/**
 * Throws if user is suspended (no-op when column missing).
 */
async function assertUserNotSuspended(userId) {
  if (!(await hasIsSuspendedColumn())) return;
  const [rows] = await pool.query('SELECT is_suspended FROM users WHERE user_id = ?', [userId]);
  if (rows.length === 0) return;
  if (rows[0].is_suspended === 1 || rows[0].is_suspended === true) {
    const err = new Error('Account suspended');
    err.statusCode = 403;
    throw err;
  }
}

module.exports = {
  hasIsSuspendedColumn,
  assertUserNotSuspended,
};