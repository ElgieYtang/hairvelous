-- Migration: Add new fields to diy_guides table
-- Run this after schema_hairvelous.sql if table already exists

USE hairvelous;

-- Drop existing diy_guides table if it has old structure
DROP TABLE IF EXISTS diy_guides;

-- Create new diy_guides table with all required fields
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

-- Insert sample guides
INSERT INTO diy_guides (title, category, difficulty, ingredients, steps, caution, created_by) VALUES
('Coconut Oil Hair Mask', 'mask', 'easy', '2 tbsp coconut oil, 1 tbsp honey (optional)', '1. Warm coconut oil slightly\n2. Apply to hair lengths and ends\n3. Leave for 30 minutes\n4. Wash with mild shampoo', 'Do not use if allergic to coconut. Patch test first.', NULL),
('Apple Cider Vinegar Rinse', 'rinse', 'easy', '1 part ACV, 4 parts water', '1. Mix ACV with water\n2. After shampooing, pour over hair\n3. Massage scalp gently\n4. Rinse thoroughly', 'Do not use if you have open cuts or severe scalp issues. Consult a professional if unsure.', NULL),
('Argan Oil Treatment', 'oil', 'easy', '2-3 drops argan oil', '1. Apply oil to palms\n2. Work through damp hair\n3. Focus on ends\n4. Style as usual', 'Use sparingly to avoid greasy look.', NULL),
('Egg and Olive Oil Mask', 'mask', 'medium', '1 egg, 2 tbsp olive oil', '1. Beat egg and mix with olive oil\n2. Apply to hair\n3. Cover with shower cap\n4. Leave 20 minutes\n5. Rinse with cool water', 'Use cool water to rinse to avoid cooking the egg. May have strong smell.', NULL),
('Rice Water Rinse for Growth', 'rinse', 'easy', '1 cup rice, 2 cups water', '1. Soak rice in water for 30 minutes\n2. Strain and collect water\n3. After shampoo, pour rice water over hair\n4. Massage and leave 5 minutes\n5. Rinse', 'Fermented rice water may have stronger effect but stronger smell. Start with fresh rice water.', NULL);
