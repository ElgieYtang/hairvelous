/**
 * One-time cleanup: delete all consultations (and messages) for a user.
 * Usage: node backend/scripts/clearConsultationsForUser.js <email-or-partial-name>
 * Example: node backend/scripts/clearConsultationsForUser.js john
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const pool = require('../config/db');

async function main() {
  const q = (process.argv[2] || '').trim();
  if (!q) {
    console.error('Usage: node clearConsultationsForUser.js <email-or-name-fragment>');
    process.exit(1);
  }

  const exactEmail = q.includes('@');
  const [users] = await pool.query(
    exactEmail
      ? `SELECT user_id, name, email FROM users WHERE email = ? LIMIT 5`
      : `SELECT user_id, name, email FROM users WHERE email LIKE ? OR name LIKE ? LIMIT 20`,
    exactEmail ? [q] : [`%${q}%`, `%${q}%`]
  );
  if (!users.length) {
    console.error('No users matched:', q);
    process.exit(1);
  }
  if (users.length > 1) {
    console.log('Multiple matches — be specific:');
    users.forEach((u) => console.log(`  ${u.user_id}  ${u.email}  ${u.name}`));
    process.exit(1);
  }

  const userId = users[0].user_id;
  console.log('Deleting consultations for:', users[0].email, users[0].name, `(user_id=${userId})`);

  const [m] = await pool.query(
    `DELETE cm FROM consultation_messages cm
     INNER JOIN consultations c ON c.consultation_id = cm.consultation_id
     WHERE c.user_id = ?`,
    [userId]
  );
  console.log('Deleted messages (rows):', m.affectedRows);

  const [c] = await pool.query(`DELETE FROM consultations WHERE user_id = ?`, [userId]);
  console.log('Deleted consultations (rows):', c.affectedRows);

  await pool.end();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
