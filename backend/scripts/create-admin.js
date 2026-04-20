/**
 * Create Admin User Script
 * Creates admin account if it doesn't exist
 * Usage: node backend/scripts/create-admin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createAdmin() {
  try {
    console.log('Checking for admin account...\n');

    // Check if admin role exists
    const [roles] = await pool.query("SELECT role_id FROM roles WHERE role_name = 'admin'");
    if (roles.length === 0) {
      console.log('Creating admin role...');
      await pool.query("INSERT INTO roles (role_name) VALUES ('admin')");
      console.log('Admin role created\n');
    } else {
      console.log('Admin role exists\n');
    }

    const adminRoleId = roles.length > 0 ? roles[0].role_id : 2;

    // Check if admin user exists
    const [existing] = await pool.query(
      "SELECT user_id, email, role_id FROM users WHERE email = 'admin@hairvelous.com'"
    );

    if (existing.length > 0) {
      console.log('Admin account already exists!');
      console.log(`   Email: ${existing[0].email}`);
      console.log(`   User ID: ${existing[0].user_id}`);
      console.log(`   Role ID: ${existing[0].role_id}\n`);

      // Update password to admin123
      const passwordHash = await bcrypt.hash('admin123', 10);
      await pool.query(
        "UPDATE users SET password_hash = ?, role_id = ? WHERE email = 'admin@hairvelous.com'",
        [passwordHash, adminRoleId]
      );
      console.log('Admin password updated to: admin123\n');
    } else {
      console.log('Creating admin account...');
      
      // Create admin user
      const passwordHash = await bcrypt.hash('admin123', 10);
      const [result] = await pool.query(
        `INSERT INTO users (name, email, password_hash, role_id) 
         VALUES (?, ?, ?, ?)`,
        ['Admin User', 'admin@hairvelous.com', passwordHash, adminRoleId]
      );

      console.log('Admin account created!');
      console.log(`   User ID: ${result.insertId}`);
      console.log(`   Email: admin@hairvelous.com`);
      console.log(`   Password: admin123\n`);
    }

    // Verify admin account
    const [verify] = await pool.query(
      `SELECT u.user_id, u.name, u.email, r.role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.role_id 
       WHERE u.email = 'admin@hairvelous.com'`
    );

    if (verify.length > 0) {
      console.log('Verification successful:');
      console.log(`   Name: ${verify[0].name}`);
      console.log(`   Email: ${verify[0].email}`);
      console.log(`   Role: ${verify[0].role_name}`);
      console.log('\nAdmin account is ready!');
      console.log('\nLogin credentials:');
      console.log('   Email: admin@hairvelous.com');
      console.log('   Password: admin123\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createAdmin();
