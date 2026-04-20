/**
 * One-time / idempotent: add supermarket-style PH hair products (Sunsilk, TRESemmé, etc.)
 * and ensure product_categories rows for recommendations + UI filters.
 *
 * Usage: node scripts/seed-retail-brands-ph.js
 */
const pool = require('../config/db');

const DEMO_CATEGORY_BACKFILL = [
  [1, 'anti-dandruff'],
  [2, 'anti-dandruff'],
  [3, 'moisturizing'],
  [4, 'moisturizing'],
  [5, 'anti-frizz'],
  [6, 'anti-frizz'],
  [7, 'clarifying/oily scalp'],
  [8, 'clarifying/oily scalp'],
];

const RETAIL_PRODUCTS = [
  {
    name: 'Anti-Dandruff Shampoo',
    brand: 'Sunsilk',
    description: 'Everyday anti-dandruff care with fresh scent. For awareness only—not a medical treatment.',
    price: 189.0,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Smooth & Manageable Conditioner',
    brand: 'Sunsilk',
    description: 'Helps soften and detangle; pairs with Sunsilk shampoos.',
    price: 189.0,
    categories: ['moisturizing'],
  },
  {
    name: 'Keratin Smooth Shampoo',
    brand: 'TRESemmé',
    description: 'Keratin-smooth system for frizz-prone hair.',
    price: 279.0,
    categories: ['anti-frizz'],
  },
  {
    name: 'Keratin Smooth Conditioner',
    brand: 'TRESemmé',
    description: 'Conditioner for smoother-feeling hair when used as a system.',
    price: 279.0,
    categories: ['anti-frizz'],
  },
  {
    name: 'Hair Fall Rescue Shampoo',
    brand: 'Dove',
    description: 'Gentle cleansing; marketed for breakage-prone hair (cosmetic care only).',
    price: 220.0,
    categories: ['moisturizing'],
  },
  {
    name: 'Triple Keratin Rescue Ultra Conditioner',
    brand: 'Cream Silk',
    description: 'Rinse-out conditioner for dry, damaged-looking hair.',
    price: 199.0,
    categories: ['moisturizing'],
  },
  {
    name: 'Pro-V Total Damage Care Shampoo',
    brand: 'Pantene',
    description: 'Daily shampoo for rough-feeling, damaged-looking hair.',
    price: 249.0,
    categories: ['moisturizing'],
  },
  {
    name: 'Cool Menthol Anti-Dandruff Shampoo',
    brand: 'Head & Shoulders',
    description: 'Anti-dandruff shampoo with menthol freshness (cosmetic scalp care).',
    price: 320.0,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Complete Soft Care Anti-Dandruff Shampoo',
    brand: 'Clear',
    description: 'Anti-dandruff cleansing for scalp comfort (non-medical).',
    price: 210.0,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Ice Salicylic Acid Anti-Dandruff Shampoo',
    brand: 'Selsun Blue',
    description: 'Pharmacy-style anti-dandruff positioning; use as directed on pack.',
    price: 395.0,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Gugo Strengthening Shampoo',
    brand: 'Zenutrients',
    description: 'Local PH brand with gugo extract; mild herbal cleanse.',
    price: 349.0,
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Moisturizing Shampoo with Argan Oil',
    brand: 'Moringa-O2',
    description: 'Herbal-infused shampoo with argan oil for dry-feeling hair.',
    price: 299.0,
    categories: ['moisturizing'],
  },
];

async function ensureCategoryRow(productId, categoryName) {
  const [existing] = await pool.query(
    'SELECT category_id FROM product_categories WHERE product_id = ? AND category_name = ?',
    [productId, categoryName]
  );
  if (existing.length) return;
  await pool.query('INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)', [
    productId,
    categoryName,
  ]);
}

async function run() {
  await pool.query(`
    ALTER TABLE products
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL,
      ADD COLUMN IF NOT EXISTS expiry_type ENUM('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable',
      ADD COLUMN IF NOT EXISTS expiry_date DATE NULL,
      ADD COLUMN IF NOT EXISTS expiry_period_months INT NULL
  `).catch(() => {});

  for (const [productId, categoryName] of DEMO_CATEGORY_BACKFILL) {
    await ensureCategoryRow(productId, categoryName);
  }

  let added = 0;
  for (const p of RETAIL_PRODUCTS) {
    const [rows] = await pool.query(
      'SELECT product_id FROM products WHERE name = ? AND brand = ?',
      [p.name, p.brand]
    );
    let productId;
    if (rows.length) {
      productId = rows[0].product_id;
    } else {
      const [ins] = await pool.query(
        'INSERT INTO products (name, brand, description, price) VALUES (?, ?, ?, ?)',
        [p.name, p.brand, p.description, p.price]
      );
      productId = ins.insertId;
      added += 1;
    }
    for (const c of p.categories) {
      await ensureCategoryRow(productId, c);
    }
  }

  const [[{ n }]] = await pool.query('SELECT COUNT(*) AS n FROM products');
  const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM product_categories');
  console.log(`Done. products=${n}, product_categories=${c}, new retail rows inserted=${added}`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => pool.end());
