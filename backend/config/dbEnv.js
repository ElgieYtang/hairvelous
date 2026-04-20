/**
 * Shared MySQL connection settings from environment.
 * Loads backend/.env then project-root .env (same order as server.js).
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

function parsePort() {
  const n = parseInt(process.env.DB_PORT || '3306', 10);
  return Number.isFinite(n) && n > 0 ? n : 3306;
}

/**
 * @param {{ omitDatabase?: boolean }} [opts]
 * @returns {Record<string, unknown>}
 */
function getMysqlConnectionOptions(opts = {}) {
  const { omitDatabase = false } = opts;
  const base = {
    host: process.env.DB_HOST || 'localhost',
    port: parsePort(),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ?? '',
  };
  if (!omitDatabase) {
    base.database = process.env.DB_NAME || 'hairvelous';
  }
  return base;
}

module.exports = {
  getMysqlConnectionOptions,
  parsePort,
};
