const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

async function run() {
  const opts = { ...getMysqlConnectionOptions(), multipleStatements: true };
  const dbName = opts.database;
  const conn = await mysql.createConnection(opts);

  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS hair_assessment (
        assessment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_date_taken (date_taken),
        CONSTRAINT fk_assessment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS assessment_responses (
        response_id INT PRIMARY KEY AUTO_INCREMENT,
        assessment_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        INDEX idx_assessment_id (assessment_id),
        CONSTRAINT fk_response_assessment FOREIGN KEY (assessment_id) REFERENCES hair_assessment(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log(`hair_assessment + assessment_responses ensured in ${dbName}.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Fix failed:', err.message || err);
  process.exit(1);
});
