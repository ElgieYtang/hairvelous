/**
 * Pro-only access for client consultation features.
 * Staff (admin, specialist, seller) always pass; normal users need an active Pro subscription.
 */
const billingService = require('../services/billingService');

async function requireConsultationAccess(req, res, next) {
  if (String(process.env.SKIP_DB_FOR_TESTING || '').trim() === 'true') {
    return next();
  }
  try {
    const role = req.user && req.user.roleName;
    if (role === 'admin' || role === 'specialist' || role === 'seller') return next();
    const st = await billingService.getStatus(req.user.userId);
    if (st.isPro) return next();
    return res.status(403).json({
      error: 'Consultations require a Pro subscription.',
      message: 'Upgrade on the Pricing page to book specialists and use consultation chat.',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = requireConsultationAccess;
