/**
 * Ensure specialist user miller@gmail.com exists with password miller123.
 * Usage: node scripts/ensure-specialist-miller.js
 */
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const EMAIL = 'miller@gmail.com';
const PASSWORD = 'miller123';
const NAME = 'Miller Specialist';

async function main() {
  const [roles] = await pool.query('SELECT role_id, role_name FROM roles ORDER BY role_id');
  console.log('roles:', roles);

  let specialistRole = roles.find((r) => r.role_name === 'specialist');
  if (!specialistRole) {
    const [ins] = await pool.query(
      "INSERT INTO roles (role_name) VALUES ('specialist')"
    );
    specialistRole = { role_id: ins.insertId, role_name: 'specialist' };
    console.log('Created role specialist:', specialistRole.role_id);
  }

  const [existing] = await pool.query('SELECT user_id, email, role_id FROM users WHERE email = ?', [EMAIL]);
  const hash = await bcrypt.hash(PASSWORD, 10);

  if (existing.length) {
    await pool.query(
      'UPDATE users SET password_hash = ?, name = ?, role_id = ? WHERE user_id = ?',
      [hash, NAME, specialistRole.role_id, existing[0].user_id]
    );
    console.log('Updated existing user:', existing[0].user_id, EMAIL);
  } else {
    const [ins] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
      [NAME, EMAIL, hash, specialistRole.role_id]
    );
    console.log('Inserted user:', ins.insertId, EMAIL);
  }

  const [out] = await pool.query(
    `SELECT u.user_id, u.name, u.email, r.role_name
     FROM users u JOIN roles r ON r.role_id = u.role_id WHERE u.email = ?`,
    [EMAIL]
  );
  console.log('Retrieved:', JSON.stringify(out[0], null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
