/**
 * Database Connection Pool
 * Location: backend/config/db.js
 * Purpose: MySQL connection pooling for efficient database access
 */
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('./dbEnv');

const pool = mysql.createPool({
  ...getMysqlConnectionOptions(),
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test connection on app runtime, but avoid creating extra handles in Jest.
const shouldTestConnection =
  process.env.SKIP_DB_FOR_TESTING !== 'true' &&
  process.env.NODE_ENV !== 'test';

if (shouldTestConnection) {
  pool.getConnection()
    .then(connection => {
      const cfg = getMysqlConnectionOptions();
      console.log(
        `✓ Database connected (${cfg.database} @ ${cfg.host}:${cfg.port})`
      );
      connection.release();
    })
    .catch(err => {
      console.error('✗ Database connection failed:', err.message);
    });
} else {
  console.log('⚠ Database connection check skipped (test mode or SKIP_DB_FOR_TESTING=true)');
}

module.exports = pool;
