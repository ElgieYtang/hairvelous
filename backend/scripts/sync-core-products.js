/**
 * Sync required product catalog for recommendations (idempotent, non-destructive).
 *
 * Usage:
 *   node scripts/sync-core-products.js
 */
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const mysqlOpts = getMysqlConnectionOptions();
const database = mysqlOpts.database;

const coreProducts = [
  {
    name: 'Scalp Relief Shampoo',
    brand: 'HairCare Pro',
    description: 'Helps reduce visible flaking and soothe itchy scalp for routine care.',
    price: 12.99,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Anti-Dandruff Treatment Serum',
    brand: 'ScalpFix',
    description: 'Targeted serum for flakes and scalp buildup between wash days.',
    price: 18.5,
    categories: ['anti-dandruff'],
  },
  {
    name: 'Deep Moisture Hair Mask',
    brand: 'HydrateCo',
    description: 'Intensive hydration support for dry, brittle, and rough-feeling hair.',
    price: 14.99,
    categories: ['moisturizing'],
  },
  {
    name: 'Daily Moisturizing Conditioner',
    brand: 'HairCare Pro',
    description: 'Lightweight conditioner that restores moisture without heavy residue.',
    price: 9.99,
    categories: ['moisturizing'],
  },
  {
    name: 'Frizz Control Oil',
    brand: 'SmoothLock',
    description: 'Light finishing oil to reduce frizz and improve shine.',
    price: 16.0,
    categories: ['anti-frizz'],
  },
  {
    name: 'Anti-Frizz Smoothing Serum',
    brand: 'HairCare Pro',
    description: 'Smoothing serum with humidity defense for flyaways and frizz.',
    price: 13.5,
    categories: ['anti-frizz'],
  },
  {
    name: 'Clarifying Shampoo',
    brand: 'PureScalp',
    description: 'Weekly clarifying wash for oily scalp and product buildup.',
    price: 11.99,
    categories: ['clarifying/oily scalp'],
  },
  {
    name: 'Oil-Control Scalp Tonic',
    brand: 'PureScalp',
    description: 'Balancing scalp tonic for excess oil and heavy roots.',
    price: 15.0,
    categories: ['clarifying/oily scalp'],
  },
];

async function ensureProduct(conn, product) {
  const [rows] = await conn.query(
    'SELECT product_id FROM products WHERE name = ? AND IFNULL(brand, "") = IFNULL(?, "") LIMIT 1',
    [product.name, product.brand]
  );

  if (rows.length > 0) {
    const productId = rows[0].product_id;
    await conn.query(
      `UPDATE products
       SET description = ?, price = ?, expiry_type = 'not_applicable', expiry_date = NULL, expiry_period_months = NULL
       WHERE product_id = ?`,
      [product.description, product.price, productId]
    );
    return { productId, action: 'updated' };
  }

  const [inserted] = await conn.query(
    `INSERT INTO products (name, brand, description, price, expiry_type, expiry_date, expiry_period_months)
     VALUES (?, ?, ?, ?, 'not_applicable', NULL, NULL)`,
    [product.name, product.brand, product.description, product.price]
  );
  return { productId: inserted.insertId, action: 'inserted' };
}

async function syncCategories(conn, productId, categories) {
  await conn.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
  for (const categoryName of categories) {
    await conn.query(
      'INSERT INTO product_categories (product_id, category_name) VALUES (?, ?)',
      [productId, categoryName]
    );
  }
}

async function run() {
  const conn = await mysql.createConnection(mysqlOpts);
  let inserted = 0;
  let updated = 0;
  try {
    await conn.query(`USE \`${database}\``);
    for (const product of coreProducts) {
      const result = await ensureProduct(conn, product);
      if (result.action === 'inserted') inserted += 1;
      if (result.action === 'updated') updated += 1;
      await syncCategories(conn, result.productId, product.categories);
    }

    const [productCountRows] = await conn.query('SELECT COUNT(*) AS c FROM products');
    const [categoryCountRows] = await conn.query('SELECT COUNT(*) AS c FROM product_categories');
    console.log(`Core catalog sync complete. inserted=${inserted}, updated=${updated}`);
    console.log(`products=${productCountRows[0].c}, product_categories=${categoryCountRows[0].c}`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Core product sync failed:', err.message || err);
  process.exit(1);
});
