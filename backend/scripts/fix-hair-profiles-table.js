const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const opts = { ...getMysqlConnectionOptions(), multipleStatements: true };
  const dbName = opts.database;
  const conn = await mysql.createConnection(opts);

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS hair_profiles (
        profile_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        hair_type VARCHAR(100) NULL,
        scalp_condition VARCHAR(100) NULL,
        issues_detected TEXT NULL,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_last_updated (last_updated),
        CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);
    console.log(`hair_profiles table ensured in ${dbName}.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Fix failed:', err.message || err);
  process.exit(1);
});
