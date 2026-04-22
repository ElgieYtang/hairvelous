/**
 * Demo helper: creates one specialist account on demand.
 *
 * Usage:
 *   npm run seed:demo-specialist
 *
 * Notes:
 * - This script is manual only (not auto-run on server start).
 * - It prints generated credentials to stdout as JSON.
 * - Email is unique per run: spec.demo+<timestamp>@hairvelous.com
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const email = `spec.demo+${Date.now()}@hairvelous.com`;
  const password = 'SpecDemo123!';
  const name = 'Specialist Demo Tester';

  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'hairvelous',
  });

  const [roles] = await conn.query('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', ['specialist']);
  if (!roles.length) throw new Error('specialist role not found');

  const hash = await bcrypt.hash(password, 10);
  const [res] = await conn.query(
    'INSERT INTO users (name, email, password_hash, role_id, is_suspended) VALUES (?, ?, ?, ?, 0)',
    [name, email, hash, roles[0].role_id]
  );

  await conn.query(
    'INSERT INTO user_profiles (user_id) VALUES (?) ON DUPLICATE KEY UPDATE user_id = user_id',
    [res.insertId]
  );

  console.log(
    JSON.stringify({
      userId: res.insertId,
      name,
      email,
      password,
      role: 'specialist',
    })
  );

  await conn.end();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
