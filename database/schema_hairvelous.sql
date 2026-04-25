-- Hairvelous MySQL Schema
-- Single file: tables, indexes, foreign keys, seed data

CREATE DATABASE IF NOT EXISTS hairvelous;
USE hairvelous;

-- ---------------------------------------------------------------------------
-- Tables (drop in reverse dependency order for clean rerun)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS routine_logs;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS product_categories;
DROP TABLE IF EXISTS diy_guides;
DROP TABLE IF EXISTS hair_profiles;
DROP TABLE IF EXISTS hair_photos;
DROP TABLE IF EXISTS assessment_responses;
DROP TABLE IF EXISTS hair_assessment;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS products;

-- ---------------------------------------------------------------------------
-- roles
-- ---------------------------------------------------------------------------
CREATE TABLE roles (
  role_id INT PRIMARY KEY AUTO_INCREMENT,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  INDEX idx_role_name (role_name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires_at DATETIME NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_email (email),
  INDEX idx_role_id (role_id),
  INDEX idx_reset_token (reset_token),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- hair_assessment
-- ---------------------------------------------------------------------------
CREATE TABLE hair_assessment (
  assessment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_date_taken (date_taken),
  CONSTRAINT fk_assessment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- assessment_responses
-- ---------------------------------------------------------------------------
CREATE TABLE assessment_responses (
  response_id INT PRIMARY KEY AUTO_INCREMENT,
  assessment_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  INDEX idx_assessment_id (assessment_id),
  CONSTRAINT fk_response_assessment FOREIGN KEY (assessment_id) REFERENCES hair_assessment(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- hair_photos
-- ---------------------------------------------------------------------------
CREATE TABLE hair_photos (
  photo_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  ai_result TEXT NULL,
  date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_date_uploaded (date_uploaded),
  CONSTRAINT fk_photo_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- hair_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE hair_profiles (
  profile_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  hair_type VARCHAR(100) NULL,
  scalp_condition VARCHAR(100) NULL,
  issues_detected TEXT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_last_updated (last_updated),
  CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  expiry_type ENUM('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable',
  expiry_date DATE NULL,
  expiry_period_months INT NULL,
  INDEX idx_name (name),
  INDEX idx_brand (brand)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- product_categories (product_id FK -> products)
-- ---------------------------------------------------------------------------
CREATE TABLE product_categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  category_name VARCHAR(100) NOT NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_category_name (category_name),
  CONSTRAINT fk_cat_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- recommendations
-- ---------------------------------------------------------------------------
CREATE TABLE recommendations (
  rec_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  reason TEXT NULL,
  date_recommended TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_date_recommended (date_recommended),
  CONSTRAINT fk_rec_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rec_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- routine_logs
-- ---------------------------------------------------------------------------
CREATE TABLE routine_logs (
  routine_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  notes TEXT NULL,
  date_logged DATE NOT NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_date_logged (date_logged),
  INDEX idx_activity_type (activity_type),
  CONSTRAINT fk_routine_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- diy_guides
-- ---------------------------------------------------------------------------
CREATE TABLE diy_guides (
  guide_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category ENUM('mask', 'oil', 'rinse', 'growth') NOT NULL DEFAULT 'mask',
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
  ingredients TEXT NULL,
  steps TEXT NOT NULL,
  caution TEXT NULL,
  created_by INT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_created_by (created_by),
  INDEX idx_date_created (date_created),
  CONSTRAINT fk_guide_creator FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Seed: roles (user, specialist, admin)
-- ---------------------------------------------------------------------------
INSERT INTO roles (role_id, role_name) VALUES
(1, 'user'),
(2, 'specialist'),
(3, 'admin');

-- ---------------------------------------------------------------------------
-- Seed: sample products and product_categories
-- Categories: anti-dandruff, moisturizing, anti-frizz, clarifying/oily scalp
-- ---------------------------------------------------------------------------
INSERT INTO products (product_id, name, brand, description, price) VALUES
(1, 'Scalp Relief Shampoo', 'HairCare Pro', 'Helps reduce flaking and soothe itchy scalp. For preventive care only.', 12.99),
(2, 'Anti-Dandruff Treatment Serum', 'ScalpFix', 'Targeted serum for visible flaking. Not a medical treatment.', 18.50),
(3, 'Deep Moisture Hair Mask', 'HydrateCo', 'Intensive hydration for dry, brittle hair.', 14.99),
(4, 'Daily Moisturizing Conditioner', 'HairCare Pro', 'Lightweight moisture for daily use.', 9.99),
(5, 'Frizz Control Oil', 'SmoothLock', 'Reduces frizz and adds shine without weighing down.', 16.00),
(6, 'Anti-Frizz Smoothing Serum', 'HairCare Pro', 'Heat-protectant and frizz control in one.', 13.50),
(7, 'Clarifying Shampoo', 'PureScalp', 'Removes buildup; for oily scalp. Use weekly.', 11.99),
(8, 'Oil-Control Scalp Tonic', 'PureScalp', 'Lightweight tonic for oily roots and fresh scalp.', 15.00);

INSERT INTO product_categories (product_id, category_name) VALUES
(1, 'anti-dandruff'),
(2, 'anti-dandruff'),
(3, 'moisturizing'),
(4, 'moisturizing'),
(5, 'anti-frizz'),
(6, 'anti-frizz'),
(7, 'clarifying/oily scalp'),
(8, 'clarifying/oily scalp');

-- ---------------------------------------------------------------------------
-- Seed: sample DIY guides
-- ---------------------------------------------------------------------------
INSERT INTO diy_guides (title, category, difficulty, ingredients, steps, caution, created_by) VALUES
('Coconut Oil Hair Mask', 'mask', 'easy', '2 tbsp coconut oil, 1 tbsp honey (optional)', '1. Warm coconut oil slightly\n2. Apply to hair lengths and ends\n3. Leave for 30 minutes\n4. Wash with mild shampoo', 'Do not use if allergic to coconut. Patch test first.', NULL),
('Apple Cider Vinegar Rinse', 'rinse', 'easy', '1 part ACV, 4 parts water', '1. Mix ACV with water\n2. After shampooing, pour over hair\n3. Massage scalp gently\n4. Rinse thoroughly', 'Do not use if you have open cuts or severe scalp issues. Consult a professional if unsure.', NULL),
('Argan Oil Treatment', 'oil', 'easy', '2-3 drops argan oil', '1. Apply oil to palms\n2. Work through damp hair\n3. Focus on ends\n4. Style as usual', 'Use sparingly to avoid greasy look.', NULL),
('Egg and Olive Oil Mask', 'mask', 'medium', '1 egg, 2 tbsp olive oil', '1. Beat egg and mix with olive oil\n2. Apply to hair\n3. Cover with shower cap\n4. Leave 20 minutes\n5. Rinse with cool water', 'Use cool water to rinse to avoid cooking the egg. May have strong smell.', NULL),
('Rice Water Rinse for Growth', 'rinse', 'easy', '1 cup rice, 2 cups water', '1. Soak rice in water for 30 minutes\n2. Strain and collect water\n3. After shampoo, pour rice water over hair\n4. Massage and leave 5 minutes\n5. Rinse', 'Fermented rice water may have stronger effect but stronger smell. Start with fresh rice water.', NULL);

-- Optional: seed users (passwords are bcrypt placeholders; run backend/scripts/seed-users.js to set real ones)
-- INSERT INTO users (name, email, password_hash, role_id) VALUES
-- ('Jane User', 'user@example.com', '$2a$10$placeholder', 1),
-- ('Specialist User', 'specialist@example.com', '$2a$10$placeholder', 2),
-- ('Admin User', 'admin@example.com', '$2a$10$placeholder', 3);
