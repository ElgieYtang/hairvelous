const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const opts = { ...getMysqlConnectionOptions(), multipleStatements: true };
  const dbName = opts.database;
  const conn = await mysql.createConnection(opts);

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS hair_photos (
        photo_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        image_path VARCHAR(500) NOT NULL,
        ai_result TEXT NULL,
        date_uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_date_uploaded (date_uploaded),
        CONSTRAINT fk_photo_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log(`hair_photos table ensured in ${dbName}.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Fix failed:', err.message || err);
  process.exit(1);
});
