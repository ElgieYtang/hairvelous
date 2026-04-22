/**
 * Express Server
 * Location: backend/server.js
 * Purpose: Main server entry point
 */
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { execFile } = require('child_process');
const { promisify } = require('util');

// Middleware
const errorHandler = require('./middleware/errorHandler');
const { optionalAuth } = require('./middleware/auth');

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const photoRoutes = require('./routes/photoRoutes');
const routineRoutes = require('./routes/routineRoutes');
const productRoutes = require('./routes/productRoutes');
const guideRoutes = require('./routes/guideRoutes');
const adminRoutes = require('./routes/adminRoutes');
const hairAiRoutes = require('./routes/hairAiRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const billingRoutes = require('./routes/billingRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const projectRoot = path.join(__dirname, '..');
const execFileAsync = promisify(execFile);

async function runStartupDbTasksIfEnabled() {
  const autoBootstrap =
    String(process.env.AUTO_BOOTSTRAP_DB_ON_START || 'false')
      .trim()
      .toLowerCase() === 'true';
  const autoSeed =
    String(process.env.AUTO_SEED_DB_ON_START || 'false')
      .trim()
      .toLowerCase() === 'true';

  if (!autoBootstrap && !autoSeed) {
    console.log('[startup-db] skipped (both bootstrap and seed disabled)');
    return;
  }

  if (autoBootstrap) {
    console.log('[startup-db] running bootstrap-db.js ...');
    await execFileAsync(process.execPath, [path.join(__dirname, 'scripts', 'bootstrap-db.js')], {
      cwd: __dirname,
      env: process.env,
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    });
    console.log('[startup-db] bootstrap complete');
  } else {
    console.log('[startup-db] bootstrap skipped');
  }

  if (autoSeed) {
    console.log('[startup-db] running seed-db.js ...');
    await execFileAsync(process.execPath, [path.join(__dirname, 'scripts', 'seed-db.js')], {
      cwd: __dirname,
      env: process.env,
      windowsHide: true,
      maxBuffer: 10 * 1024 * 1024,
    });
    console.log('[startup-db] seed complete');
  } else {
    console.log('[startup-db] seed skipped');
  }
}

// Middleware
app.use(cors({ origin: true, credentials: true }));

/** PayMongo webhooks must receive the raw JSON body (verify with PAYMONGO_WEBHOOK_SECRET + Paymongo-Signature). */
const paymongoWebhookController = require('./controllers/paymongoWebhookController');
app.post(
  '/api/webhooks/paymongo',
  express.raw({ type: 'application/json' }),
  (req, res, next) => paymongoWebhookController.handle(req, res, next)
);

app.use(express.json({ limit: '12mb' }));
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Session for OAuth state management
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * 60 * 1000, // 10 minutes
  },
}));

// Static files
app.use(express.static(path.join(projectRoot, 'public')));
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

// API routes (with optional auth)
app.use('/api', optionalAuth);

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/routine', routineRoutes);
app.use('/api/products', productRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/hair-ai', hairAiRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/notifications', notificationRoutes);

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  if (!req.path.includes('.')) {
    const file = path.join(projectRoot, 'public', req.path === '/' ? 'index.html' : req.path + '.html');
    res.sendFile(file, (err) => {
      if (err) res.status(404).sendFile(path.join(projectRoot, 'public', 'index.html'));
    });
  } else next();
});

// Error handler (must be last)
app.use(errorHandler);

// Export app for testing
module.exports = app;

// Start server only if not in test environment (migrate diy_guides before accepting traffic)
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  const billingService = require('./services/billingService');
  const recommendationService = require('./services/recommendationService');
  Promise.resolve()
    .then(() => runStartupDbTasksIfEnabled())
    .then(() =>
      Promise.all([
        billingService.ensureDiyGuidesAddonColumns(),
        recommendationService.ensureRecommendationsTable(),
      ])
    )
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Hairvelous server running at http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    })
    .catch((err) => {
      console.error('Startup migration failed:', err.message);
      app.listen(PORT, () => {
        console.log(`Hairvelous server running at http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    });
}