/**
 * Prepare repeatable defense/demo data without destructive resets.
 *
 * Usage:
 *   node scripts/prepare-defense-demo.js
 */
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const mysqlOpts = getMysqlConnectionOptions();
const database = mysqlOpts.database;

const DEMO_USERS = {
  user: {
    name: 'Jane Hairvelian',
    email: 'hairvelian@example.com',
    password: 'password123',
    role: 'user',
  },
  specialist: {
    name: 'Specialist Hairvelous',
    email: 'specialist@hairvelous.com',
    password: 'specialist123',
    role: 'specialist',
  },
  admin: {
    name: 'Admin Hairvelous',
    email: 'admin@hairvelous.com',
    password: 'admin123',
    role: 'admin',
  },
};

async function ensureRole(conn, roleName) {
  const [rows] = await conn.query('SELECT role_id FROM roles WHERE role_name = ? LIMIT 1', [roleName]);
  if (rows.length) return Number(rows[0].role_id);
  const [ins] = await conn.query('INSERT INTO roles (role_name) VALUES (?)', [roleName]);
  return Number(ins.insertId);
}

async function ensureUser(conn, item, roleId) {
  const hash = await bcrypt.hash(item.password, 10);
  await conn.query(
    `INSERT INTO users (name, email, password_hash, role_id)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role_id = VALUES(role_id)`,
    [item.name, item.email, hash, roleId]
  );
  const [rows] = await conn.query('SELECT user_id FROM users WHERE email = ? LIMIT 1', [item.email]);
  return Number(rows[0].user_id);
}

async function ensureSpecialistProfile(conn, specialistUserId) {
  await conn.query(
    `INSERT INTO user_profiles (user_id, specialty, location, consultation_rate)
     VALUES (?, 'Hair & scalp care', 'Philippines', 900)
     ON DUPLICATE KEY UPDATE
       specialty = VALUES(specialty),
       location = VALUES(location),
       consultation_rate = VALUES(consultation_rate)`,
    [specialistUserId]
  );
}

async function ensureCoreProducts(conn) {
  const [rows] = await conn.query('SELECT COUNT(*) AS c FROM products');
  const count = Number(rows[0].c || 0);
  if (count > 0) return count;

  const catalog = [
    ['Scalp Relief Shampoo', 'HairCare Pro', 'Helps reduce visible flaking and soothe itchy scalp.', 12.99, 'anti-dandruff'],
    ['Deep Moisture Hair Mask', 'HydrateCo', 'Hydration support for dry and rough-feeling hair.', 14.99, 'moisturizing'],
    ['Frizz Control Oil', 'SmoothLock', 'Light finishing oil to reduce frizz and add shine.', 16.0, 'anti-frizz'],
    ['Clarifying Shampoo', 'PureScalp', 'Weekly clarifying wash for oily scalp and buildup.', 11.99, 'clarifying/oily scalp'],
  ];
  for (const [name, brand, description, price, category] of catalog) {
    const [ins] = await conn.query(
      `INSERT INTO products (name, brand, description, price, expiry_type)
       VALUES (?, ?, ?, ?, 'not_applicable')`,
      [name, brand, description, price]
    );
    await conn.query(
      'INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)',
      [ins.insertId, category]
    );
  }
  return catalog.length;
}

async function prepareDemoConsultations(conn, userId, specialistUserId, adminUserId) {
  await conn.query('DELETE FROM consultations WHERE concern_title LIKE ?', ['[DEMO] %']);

  const [completed] = await conn.query(
    `INSERT INTO consultations (
      user_id, specialist_user_id, concern_title, concern_message, preferred_date, status,
      amount_php, platform_fee_percent, payment_status, payment_reference,
      paid_verified_at, verified_by_admin_user_id, scheduled_at, completed_at,
      final_recommendation, prescription_summary, prescription_products_text, prescription_plan_text, prescription_issued_at
    ) VALUES (?, ?, ?, ?, CURDATE(), 'completed', 900, 10, 'verified', ?, NOW(), ?, NOW(), NOW(),
      ?, ?, ?, ?, NOW())`,
    [
      userId,
      specialistUserId,
      '[DEMO] Completed consultation',
      'Demo concern used for defense presentation.',
      `DEMO-REF-${Date.now()}`,
      adminUserId,
      'Findings: mild dryness and frizz. Plan: keep routine consistent and monitor weekly.',
      'Hydration + anti-frizz routine',
      'Deep Moisture Hair Mask, Frizz Control Oil',
      'Use mask weekly and oil on damp hair after wash.',
    ]
  );
  const completedId = Number(completed.insertId);

  await conn.query(
    `INSERT INTO consultation_feedback
      (consultation_id, user_id, specialist_user_id, rating, feedback_text)
     VALUES (?, ?, ?, 5, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), feedback_text = VALUES(feedback_text)`,
    [completedId, userId, specialistUserId, 'Very clear recommendations and easy to follow routine.']
  );

  const [active] = await conn.query(
    `INSERT INTO consultations (
      user_id, specialist_user_id, concern_title, concern_message, preferred_date, status,
      amount_php, platform_fee_percent, payment_status
    ) VALUES (?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'awaiting_payment', 900, 10, 'unpaid')`,
    [userId, specialistUserId, '[DEMO] Awaiting payment consultation', 'Demo pending booking to show progress flow.']
  );
  const activeId = Number(active.insertId);

  return { completedId, activeId };
}

async function run() {
  const conn = await mysql.createConnection(mysqlOpts);
  try {
    await conn.query(`USE \`${database}\``);

    const roleIds = {
      user: await ensureRole(conn, 'user'),
      specialist: await ensureRole(conn, 'specialist'),
      admin: await ensureRole(conn, 'admin'),
    };

    const userId = await ensureUser(conn, DEMO_USERS.user, roleIds.user);
    const specialistUserId = await ensureUser(conn, DEMO_USERS.specialist, roleIds.specialist);
    const adminUserId = await ensureUser(conn, DEMO_USERS.admin, roleIds.admin);

    await ensureSpecialistProfile(conn, specialistUserId);
    const productsCount = await ensureCoreProducts(conn);
    const consultations = await prepareDemoConsultations(conn, userId, specialistUserId, adminUserId);

    console.log('Defense demo data prepared.');
    console.log(`Users ready: user=${userId}, specialist=${specialistUserId}, admin=${adminUserId}`);
    console.log(`Specialist consultation fee set to: PHP 900`);
    console.log(`Products available: ${productsCount}+`);
    console.log(`Demo consultations: completed=#${consultations.completedId}, awaiting_payment=#${consultations.activeId}`);
    console.log('Credentials:');
    console.log('  user: hairvelian@example.com / password123');
    console.log('  specialist: specialist@hairvelous.com / specialist123');
    console.log('  admin: admin@hairvelous.com / admin123');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('prepare-defense-demo failed:', err.message || err);
  process.exit(1);
});
