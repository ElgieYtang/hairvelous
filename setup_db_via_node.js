/**
 * Database Setup via Node.js
 * Alternative method if MySQL command line isn't available
 * 
 * Usage: node setup_db_via_node.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function setupDatabase() {
  console.log('Starting database setup...\n');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true, // Allow multiple SQL statements
  });

  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'database', 'schema_hairvelous.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema...');
    await connection.query(schema);
    
    console.log('\nDatabase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('   1. Verify tables: mysql -u root -p -e "USE hairvelous; SHOW TABLES;"');
    console.log('   2. Start server: cd backend && npm start');
    console.log('   3. Open browser: http://localhost:3000\n');
    
  } catch (error) {
    console.error('\nError setting up database:');
    console.error('   ', error.message);
    console.error('\nTroubleshooting:');
    console.error('   - Check MySQL is running: net start MySQL80');
    console.error('   - Verify .env has correct DB_PASSWORD');
    console.error('   - Try: mysql -u root -p (to test connection)\n');
    process.exit(1);
  } finally {
    await connection.end();
  }
}

setupDatabase();
