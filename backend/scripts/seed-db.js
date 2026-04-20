/**
 * Seed local MySQL database with starter users compatible with current schema.
 *
 * Usage:
 *   node scripts/seed-db.js
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const mysqlOpts = getMysqlConnectionOptions();
const database = mysqlOpts.database;

async function ensureRole(conn, roleName) {
  const [existing] = await conn.query('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
  if (existing.length > 0) return existing[0].role_id;
  const [inserted] = await conn.query('INSERT INTO roles (role_name) VALUES (?)', [roleName]);
  return inserted.insertId;
}

async function upsertUser(conn, { name, email, passwordHash, roleId }) {
  await conn.query(
    `
      INSERT INTO users (name, email, password_hash, role_id)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password_hash = VALUES(password_hash),
        role_id = VALUES(role_id)
    `,
    [name, email, passwordHash, roleId]
  );
}

async function run() {
  const conn = await mysql.createConnection(mysqlOpts);
  try {
    await conn.query(`USE \`${database}\``);

    const userRoleId = await ensureRole(conn, 'user');
    const adminRoleId = await ensureRole(conn, 'admin');

    const userHash = await bcrypt.hash('password123', 10);
    const adminHash = await bcrypt.hash('admin123', 10);

    await upsertUser(conn, {
      name: 'Jane Hairvelian',
      email: 'hairvelian@example.com',
      passwordHash: userHash,
      roleId: userRoleId,
    });
    await upsertUser(conn, {
      name: 'Admin Hairvelous',
      email: 'admin@hairvelous.com',
      passwordHash: adminHash,
      roleId: adminRoleId,
    });

    console.log('Seed complete.');
    console.log('Default accounts: hairvelian@example.com / password123, admin@hairvelous.com / admin123');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Seed failed:', err.message || err);
  process.exit(1);
});
