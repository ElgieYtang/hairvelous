# Manual Database Setup (Without MySQL Command Line)

If MySQL command line isn't working, use MySQL Workbench or phpMyAdmin:

## Method 1: MySQL Workbench (GUI)

### Step 1: Download MySQL Workbench
- Download from: https://dev.mysql.com/downloads/workbench/
- Install it

### Step 2: Connect to MySQL
1. Open MySQL Workbench
2. Click on "Local instance MySQL80" (or create new connection)
3. Enter root password
4. Click "OK"

### Step 3: Run Schema
1. File → Open SQL Script
2. Navigate to: `C:\Users\AMD\Desktop\elai\database\schema_hairvelous.sql`
3. Click "Open"
4. Click "Execute" button (⚡) or press `Ctrl+Shift+Enter`
5. Wait for "Script executed successfully"

### Step 4: Verify
In Workbench, run:
```sql
USE hairvelous;
SHOW TABLES;
SELECT * FROM roles;
```

## Method 2: phpMyAdmin (If using XAMPP)

### Step 1: Start XAMPP
- Open XAMPP Control Panel
- Start Apache and MySQL

### Step 2: Open phpMyAdmin
- Go to: http://localhost/phpmyadmin
- Username: `root`
- Password: (leave blank if default)

### Step 3: Create Database
1. Click "New" in left sidebar
2. Database name: `hairvelous`
3. Collation: `utf8mb4_unicode_ci`
4. Click "Create"

### Step 4: Import Schema
1. Click on `hairvelous` database
2. Click "Import" tab
3. Click "Choose File"
4. Select: `C:\Users\AMD\Desktop\elai\database\schema_hairvelous.sql`
5. Click "Go" at bottom
6. Wait for success message

## Method 3: Using Node.js Script

Create a file `setup_db_via_node.js` in project root:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'database', 'schema_hairvelous.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

setupDatabase();
```

Run it:
```bash
cd backend
node ../setup_db_via_node.js
```
