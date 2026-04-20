-- Hairvelous Seed Data
USE hairvelous;

-- Roles (ignore if already present)
INSERT IGNORE INTO roles (id, name) VALUES
(1, 'user'),
(2, 'admin');

-- Users: run `node backend/scripts/seed-users.js` to set real passwords (password123 / admin123).
-- Hash below is bcrypt for "password" so login works even before running seed-users.js.
INSERT IGNORE INTO users (id, email, password_hash, first_name, last_name, role_id) VALUES
(1, 'hairvelian@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jane', 'Hairvelian', 1),
(2, 'admin@hairvelous.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Hairvelous', 2);

-- Assessment questions
INSERT INTO hair_assessment (question_key, question_text, question_order, question_type, options_json) VALUES
('hair_type', 'What best describes your hair type?', 1, 'single', '[
  {"value": "straight", "label": "Straight"},
  {"value": "wavy", "label": "Wavy"},
  {"value": "curly", "label": "Curly"},
  {"value": "coily", "label": "Coily/Kinky"}
]'),
('scalp_condition', 'How would you describe your scalp condition?', 2, 'single', '[
  {"value": "dry", "label": "Dry"},
  {"value": "normal", "label": "Normal"},
  {"value": "oily", "label": "Oily"},
  {"value": "combination", "label": "Combination"}
]'),
('issues', 'Which concerns do you experience? (Select all that apply)', 3, 'multiple', '[
  {"value": "dryness", "label": "Dryness"},
  {"value": "frizz", "label": "Frizz"},
  {"value": "oiliness", "label": "Oiliness"},
  {"value": "flaking", "label": "Flaking/dandruff"},
  {"value": "breakage", "label": "Breakage"},
  {"value": "thinning", "label": "Thinning"},
  {"value": "none", "label": "None of these"}
]'),
('severity', 'How would you rate the severity of your main concern?', 4, 'scale', '{"min": 1, "max": 5, "lowLabel": "Mild", "highLabel": "Severe"}'),
('wash_frequency', 'How often do you wash your hair?', 5, 'single', '[
  {"value": "daily", "label": "Daily"},
  {"value": "every_other", "label": "Every other day"},
  {"value": "twice_week", "label": "2-3 times a week"},
  {"value": "weekly", "label": "Once a week or less"}
]');

-- Product categories
INSERT INTO product_categories (name, slug, description) VALUES
('Shampoo', 'shampoo', 'Cleansing products for hair and scalp'),
('Conditioner', 'conditioner', 'Conditioning and detangling'),
('Treatment', 'treatment', 'Masks, oils, and treatments'),
('Styling', 'styling', 'Styling products');

-- Products (sample)
INSERT INTO products (category_id, name, slug, description, brand, target_issues_json, is_active) VALUES
(1, 'Hydrating Shampoo', 'hydrating-shampoo', 'Gentle cleanser for dry hair.', 'HairCare Co', '["dryness"]', 1),
(1, 'Clarifying Shampoo', 'clarifying-shampoo', 'Removes buildup; for oily scalp.', 'HairCare Co', '["oiliness"]', 1),
(2, 'Moisture Conditioner', 'moisture-conditioner', 'Deep moisture for dry, frizzy hair.', 'HairCare Co', '["dryness","frizz"]', 1),
(2, 'Lightweight Conditioner', 'lightweight-conditioner', 'For oily or fine hair.', 'HairCare Co', '["oiliness"]', 1),
(3, 'Scalp Soothing Serum', 'scalp-soothing-serum', 'Helps reduce flaking and itch.', 'HairCare Co', '["flaking"]', 1),
(3, 'Anti-Frizz Oil', 'anti-frizz-oil', 'Controls frizz and adds shine.', 'HairCare Co', '["frizz"]', 1);

-- DIY guides (sample)
INSERT INTO diy_guides (title, slug, summary, content, tags_json, is_published) VALUES
('DIY Coconut Oil Mask', 'diy-coconut-oil-mask', 'A simple at-home mask for dry hair.', 'Apply warm coconut oil to lengths and ends. Leave 30 mins then wash. For awareness only—not a medical treatment.', '["dryness","home-remedy"]', 1),
('Apple Cider Vinegar Rinse', 'acv-rinse', 'Gentle clarifying rinse for buildup.', 'Dilute 1 part ACV with 4 parts water. Rinse after shampoo. Do not use if you have open cuts or severe scalp issues; consult a professional if unsure.', '["oiliness","home-remedy"]', 1);

-- System config stub
INSERT INTO system_config (config_key, config_value) VALUES
('disclaimer_text', 'This system is for preventive awareness only. It does not diagnose or treat. Consult a professional for severe or persistent concerns.'),
('site_name', 'Hairvelous');
