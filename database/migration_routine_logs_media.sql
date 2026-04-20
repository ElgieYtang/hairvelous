-- Add media support to routine logs
ALTER TABLE routine_logs
  ADD COLUMN IF NOT EXISTS media_path VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS media_type ENUM('image','video') NULL;
