/**
 * PayMongo Checkout API (https://developers.paymongo.com/docs/checkout-api)
 * Uses secret key + Basic auth. Amounts are in centavos (₱499.00 → 49900).
 */
const crypto = require('crypto');
const PAYMONGO_API = 'https://api.paymongo.com/v1';

function getSecretKey() {
  return process.env.PAYMONGO_SECRET_KEY && String(process.env.PAYMONGO_SECRET_KEY).trim();
}

function isConfigured() {
  return !!getSecretKey();
}

function getWebhookSecret() {
  return process.env.PAYMONGO_WEBHOOK_SECRET && String(process.env.PAYMONGO_WEBHOOK_SECRET).trim();
}

/**
 * Verifies `Paymongo-Signature` the same way as paymongo-node WebhookService.constructEvent:
 * HMAC-SHA256(webhook_secret, timestamp + '.' + raw_json_body) as hex, compared to test or live segment.
 * @param {Buffer|string} rawBody
 * @param {string} signatureHeader
 * @param {string} webhookSecretKey From Dashboard → Webhook → Show secret (not PAYMONGO_SECRET_KEY)
 */
function verifyWebhookSignature(rawBody, signatureHeader, webhookSecretKey) {
  if (!webhookSecretKey || !signatureHeader) return false;
  const payload = Buffer.isBuffer(rawBody) ? rawBody.toString('utf8') : String(rawBody);
  const arrSignature = signatureHeader.split(',');
  if (arrSignature.length < 3) return false;

  const timestamp = arrSignature[0].split('=')[1];
  const testModeSignature = arrSignature[1].split('=')[1];
  const liveModeSignature = arrSignature[2].split('=')[1];
  let comparisonSignature = '';

  if (testModeSignature !== '') {
    comparisonSignature = testModeSignature;
  }
  if (liveModeSignature !== '') {
    comparisonSignature = liveModeSignature;
  }

  if (!timestamp || comparisonSignature === '') return false;

  const hmacData = crypto
    .createHmac('sha256', webhookSecretKey)
    .update(timestamp + '.' + payload)
    .digest('hex');

  if (hmacData.length !== comparisonSignature.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(hmacData, 'hex'), Buffer.from(comparisonSignature, 'hex'));
  } catch {
    return false;
  }
}

function authHeader() {
  const sk = getSecretKey();
  if (!sk) throw new Error('PAYMONGO_SECRET_KEY is not set');
  const token = Buffer.from(`${sk}:`).toString('base64');
  return `Basic ${token}`;
}

/**
 * @returns {string[]} e.g. ['gcash','card','paymaya']
 */
