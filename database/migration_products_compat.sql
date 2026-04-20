-- Product schema compatibility migration
-- Adds columns used by services/routes on older installs.

USE hairvelous;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS expiry_type ENUM('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable',
  ADD COLUMN IF NOT EXISTS expiry_date DATE NULL,
  ADD COLUMN IF NOT EXISTS expiry_period_months INT NULL;
