const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const billingService = require('../services/billingService');

async function run() {
  const email = process.env.PRO_TEST_EMAIL || 'protester1@hairvelous.com';
  const password = process.env.PRO_TEST_PASSWORD || 'pro123456';
  const name = process.env.PRO_TEST_NAME || 'Pro Tester One';

  const [roleRows] = await pool.query(
    'SELECT role_id FROM roles WHERE role_name = ? LIMIT 1',
    ['user']
  );
  if (!roleRows.length) {
    throw new Error('Role "user" not found. Run database setup first.');
  }

  const roleId = roleRows[0].role_id;
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role_id = VALUES(role_id)`,
    [name, email, passwordHash, roleId]
  );

  const [userRows] = await pool.query(
    'SELECT user_id FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  if (!userRows.length) {
    throw new Error('User was not created.');
  }

  const userId = userRows[0].user_id;
  await billingService.activateProDirect(userId);

  console.log('Pro test account ready:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Name: ${name}`);
  console.log(`User ID: ${userId}`);
}

run()
  .catch((err) => {
    console.error('Failed to create Pro test account:', err.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await pool.end();
    } catch (_) {}
  });
