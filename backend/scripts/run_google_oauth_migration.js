/**
 * Run Google OAuth Migration
 * This script adds the necessary columns for Google OAuth support
 * Run with: node backend/scripts/run_google_oauth_migration.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function runMigration() {
  try {
    console.log('Starting Google OAuth migration...\n');

    // Check if columns already exist
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('auth_provider', 'google_sub', 'is_email_verified')
    `, [process.env.DB_NAME || 'hairvelous']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    
    if (existingColumns.includes('auth_provider') && 
        existingColumns.includes('google_sub') && 
        existingColumns.includes('is_email_verified')) {
      console.log('Migration already applied. Columns exist.');
      console.log('   - auth_provider');
      console.log('   - google_sub');
      console.log('   - is_email_verified\n');
      process.exit(0);
    }

    console.log('Adding columns to users table...\n');

    // Add columns one by one
    if (!existingColumns.includes('auth_provider')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN auth_provider ENUM('local', 'google') DEFAULT 'local' NOT NULL AFTER password_hash
      `);
      console.log('Added auth_provider column');
    } else {
      console.log('auth_provider column already exists');
    }

    if (!existingColumns.includes('google_sub')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN google_sub VARCHAR(64) NULL UNIQUE AFTER auth_provider
      `);
      console.log('Added google_sub column');
    } else {
      console.log('google_sub column already exists');
    }

    if (!existingColumns.includes('is_email_verified')) {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN is_email_verified BOOLEAN DEFAULT 0 NOT NULL AFTER google_sub
      `);
      console.log('Added is_email_verified column');
    } else {
      console.log('is_email_verified column already exists');
    }

    // Add indexes
    try {
      await pool.query('CREATE INDEX idx_google_sub ON users(google_sub)');
      console.log('Created index on google_sub');
    } catch (err) {
      if (err.code !== 'ER_DUP_KEYNAME') {
        throw err;
      }
      console.log('Index on google_sub already exists');
    }

    try {
      await pool.query('CREATE INDEX idx_auth_provider ON users(auth_provider)');
      console.log('Created index on auth_provider');
    } catch (err) {
      if (err.code !== 'ER_DUP_KEYNAME') {
        throw err;
      }
      console.log('Index on auth_provider already exists');
    }

    // Update existing users
    await pool.query(`UPDATE users SET is_email_verified = 1 WHERE auth_provider = 'local'`);
    console.log('Updated existing users to mark email as verified\n');

    console.log('Migration completed successfully!\n');
    console.log('You can now use Google Sign-In (after configuring credentials in .env)');
    
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigration();
