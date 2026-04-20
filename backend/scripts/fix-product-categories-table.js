const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const opts = { ...getMysqlConnectionOptions(), multipleStatements: true };
  const dbName = opts.database;
  const conn = await mysql.createConnection(opts);

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        category_name VARCHAR(120) NOT NULL,
        INDEX idx_product_id (product_id),
        INDEX idx_category_name (category_name),
        CONSTRAINT fk_product_category_product
          FOREIGN KEY (product_id) REFERENCES products(product_id)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log(`product_categories table ensured in ${dbName}.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Fix failed:', err.message || err);
  process.exit(1);
});