function getPaymentMethodTypes() {
  const raw = process.env.PAYMONGO_PAYMENT_METHODS || 'gcash,card,paymaya';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * @param {object} params
 * @param {Array<{ amount: number, currency: string, name: string, quantity: number, description?: string }>} params.line_items
 * @param {string[]} params.payment_method_types
 * @param {string} params.success_url
 * @param {string} params.cancel_url
 * @param {string} [params.description]
 * @param {string} [params.reference_number]
 * @param {Record<string, string>} [params.metadata] string values only
 */
async function createCheckoutSession(params) {
  const body = {
    data: {
      attributes: {
        line_items: params.line_items,
        payment_method_types: params.payment_method_types || getPaymentMethodTypes(),
        success_url: params.success_url,
        cancel_url: params.cancel_url,
        description: params.description || 'Hairvelous payment',
        send_email_receipt: params.send_email_receipt === true,
        metadata: params.metadata || {},
      },
    },
  };
  if (params.reference_number) {
    body.data.attributes.reference_number = String(params.reference_number).slice(0, 255);
  }

  const res = await fetch(`${PAYMONGO_API}/checkout_sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      json.errors && json.errors[0]
        ? json.errors.map((e) => e.detail || e.title || '').filter(Boolean).join(' — ')
        : json.message || `PayMongo HTTP ${res.status}`;
    const err = new Error(detail || 'PayMongo request failed');
    err.status = res.status;
    throw err;
  }
  return json.data;
}

/**
 * Confirms checkout session state from PayMongo (use after webhook to avoid forged POSTs).
 */
async function retrieveCheckoutSession(sessionId) {
  const id = String(sessionId || '').trim();
  if (!id) throw new Error('Missing checkout session id');
  const res = await fetch(`${PAYMONGO_API}/checkout_sessions/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Authorization: authHeader(),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      json.errors && json.errors[0]
        ? json.errors.map((e) => e.detail || e.title || '').filter(Boolean).join(' — ')
        : `PayMongo HTTP ${res.status}`;
    const err = new Error(detail || 'Retrieve checkout failed');
    err.status = res.status;
    throw err;
  }
  return json.data;
}

/**
 * QR Ph scan-to-pay (https://developers.paymongo.com/docs/qr-ph-api).
 * Amount in centavos; PayMongo minimum is typically ₱20 (2000).
 */
async function createPaymentIntentQrPh(params) {
  const body = {
    data: {
      attributes: {
        amount: params.amount,
        currency: 'PHP',
        payment_method_allowed: ['qrph'],
        description: params.description || 'Hairvelous payment',
        capture_type: 'automatic',
        metadata: params.metadata || {},
      },
    },
  };
  return paymongoPost('/payment_intents', body);
}

async function createQrPhPaymentMethod(billing) {
  const body = {
    data: {
      attributes: {
        type: 'qrph',
        billing: {
          name: billing.name || 'Customer',
          email: billing.email || 'customer@example.com',
          phone: billing.phone || '',
          address: {
            line1: billing.line1 || 'N/A',
            line2: '',
            city: billing.city || '',
            state: billing.state || '',
            postal_code: billing.postal_code || '',
            country: billing.country || 'PH',
          },
        },
      },
    },
  };
  return paymongoPost('/payment_methods', body);
}

/**
 * @returns PayMongo `data` object for the updated PaymentIntent (includes next_action.code.image_url).
 */
async function attachPaymentMethodToIntent(paymentIntentId, paymentMethodId) {
  const id = String(paymentIntentId || '').trim();
  const body = {
    data: {
      attributes: {
        payment_method: String(paymentMethodId || '').trim(),
      },
    },
  };
  return paymongoPost(`/payment_intents/${encodeURIComponent(id)}/attach`, body);
}

async function retrievePaymentIntent(paymentIntentId) {
  const id = String(paymentIntentId || '').trim();
  if (!id) throw new Error('Missing payment intent id');
  const res = await fetch(`${PAYMONGO_API}/payment_intents/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      Authorization: authHeader(),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      json.errors && json.errors[0]
        ? json.errors.map((e) => e.detail || e.title || '').filter(Boolean).join(' — ')
        : `PayMongo HTTP ${res.status}`;
    const err = new Error(detail || 'Retrieve payment intent failed');
    err.status = res.status;
    throw err;
  }
  return json.data;
}

/**
 * Register a webhook (Dashboard or POST /v1/webhooks). Response includes `attributes.secret_key` (whsk_...).
 * @param {{ url: string, events: string[] }} params
 */
async function createWebhook(params) {
  const body = {
    data: {
      attributes: {
        url: params.url,
        events: params.events,
      },
    },
  };
  return paymongoPost('/webhooks', body);
}

async function listWebhooks() {
  const res = await fetch(`${PAYMONGO_API}/webhooks`, {
    method: 'GET',
    headers: {
      Authorization: authHeader(),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      json.errors && json.errors[0]
        ? json.errors.map((e) => e.detail || e.title || '').filter(Boolean).join(' — ')
        : `PayMongo HTTP ${res.status}`;
    const err = new Error(detail || 'List webhooks failed');
    err.status = res.status;
    throw err;
  }
  return Array.isArray(json.data) ? json.data : [];
}

async function paymongoPost(path, body) {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail =
      json.errors && json.errors[0]
        ? json.errors.map((e) => e.detail || e.title || '').filter(Boolean).join(' — ')
        : json.message || `PayMongo HTTP ${res.status}`;
    const err = new Error(detail || 'PayMongo request failed');
    err.status = res.status;
    throw err;
  }
  return json.data;
}

module.exports = {
  isConfigured,
  getWebhookSecret,
  verifyWebhookSignature,
  getPaymentMethodTypes,
  createCheckoutSession,
  retrieveCheckoutSession,
  createPaymentIntentQrPh,
  createQrPhPaymentMethod,
  attachPaymentMethodToIntent,
  retrievePaymentIntent,
  createWebhook,
  listWebhooks,
};
