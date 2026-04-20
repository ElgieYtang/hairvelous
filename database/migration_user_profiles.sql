-- Migration: User profiles (specialty, location, rate, expertise, skills, education, photo, credential docs)
-- Run once: mysql -u root -p hairvelous < database/migration_user_profiles.sql

USE hairvelous;

-- Extended profile per user (1:1 with users)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id INT PRIMARY KEY,
  profile_photo_path VARCHAR(500) NULL,
  specialty VARCHAR(200) NULL,
  location VARCHAR(255) NULL,
  consultation_rate DECIMAL(10, 2) NULL,
  sex VARCHAR(32) NULL,
  birthdate DATE NULL,
  race VARCHAR(120) NULL,
  expertise_json TEXT NULL COMMENT 'JSON array of strings',
  skills_json TEXT NULL COMMENT 'JSON array of strings',
  education_json TEXT NULL COMMENT 'JSON array of {institution, degree, year} or strings',
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Backfill columns for older installs where user_profiles existed before demographic fields.
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS sex VARCHAR(32) NULL,
  ADD COLUMN IF NOT EXISTS birthdate DATE NULL,
  ADD COLUMN IF NOT EXISTS race VARCHAR(120) NULL;

-- Credential documents (PDFs/images) for verification
CREATE TABLE IF NOT EXISTS user_credential_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_cred_doc_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
