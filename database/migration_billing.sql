-- Pro plans, subscriptions, and payment records (GCash/Card)
CREATE TABLE IF NOT EXISTS subscription_plans (
  plan_id INT PRIMARY KEY AUTO_INCREMENT,
  plan_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  price_php DECIMAL(10,2) NOT NULL DEFAULT 0,
  duration_days INT NOT NULL DEFAULT 30,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  subscription_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  status ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active',
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  payment_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  method ENUM('gcash','card') NOT NULL DEFAULT 'gcash',
  amount_php DECIMAL(10,2) NOT NULL DEFAULT 0,
  gcash_name VARCHAR(150) NULL,
  gcash_number VARCHAR(30) NULL,
  gcash_reference VARCHAR(100) NULL,
  card_name VARCHAR(150) NULL,
  card_last4 VARCHAR(4) NULL,
  card_reference VARCHAR(100) NULL,
  receipt_path VARCHAR(500) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_note TEXT NULL,
  reviewed_by INT NULL,
  reviewed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_plan FOREIGN KEY (plan_id) REFERENCES subscription_plans(plan_id) ON DELETE RESTRICT,
  CONSTRAINT fk_payment_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

INSERT IGNORE INTO subscription_plans (plan_id, plan_code, name, price_php, duration_days, is_active)
VALUES (1, 'free', 'Free', 0, 3650, 1);

INSERT IGNORE INTO subscription_plans (plan_id, plan_code, name, price_php, duration_days, is_active)
VALUES (2, 'pro_monthly', 'Pro Monthly', 199, 30, 1);
