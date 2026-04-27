/**
 * Firebase Auth Service
 * Verifies Firebase ID tokens (from Firebase Auth Google Sign-In)
 */
const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let initialized = false;

function initFirebaseAdmin() {
  if (initialized) return;
  
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    throw new Error('GOOGLE_APPLICATION_CREDENTIALS not set. Add service account JSON path to .env');
  }
  
  // Resolve path: absolute stays as-is; relative is resolved from backend folder (where this file lives)
  const backendDir = path.join(__dirname, '..');
  const absPath = path.isAbsolute(credPath) 
    ? credPath 
    : path.join(backendDir, credPath);
  
  if (!fs.existsSync(absPath)) {
    throw new Error(`Service account file not found at ${absPath}. Download from Firebase Console > Project settings > Service accounts`);
  }
  
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(absPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
  } catch (err) {
    throw new Error(`Firebase Admin init failed: ${err.message}`);
  }
}

function isFirebaseConfigured() {
  const credPath = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim();
  if (!credPath) return false;
  const backendDir = path.join(__dirname, '..');
  const absPath = path.isAbsolute(credPath) ? credPath : path.join(backendDir, credPath);
  return fs.existsSync(absPath);
}

/**
 * Verify Firebase ID token and return payload compatible with handleGoogleCallback
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<{sub, email, name, email_verified}>}
 */
async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('ID token is required');
  }
  
  initFirebaseAdmin();
  
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  
  // Map Firebase token to format expected by googleAuthService.handleGoogleCallback
  return {
    sub: decodedToken.uid,
    email: decodedToken.email || '',
    name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
    email_verified: !!decodedToken.email_verified,
  };
}

module.exports = {
  verifyFirebaseIdToken,
  isFirebaseConfigured,
};
