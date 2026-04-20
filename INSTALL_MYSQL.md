# How to Install MySQL on Windows

## Option 1: MySQL Installer (Recommended)

### Step 1: Download MySQL Installer
1. Go to: https://dev.mysql.com/downloads/installer/
2. Download **MySQL Installer for Windows** (the larger file, ~400MB)
   - Choose: `mysql-installer-community-8.x.x.x.msi`
   - Or use the web installer (smaller download, downloads during install)

### Step 2: Install MySQL
1. Run the installer
2. Choose **"Developer Default"** or **"Server only"**
3. Click **"Execute"** to install required components
4. Click **"Next"** through configuration
5. **Set root password** - Remember this password! You'll need it.
6. Click **"Execute"** to finish installation
7. Click **"Finish"**

### Step 3: Verify Installation
Open a **NEW** Command Prompt and run:
```bash
mysql --version
```

Should show: `mysql Ver 8.x.x`

### Step 4: Start MySQL Service
```bash
net start MySQL80
```

Or use Windows Services:
- Press `Win + R`
- Type `services.msc`
- Find "MySQL80"
- Right-click → Start

## Option 2: XAMPP (Easier Alternative)

XAMPP includes MySQL + phpMyAdmin (web interface):

1. Download: https://www.apachefriends.org/download.html
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start **MySQL** service
5. MySQL will be available at `localhost:3306`
6. Default: username `root`, password is empty (blank)

**Note:** With XAMPP, MySQL path is usually:
`C:\xampp\mysql\bin\mysql.exe`

## Option 3: MySQL via Docker (Advanced)

If you have Docker installed:
```bash
docker run --name hairvelous-mysql -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=hairvelous -p 3306:3306 -d mysql:8.0
```

## After Installation

### Add MySQL to PATH (if needed)

If `mysql --version` still doesn't work:

1. Find MySQL installation folder (usually):
   - `C:\Program Files\MySQL\MySQL Server 8.0\bin`
   - Or `C:\xampp\mysql\bin` (if using XAMPP)

2. Add to PATH:
   - Right-click "This PC" → Properties
   - Advanced System Settings → Environment Variables
   - Under "System Variables", find "Path" → Edit
   - Click "New" → Add MySQL bin folder path
   - Click OK on all windows
   - **Restart Command Prompt**

3. Test again:
   ```bash
   mysql --version
   ```

## Quick Setup After MySQL is Installed

1. **Start MySQL:**
   ```bash
   net start MySQL80
   ```

2. **Run database setup:**
   ```bash
   cd C:\Users\AMD\Desktop\elai
   mysql -u root -p < database\schema_hairvelous.sql
   ```
   (Enter your MySQL root password)

3. **Update .env:**
   ```env
   DB_PASSWORD=your_mysql_root_password
   ```

4. **Start server:**
   ```bash
   cd backend
   npm start
   ```

## Troubleshooting

**"MySQL80 service not found"**
- Service name might be different (check Services)
- Try: `net start MySQL` or `net start MySQL57`

**"Access denied"**
- Check root password
- Try: `mysql -u root -p` and enter password

**"Port 3306 already in use"**
- Another MySQL instance is running
- Stop other MySQL services or change port

## Need Help?

- MySQL Documentation: https://dev.mysql.com/doc/
- XAMPP Guide: https://www.apachefriends.org/docs/
