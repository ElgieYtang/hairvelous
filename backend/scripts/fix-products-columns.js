const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const conn = await mysql.createConnection(getMysqlConnectionOptions());

  try {
    await conn.query(`
      ALTER TABLE products
        ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL,
        ADD COLUMN IF NOT EXISTS expiry_type ENUM('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable',
        ADD COLUMN IF NOT EXISTS expiry_date DATE NULL,
        ADD COLUMN IF NOT EXISTS expiry_period_months INT NULL
    `);
    console.log('products columns are now up to date.');
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Fix failed:', err.message || err);
  process.exit(1);
});
