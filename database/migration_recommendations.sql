-- Persisted product recommendations per user (see recommendationService.replaceUserRecommendations)
CREATE TABLE IF NOT EXISTS recommendations (
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
