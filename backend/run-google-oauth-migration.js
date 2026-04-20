/**
 * Run Google OAuth migration - adds auth_provider, google_sub, is_email_verified to users table
 * Usage: node run-google-oauth-migration.js (from backend folder) or npm run migrate:google (from project root)
 */
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('./config/dbEnv');

async function run() {
  const dbOpts = getMysqlConnectionOptions();
  const pool = mysql.createPool(dbOpts);

  const conn = await pool.getConnection();
  try {
    const db = dbOpts.database;

    const [cols1] = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'auth_provider'`,
      [db]
    );
    if (cols1.length === 0) {
      await conn.query(`ALTER TABLE users ADD COLUMN auth_provider ENUM('local', 'google') DEFAULT 'local' NOT NULL AFTER password_hash`);
      console.log('Added auth_provider column');
    } else console.log('auth_provider already exists');

    const [cols2] = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'google_sub'`,
      [db]
    );
    if (cols2.length === 0) {
      await conn.query(`ALTER TABLE users ADD COLUMN google_sub VARCHAR(64) NULL UNIQUE AFTER auth_provider`);
      console.log('Added google_sub column');
    } else console.log('google_sub already exists');

    const [cols3] = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'is_email_verified'`,
      [db]
    );
    if (cols3.length === 0) {
      await conn.query(`ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT 0 NOT NULL AFTER google_sub`);
      console.log('Added is_email_verified column');
    } else console.log('is_email_verified already exists');

    const [idx1] = await conn.query(
      `SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_google_sub'`,
      [db]
    );
    if (idx1.length === 0) {
      await conn.query(`CREATE INDEX idx_google_sub ON users(google_sub)`);
      console.log('Added idx_google_sub index');
    }

    const [idx2] = await conn.query(
      `SELECT 1 FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND INDEX_NAME = 'idx_auth_provider'`,
      [db]
    );
    if (idx2.length === 0) {
      await conn.query(`CREATE INDEX idx_auth_provider ON users(auth_provider)`);
      console.log('Added idx_auth_provider index');
    }

    await conn.query(`UPDATE users SET is_email_verified = 1 WHERE auth_provider = 'local'`);

    const [rows] = await conn.query(
      `SELECT COUNT(*) AS total, SUM(CASE WHEN auth_provider = 'local' THEN 1 ELSE 0 END) AS local_users, SUM(CASE WHEN auth_provider = 'google' THEN 1 ELSE 0 END) AS google_users FROM users`
    );
    console.log('\nMigration completed successfully!');
    console.log('Users:', rows[0]);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    conn.release();
    pool.end();
  }
}

run();
