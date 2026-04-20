/**
 * Ensure admin user exists with expected credentials.
 * Usage: node backend/scripts/ensure-admin-account.js
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const EMAIL = 'admin@hairvelous.com';
const PASSWORD = 'admin123';
const NAME = 'Admin';

async function run() {
  const pool = mysql.createPool(getMysqlConnectionOptions());
  const [roles] = await pool.query("SELECT role_id FROM roles WHERE role_name = 'admin' LIMIT 1");
  if (!roles.length) {
    throw new Error('Admin role not found in roles table');
  }
  const roleId = roles[0].role_id;
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const [users] = await pool.query('SELECT user_id FROM users WHERE email = ? LIMIT 1', [EMAIL]);
  if (users.length) {
    await pool.query('UPDATE users SET name = ?, password_hash = ?, role_id = ? WHERE user_id = ?', [
      NAME,
      passwordHash,
      roleId,
      users[0].user_id,
    ]);
    console.log(`Updated ${EMAIL} password.`);
  } else {
    await pool.query('INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)', [
      NAME,
      EMAIL,
      passwordHash,
      roleId,
    ]);
    console.log(`Created ${EMAIL} with admin role.`);
  }

  await pool.end();
}

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
