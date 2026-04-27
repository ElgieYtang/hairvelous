-- Hairvelous behavior-based query pack
-- Run in MySQL client after: USE hairvelous;

USE hairvelous;

-- ---------------------------------------------------------------------------
-- 1) Quick health checks (all core tables)
-- ---------------------------------------------------------------------------
SELECT 'roles' AS table_name, COUNT(*) AS row_count FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'hair_assessment', COUNT(*) FROM hair_assessment
UNION ALL SELECT 'assessment_responses', COUNT(*) FROM assessment_responses
UNION ALL SELECT 'hair_profiles', COUNT(*) FROM hair_profiles
UNION ALL SELECT 'hair_photos', COUNT(*) FROM hair_photos
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'product_categories', COUNT(*) FROM product_categories
UNION ALL SELECT 'recommendations', COUNT(*) FROM recommendations
UNION ALL SELECT 'routine_logs', COUNT(*) FROM routine_logs
UNION ALL SELECT 'diy_guides', COUNT(*) FROM diy_guides
UNION ALL SELECT 'consultations', COUNT(*) FROM consultations
UNION ALL SELECT 'subscription_plans', COUNT(*) FROM subscription_plans
UNION ALL SELECT 'user_subscriptions', COUNT(*) FROM user_subscriptions
UNION ALL SELECT 'payment_transactions', COUNT(*) FROM payment_transactions;

-- ---------------------------------------------------------------------------
-- 2) Auth / user access behavior
-- ---------------------------------------------------------------------------
SELECT
  u.user_id,
  u.name,
  u.email,
  r.role_name,
  u.date_created
FROM users u
JOIN roles r ON r.role_id = u.role_id
ORDER BY u.date_created DESC;

-- Check for duplicated emails (should return 0 rows)
SELECT email, COUNT(*) AS occurrences
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- ---------------------------------------------------------------------------
-- 3) Assessment behavior (user takes assessment + answers)
-- ---------------------------------------------------------------------------
SELECT
  ha.assessment_id,
  ha.user_id,
  u.email,
  ha.date_taken,
  COUNT(ar.response_id) AS answer_count
FROM hair_assessment ha
JOIN users u ON u.user_id = ha.user_id
LEFT JOIN assessment_responses ar ON ar.assessment_id = ha.assessment_id
GROUP BY ha.assessment_id, ha.user_id, u.email, ha.date_taken
ORDER BY ha.date_taken DESC;

-- Users with no assessments yet
SELECT u.user_id, u.email
FROM users u
LEFT JOIN hair_assessment ha ON ha.user_id = u.user_id
WHERE ha.assessment_id IS NULL
ORDER BY u.user_id;

-- ---------------------------------------------------------------------------
-- 4) Hair profile + photo behavior
-- ---------------------------------------------------------------------------
SELECT
  u.user_id,
  u.email,
  hp.hair_type,
  hp.scalp_condition,
  hp.last_updated
FROM users u
LEFT JOIN hair_profiles hp ON hp.user_id = u.user_id
ORDER BY hp.last_updated DESC;

SELECT
  hp.user_id,
  u.email,
  COUNT(*) AS photo_count,
  MAX(hp.date_uploaded) AS latest_upload
FROM hair_photos hp
JOIN users u ON u.user_id = hp.user_id
GROUP BY hp.user_id, u.email
ORDER BY latest_upload DESC;

-- ---------------------------------------------------------------------------
-- 5) Product catalog + recommendation behavior
-- ---------------------------------------------------------------------------
SELECT
  p.product_id,
  p.name,
  p.brand,
  p.price,
  GROUP_CONCAT(pc.category_name ORDER BY pc.category_name SEPARATOR ', ') AS categories
FROM products p
LEFT JOIN product_categories pc ON pc.product_id = p.product_id
GROUP BY p.product_id, p.name, p.brand, p.price
ORDER BY p.name;

SELECT
  rec.rec_id,
  rec.date_recommended,
  u.email AS user_email,
  p.name AS product_name,
  p.brand,
  rec.reason
FROM recommendations rec
JOIN users u ON u.user_id = rec.user_id
JOIN products p ON p.product_id = rec.product_id
ORDER BY rec.date_recommended DESC;

-- Top recommended products
SELECT
  p.product_id,
  p.name,
  COUNT(*) AS recommendation_count
FROM recommendations rec
JOIN products p ON p.product_id = rec.product_id
GROUP BY p.product_id, p.name
ORDER BY recommendation_count DESC, p.name;

-- ---------------------------------------------------------------------------
-- 6) Routine logging behavior
-- ---------------------------------------------------------------------------
SELECT
  rl.user_id,
  u.email,
  rl.activity_type,
  COUNT(*) AS activity_count,
  MAX(rl.date_logged) AS latest_log_date
FROM routine_logs rl
JOIN users u ON u.user_id = rl.user_id
GROUP BY rl.user_id, u.email, rl.activity_type
ORDER BY latest_log_date DESC;

-- ---------------------------------------------------------------------------
-- 7) Consultations + billing behavior
-- ---------------------------------------------------------------------------
SELECT
  consultation_id,
  user_id,
  specialist_user_id,
  status,
  created_at
FROM consultations
ORDER BY created_at DESC;

SELECT
  us.subscription_id,
  us.user_id,
  sp.name AS plan_name,
  us.status,
  us.starts_at,
  us.ends_at
FROM user_subscriptions us
JOIN subscription_plans sp ON sp.plan_id = us.plan_id
ORDER BY us.starts_at DESC;

SELECT
  pt.payment_id,
  pt.user_id,
  pt.amount_php,
  pt.status,
  pt.method,
  pt.created_at
FROM payment_transactions pt
ORDER BY pt.created_at DESC;

-- ---------------------------------------------------------------------------
-- 8) Data integrity checks (should return 0 rows)
-- ---------------------------------------------------------------------------
-- Recommendations pointing to missing users/products
SELECT rec.rec_id
FROM recommendations rec
LEFT JOIN users u ON u.user_id = rec.user_id
LEFT JOIN products p ON p.product_id = rec.product_id
WHERE u.user_id IS NULL OR p.product_id IS NULL;

-- Assessments without responses (may be valid right after assessment creation)
SELECT ha.assessment_id, ha.user_id, ha.date_taken
FROM hair_assessment ha
LEFT JOIN assessment_responses ar ON ar.assessment_id = ha.assessment_id
WHERE ar.response_id IS NULL
ORDER BY ha.date_taken DESC;
