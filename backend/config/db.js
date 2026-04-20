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

// Test connection (skip when running without a database)
if (process.env.SKIP_DB_FOR_TESTING !== 'true') {
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
  console.log('⚠ Database connection skipped (SKIP_DB_FOR_TESTING=true)');
}

module.exports = pool;
