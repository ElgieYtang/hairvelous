/**
 * PayMongo webhooks. Register the same URL for:
 * - `checkout_session.payment.paid` (hosted checkout redirect flow)
 * - `payment.paid` (QR Ph / Payment Intent flow)
 *
 * Use HTTPS in production; locally use ngrok → https://xxx.ngrok.io/api/webhooks/paymongo
 */
const consultationService = require('../services/consultationService');
const paymongoService = require('../services/paymongoService');

function paidAmountCentavosFromCheckoutAttributes(attrs) {
  if (!attrs || typeof attrs !== 'object') return null;
  const payments = attrs.payments;
  if (Array.isArray(payments) && payments[0] && payments[0].attributes && payments[0].attributes.amount != null) {
    return Number(payments[0].attributes.amount);
  }
  const piAmt = attrs.payment_intent && attrs.payment_intent.attributes && attrs.payment_intent.attributes.amount;
  if (piAmt != null) return Number(piAmt);
  let total = 0;
  for (const li of attrs.line_items || []) {
    total += Number(li.amount || 0) * Number(li.quantity || 1);
  }
  return total > 0 ? total : null;
}

async function handleCheckoutSessionPaid(payload, res) {
  const checkoutResource = payload?.data?.attributes?.data;
  const sessionId = checkoutResource?.id || null;
  if (!sessionId) {
    return res.status(200).json({ received: true });
  }

  let attrs;
  try {
    if (!paymongoService.isConfigured()) {
      console.warn('PayMongo webhook received but PAYMONGO_SECRET_KEY is not set');
      return res.status(200).json({ received: true });
    }
    const live = await paymongoService.retrieveCheckoutSession(sessionId);
    attrs = live && live.attributes;
  } catch (err) {
    console.error('PayMongo retrieve checkout session:', err.message || err);
    return res.status(200).json({ received: true });
  }

  const paymentPaid =
    Array.isArray(attrs.payments) &&
    attrs.payments[0] &&
    attrs.payments[0].attributes &&
    attrs.payments[0].attributes.status === 'paid';
  const intentSucceeded =
    attrs.payment_intent &&
    attrs.payment_intent.attributes &&
    attrs.payment_intent.attributes.status === 'succeeded';
  if (!paymentPaid && !intentSucceeded) {
    return res.status(200).json({ received: true });
  }

  const meta = attrs.metadata || {};
  const consultationId = Number(meta.consultation_id);
  if (!Number.isFinite(consultationId) || consultationId <= 0) {
    console.warn('PayMongo webhook: missing consultation_id in session metadata');
    return res.status(200).json({ received: true });
  }

  const paidCentavos = paidAmountCentavosFromCheckoutAttributes(attrs);

  try {
    await consultationService.markPaidViaPayMongo(consultationId, {
      checkoutSessionId: sessionId,
      paidAmountCentavos: paidCentavos,
      metadataUserId: meta.user_id != null ? Number(meta.user_id) : null,
    });
  } catch (err) {
    console.error('PayMongo webhook apply payment (checkout):', err.message || err);
  }

  return res.status(200).json({ received: true });
}

async function handlePaymentPaid(payload, res) {
  try {
    if (!paymongoService.isConfigured()) {
      return res.status(200).json({ received: true });
    }
    const payRes = payload?.data?.attributes?.data;
    if (!payRes || payRes.type !== 'payment') {
      return res.status(200).json({ received: true });
    }
    const paymentAttrs = payRes.attributes || {};
    const paymentIntentId = paymentAttrs.payment_intent_id;
    if (!paymentIntentId) {
      return res.status(200).json({ received: true });
    }

    const live = await paymongoService.retrievePaymentIntent(paymentIntentId);
    const la = live.attributes || {};
    if (la.status !== 'succeeded') {
      return res.status(200).json({ received: true });
    }

    const meta = la.metadata || {};
    const consultationId = Number(meta.consultation_id);
    if (!Number.isFinite(consultationId) || consultationId <= 0) {
      return res.status(200).json({ received: true });
    }

    const amount = la.amount != null ? Number(la.amount) : null;

    await consultationService.markPaidViaPayMongo(consultationId, {
      paymentIntentId,
      paidAmountCentavos: amount,
      metadataUserId: meta.user_id != null ? Number(meta.user_id) : null,
    });
  } catch (err) {
    console.error('PayMongo webhook payment.paid:', err.message || err);
  }
  return res.status(200).json({ received: true });
}

exports.handle = async (req, res) => {
  const raw = req.body;
  const str = Buffer.isBuffer(raw) ? raw.toString('utf8') : typeof raw === 'string' ? raw : '';

  const webhookSecret = paymongoService.getWebhookSecret();
  const sigHeader = req.headers['paymongo-signature'] || req.headers['Paymongo-Signature'];
  if (webhookSecret) {
    if (!sigHeader) {
      return res.status(401).json({ error: 'Missing Paymongo-Signature header' });
    }
    if (!paymongoService.verifyWebhookSignature(raw, sigHeader, webhookSecret)) {
      return res.status(403).json({ error: 'Invalid webhook signature' });
    }
  }

  let payload;
  try {
    payload = str ? JSON.parse(str) : {};
  } catch (e) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const eventType = payload?.data?.attributes?.type;

  if (eventType === 'checkout_session.payment.paid') {
    return handleCheckoutSessionPaid(payload, res);
  }
  if (eventType === 'payment.paid') {
    return handlePaymentPaid(payload, res);
  }

  return res.status(200).json({ received: true });
};
