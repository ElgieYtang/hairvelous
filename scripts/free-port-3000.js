const { execSync } = require('child_process');

function run(command) {
  return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
}

function killPort3000Windows() {
  let output = '';
  try {
    output = run('netstat -ano -p tcp');
  } catch (_err) {
    return;
  }

  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Example: TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
    if (!trimmed.includes(':3000')) continue;
    if (!/\bLISTENING\b/i.test(trimmed)) continue;
    const parts = trimmed.split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
      // eslint-disable-next-line no-console
      console.log(`[prestart] Killed PID ${pid} on port 3000`);
    } catch (_err) {
      // ignore
    }
  }
}

function killPort3000Unix() {
  try {
    execSync('lsof -ti tcp:3000 | xargs -r kill -9', { stdio: 'ignore' });
    // eslint-disable-next-line no-console
    console.log('[prestart] Cleared port 3000');
  } catch (_err) {
    // ignore
  }
}

function main() {
  if (process.platform === 'win32') {
    killPort3000Windows();
    return;
  }
  killPort3000Unix();
}

main();
