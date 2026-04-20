const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');

const backendDir = path.join(__dirname, '..');
const rootDir = path.join(backendDir, '..');
const envExamplePath = path.join(backendDir, '.env.example');
const envPath = path.join(backendDir, '.env');
const uploadsDir = path.join(rootDir, 'uploads');

function runBootstrap() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, 'bootstrap-db.js')], {
      cwd: backendDir,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Database bootstrap failed with exit code ${code}`));
    });
  });
}

async function ensureEnvFile() {
  try {
    await fs.access(envPath);
    console.log('Found backend/.env');
  } catch (_) {
    await fs.copyFile(envExamplePath, envPath);
    console.log('Created backend/.env from backend/.env.example');
    console.log('Update backend/.env with your local secrets before production use.');
  }
}

async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir, { recursive: true });
  console.log('Ensured uploads directory exists');
}

async function run() {
  await ensureEnvFile();
  await ensureUploadsDir();
  await runBootstrap();
  console.log('Local setup complete. You can now run: npm run dev');
}

run().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
