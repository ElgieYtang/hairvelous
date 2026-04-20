/**
 * Bootstrap local MySQL database after fresh XAMPP install.
 * Recreates base schema + applies project migrations.
 *
 * Usage:
 *   node scripts/bootstrap-db.js
 */
const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');
const { getMysqlConnectionOptions } = require('../config/dbEnv');

const mysqlOpts = getMysqlConnectionOptions();
const database = mysqlOpts.database;

const dbRoot = path.join(__dirname, '..', '..', 'database');
const schemaFile = path.join(dbRoot, 'schema_hairvelous.sql');
const migrations = [
  'migration_user_profiles.sql',
  'migration_products_compat.sql',
  'migration_consultations.sql',
  'migration_billing.sql',
  'migration_routine_logs_media.sql',
  'migration_add_google_oauth_final.sql',
  'migration_add_diy_guides_fields.sql',
  'migration_recommendations.sql',
  'migration_diy_guides_table.sql',
];

async function readSql(filePath) {
  return fs.readFile(filePath, 'utf8');
}

function shouldIgnoreMigrationError(err) {
  const msg = String(err && err.message ? err.message : err).toLowerCase();
  return (
    msg.includes('duplicate column name') ||
    msg.includes('duplicate key name') ||
    msg.includes('already exists') ||
    msg.includes('duplicate entry')
  );
}

function retargetDatabaseName(sqlText) {
  return String(sqlText)
    .replace(/USE\s+`?hairvelous`?\s*;/gi, `USE \`${database}\`;`)
    .replace(/TABLE_SCHEMA\s*=\s*'hairvelous'/gi, `TABLE_SCHEMA = '${database}'`);
}

async function run() {
  console.log(`Connecting to MySQL at ${mysqlOpts.host}:${mysqlOpts.port} as ${mysqlOpts.user}...`);
  const conn = await mysql.createConnection({
    ...getMysqlConnectionOptions({ omitDatabase: true }),
    multipleStatements: true,
  });

  try {
    console.log(`Applying base schema from ${path.basename(schemaFile)}...`);
    let schemaSql = await readSql(schemaFile);
    // Make bootstrap resilient if default schema file hardcodes `hairvelous`.
    schemaSql = schemaSql
      .replace(/CREATE DATABASE IF NOT EXISTS\s+`?hairvelous`?\s*;/i, `CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    schemaSql = retargetDatabaseName(schemaSql);
    await conn.query(schemaSql);
    console.log('Base schema applied.');

    await conn.query(`USE \`${database}\``);

    for (const file of migrations) {
      const filePath = path.join(dbRoot, file);
      try {
        const sql = retargetDatabaseName(await readSql(filePath));
        await conn.query(sql);
        console.log(`Migration applied: ${file}`);
      } catch (err) {
        if (shouldIgnoreMigrationError(err)) {
          console.log(`Migration skipped (already applied): ${file}`);
          continue;
        }
        throw err;
      }
    }

    const [rows] = await conn.query('SHOW TABLES');
    console.log(`Done. ${rows.length} tables currently exist in \`${database}\`.`);
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Bootstrap failed:', err.message || err);
  process.exit(1);
});
