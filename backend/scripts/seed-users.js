/**
 * Run after database/seed.sql to set bcrypt passwords for default users.
 * Usage: node backend/scripts/seed-users.js
 * Requires: DB_* env or .env in backend folder.
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const pool = mysql.createPool(getMysqlConnectionOptions());

async function run() {
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('admin123', 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE email = 'hairvelian@example.com'", [hash1]);
  await pool.query("UPDATE users SET password_hash = ? WHERE email = 'admin@hairvelous.com'", [hash2]);
  console.log('Default user passwords set: hairvelian@example.com => password123, admin@hairvelous.com => admin123');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
