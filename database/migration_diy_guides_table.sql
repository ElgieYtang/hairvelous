-- Non-destructive: create diy_guides if missing (matches guideService + is_pro_only/summary)
CREATE TABLE IF NOT EXISTS diy_guides (
  guide_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category ENUM('mask', 'oil', 'rinse', 'growth') NOT NULL DEFAULT 'mask',
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'easy',
  ingredients TEXT NULL,
  steps TEXT NOT NULL,
  caution TEXT NULL,
  created_by INT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_pro_only TINYINT(1) NOT NULL DEFAULT 0,
  summary TEXT NULL,
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty),
  INDEX idx_created_by (created_by),
  INDEX idx_date_created (date_created),
  CONSTRAINT fk_guide_creator FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
