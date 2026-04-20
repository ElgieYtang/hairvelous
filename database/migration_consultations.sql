-- Consultation module support
CREATE TABLE IF NOT EXISTS consultations (
  consultation_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  specialist_user_id INT NULL,
  concern_title VARCHAR(150) NOT NULL,
  concern_message TEXT NOT NULL,
  preferred_date DATE NULL,
  status ENUM('pending', 'accepted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  specialist_notes TEXT NULL,
  validated_products_text TEXT NULL,
  final_recommendation TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_consult_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_consult_specialist FOREIGN KEY (specialist_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);
