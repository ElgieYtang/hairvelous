/**
 * Non-destructive routine table fixer.
 * Ensures `routine_logs` exists in the active DB and has media columns.
 */
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const conn = await mysql.createConnection(getMysqlConnectionOptions());
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS routine_logs (
        routine_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        activity_type VARCHAR(120) NOT NULL,
        date_logged DATE NOT NULL,
        notes TEXT NULL,
        media_path VARCHAR(500) NULL,
        media_type ENUM('image','video') NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    try {
      await conn.query('ALTER TABLE routine_logs ADD COLUMN media_path VARCHAR(500) NULL');
    } catch (_) {}
    try {
      await conn.query("ALTER TABLE routine_logs ADD COLUMN media_type ENUM('image','video') NULL");
    } catch (_) {}

    const [rows] = await conn.query("SHOW TABLES LIKE 'routine_logs'");
    if (!rows.length) throw new Error('routine_logs table was not created');
    console.log('routine_logs table ready');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
