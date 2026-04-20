-- Migration: Add Google OAuth support to users table
-- Date: 2026-02-17
-- Purpose: Enable Google OAuth 2.0 authentication
-- Run this migration to add required columns for Google Sign-In

USE hairvelous;

-- Check if columns already exist (safe to run multiple times)
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'hairvelous' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'auth_provider'
);

-- Add auth_provider column
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN auth_provider ENUM(''local'', ''google'') DEFAULT ''local'' NOT NULL AFTER password_hash',
  'SELECT ''Column auth_provider already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add google_sub column
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'hairvelous' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'google_sub'
);

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN google_sub VARCHAR(64) NULL UNIQUE AFTER auth_provider',
  'SELECT ''Column google_sub already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add is_email_verified column
SET @col_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'hairvelous' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'is_email_verified'
);

SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT 0 NOT NULL AFTER google_sub',
  'SELECT ''Column is_email_verified already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes (check if they exist first)
SET @idx_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'hairvelous' 
  AND TABLE_NAME = 'users' 
  AND INDEX_NAME = 'idx_google_sub'
);

SET @sql = IF(@idx_exists = 0,
  'CREATE INDEX idx_google_sub ON users(google_sub)',
  'SELECT ''Index idx_google_sub already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
  SELECT COUNT(*) 
  FROM INFORMATION_SCHEMA.STATISTICS 
  WHERE TABLE_SCHEMA = 'hairvelous' 
  AND TABLE_NAME = 'users' 
  AND INDEX_NAME = 'idx_auth_provider'
);

SET @sql = IF(@idx_exists = 0,
  'CREATE INDEX idx_auth_provider ON users(auth_provider)',
  'SELECT ''Index idx_auth_provider already exists'' AS message'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing users to mark email as verified (since they registered with email)
UPDATE users SET is_email_verified = 1 WHERE auth_provider = 'local';

-- Verify migration
SELECT 
  'Migration completed successfully!' AS status,
  COUNT(*) AS total_users,
  SUM(CASE WHEN auth_provider = 'local' THEN 1 ELSE 0 END) AS local_users,
  SUM(CASE WHEN auth_provider = 'google' THEN 1 ELSE 0 END) AS google_users
FROM users;
