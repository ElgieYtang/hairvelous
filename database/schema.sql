-- Hairvelous Database Schema
-- Preventive, non-medical hair care & product recommendation system

CREATE DATABASE IF NOT EXISTS hairvelous;
USE hairvelous;

-- Roles for RBAC
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Hairvelians + Admin)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role_id INT NOT NULL DEFAULT 1,
  is_suspended TINYINT(1) NOT NULL DEFAULT 0,
  reset_token VARCHAR(255) NULL,
  reset_token_expires_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Hair assessment definitions (quiz questions)
CREATE TABLE hair_assessment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_key VARCHAR(100) NOT NULL,
  question_text TEXT NOT NULL,
  question_order INT NOT NULL DEFAULT 0,
  question_type ENUM('single', 'multiple', 'scale', 'text') DEFAULT 'single',
  options_json JSON NULL COMMENT 'For single/multiple: [{value, label}, ...]. For scale: {min, max, labels}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User's assessment attempts (one row per completed quiz)
CREATE TABLE assessment_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Responses per question per session
CREATE TABLE assessment_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL,
  question_id INT NOT NULL,
  response_value VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES hair_assessment(id),
  UNIQUE KEY uq_session_question (session_id, question_id)
);

-- Derived hair profile per session (summary, issues, routine summary)
CREATE TABLE hair_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  session_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,
  summary_text TEXT,
  issues_json JSON NULL COMMENT 'e.g. ["dryness","frizz","oiliness","flaking"]',
  routine_summary TEXT,
  severity_flag TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 = advise professional consultation',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES assessment_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User-uploaded hair/scalp photos
CREATE TABLE hair_photos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_name VARCHAR(255),
  caption VARCHAR(255) NULL,
  analysis_notes TEXT NULL COMMENT 'Heuristic/demo analysis result',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Product categories
CREATE TABLE product_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NULL,
  brand VARCHAR(100) NULL,
  image_url VARCHAR(500) NULL,
  target_issues_json JSON NULL COMMENT 'e.g. ["dryness","frizz"]',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
  UNIQUE KEY uq_slug (slug)
);

-- Recommendations (link profile/session to products)
CREATE TABLE recommendations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hair_profile_id INT NOT NULL,
  product_id INT NOT NULL,
  rank_order INT NOT NULL DEFAULT 0,
  reason_text VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hair_profile_id) REFERENCES hair_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_profile_product (hair_profile_id, product_id)
);

-- DIY hair care guides
CREATE TABLE diy_guides (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT NULL,
  content TEXT NOT NULL,
  tags_json JSON NULL COMMENT 'e.g. ["dryness","frizz","home-remedy"]',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Routine logs (user logs their routine)
CREATE TABLE routine_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  log_date DATE NOT NULL,
  routine_type VARCHAR(50) NULL COMMENT 'e.g. wash, mask, oil',
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_user_date (user_id, log_date)
);

-- Notification/reminder settings (stub)
CREATE TABLE notification_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  reminders_enabled TINYINT(1) NOT NULL DEFAULT 1,
  reminder_frequency VARCHAR(50) NULL COMMENT 'daily, weekly, etc.',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- System config (admin stub)
CREATE TABLE system_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  config_key VARCHAR(100) NOT NULL UNIQUE,
  config_value TEXT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
