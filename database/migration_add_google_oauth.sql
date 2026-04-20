-- Migration: Add Google OAuth support to users table
-- Date: 2026-02-17
-- Purpose: Enable Google OAuth 2.0 authentication

USE hairvelous;

-- Add new columns for Google OAuth
ALTER TABLE users
  ADD COLUMN auth_provider ENUM('local', 'google') DEFAULT 'local' NOT NULL AFTER password_hash,
  ADD COLUMN google_sub VARCHAR(64) NULL UNIQUE AFTER auth_provider,
  ADD COLUMN is_email_verified BOOLEAN DEFAULT 0 NOT NULL AFTER google_sub;

-- Add index on google_sub for faster lookups
CREATE INDEX idx_google_sub ON users(google_sub);

-- Add index on auth_provider
CREATE INDEX idx_auth_provider ON users(auth_provider);

-- Update existing users to mark email as verified (since they registered with email)
UPDATE users SET is_email_verified = 1 WHERE auth_provider = 'local';

-- Note: password_hash can be NULL for Google users, but we'll keep it NOT NULL
-- for backward compatibility. Google users will have a placeholder hash.
-- If you want to allow NULL, uncomment the following:
-- ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL;
