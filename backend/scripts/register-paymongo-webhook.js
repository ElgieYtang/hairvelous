/**
 * Creates a PayMongo webhook via API and prints the signing secret for PAYMONGO_WEBHOOK_SECRET.
 *
 * Usage (from backend/):
 *   npm run paymongo:webhook
 *
 * For a public HTTPS tunnel (recommended — PayMongo may reject non-public URLs):
 *   set WEBHOOK_PUBLIC_BASE=https://xxxx.ngrok-free.app   (PowerShell: $env:WEBHOOK_PUBLIC_BASE="...")
 *   npm run paymongo:webhook
 *
 * Re-running creates another webhook; delete duplicates in Dashboard if needed.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const path = require('path');
const paymongo = require(path.join(__dirname, '..', 'services', 'paymongoService'));

const EVENTS = ['checkout_session.payment.paid', 'payment.paid'];

async function main() {
  if (!paymongo.isConfigured()) {
    console.error('Set PAYMONGO_SECRET_KEY in backend/.env first.');
    process.exit(1);
  }

  const port = process.env.PORT || 3000;
  const baseFromEnv = process.env.WEBHOOK_PUBLIC_BASE || process.env.APP_PUBLIC_URL || `http://localhost:${port}`;
  const base = String(baseFromEnv).replace(/\/+$/, '');
  const webhookUrl = `${base}/api/webhooks/paymongo`;

  console.log('Public base:', base);
  console.log('Registering webhook URL:', webhookUrl);
  console.log('Events:', EVENTS.join(', '));
  if (base.startsWith('http://localhost') || base.startsWith('http://127.')) {
    console.warn(
      'Note: PayMongo often requires a public HTTPS URL. If this fails, start a tunnel (e.g. ngrok), set WEBHOOK_PUBLIC_BASE to the https URL, and run again.\n'
    );
  }

  try {
    const data = await paymongo.createWebhook({ url: webhookUrl, events: EVENTS });
    const attrs = data.attributes || {};
    const secret = attrs.secret_key;
    console.log('\nSuccess. Webhook id:', data.id);
    if (secret) {
      console.log('\nAdd this line to backend/.env (then restart the server):\n');
      console.log(`PAYMONGO_WEBHOOK_SECRET=${secret}\n`);
    } else {
      console.log('\nNo secret_key in API response. Open PayMongo → Settings → Webhooks → your endpoint → Show secret.\n');
    }
  } catch (err) {
    console.error('Error:', err.message || err);
    if (String(err.message || '').includes('url')) {
      console.error('Try WEBHOOK_PUBLIC_BASE=https://your-tunnel.example/api origin only, no path.');
    }
    process.exit(1);
  }
}

main();
