/**
 * Auth Controller
 * Location: backend/controllers/authController.js
 * Purpose: Handle HTTP requests for authentication
 */
const authService = require('../services/authService');
const googleAuthService = require('../services/googleAuthService');
const firebaseAuthService = require('../services/firebaseAuthService');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

class AuthController {
  async register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, sex, birthdate, race } = req.body;

    const result = await authService.register(
      name,
      email,
      password,
      { sex, birthdate, race }
    );

    res.status(201).json({
      message: 'Registration successful',
      userId: result.userId,
      token: result.token,
    });
  } catch (err) {
    next(err);
  }
}

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res) {
    // Client-side token removal; server-side is stateless
    res.json({
      message: 'Logged out',
    });
  }

  async forgotPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;
      const result = await authService.forgotPassword(email);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Check if Google OAuth is configured
   */
  async googleAuthStatus(req, res, next) {
    try {
      const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
      const callbackUrl = process.env.GOOGLE_CALLBACK_URL?.trim();
      const firebaseCredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
      
      const isConfigured = !!(clientId && clientSecret && callbackUrl && 
                               clientId !== '' && clientSecret !== '' && callbackUrl !== '');
      const firebaseConfigured = !!(firebaseCredPath && firebaseCredPath !== '');
      
      res.json({ configured: isConfigured || firebaseConfigured, oauthConfigured: isConfigured, firebaseConfigured });
    } catch (err) {
      res.json({ configured: false });
    }
  }

  /**
   * Firebase Google Sign-In endpoint:
   * 1) verify Firebase ID token
   * 2) create/link user via existing Google callback handler
   * 3) return app JWT + user payload
   */
  async googleFirebase(req, res, next) {
    try {
      const idToken = String((req.body && req.body.idToken) || '').trim();
      if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

      const googlePayload = await firebaseAuthService.verifyFirebaseIdToken(idToken);
      const result = await googleAuthService.handleGoogleCallback(googlePayload);
      res.json(result);
    } catch (err) {
      console.error('Firebase Google sign-in error:', err.message || err);
      res.status(401).json({ error: err.message || 'Google sign-in failed' });
    }
  }

  /**
   * Initiate Google OAuth flow
   */
  async googleAuth(req, res, next) {
    try {
      // Check if Google OAuth is configured
      const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
      
      if (!clientId || !clientSecret || clientId === '' || clientSecret === '') {
        // Determine which page to redirect back to based on referrer or query param
        const referer = req.get('referer') || '';
        const redirectTo = req.query.redirect || (referer.includes('register') ? 'register' : 'login');
        const errorMsg = redirectTo === 'register' 
          ? 'Google Sign-In is not configured. Please use email/password registration or configure Google OAuth credentials.'
          : 'Google Sign-In is not configured. Please use email/password login.';
        
        return res.redirect(`/${redirectTo}.html?error=${encodeURIComponent(errorMsg)}`);
      }
      
      // Generate state for CSRF protection
      const state = crypto.randomBytes(32).toString('hex');
      req.session.googleOAuthState = state;
      
      const authUrl = googleAuthService.getAuthUrl(state);
      res.redirect(authUrl);
    } catch (err) {
      console.error('Google OAuth initiation error:', err);
      const redirectTo = req.query.redirect || 'login';
      const errorMsg = encodeURIComponent(err.message || 'Failed to initiate Google sign-in');
      res.redirect(`/${redirectTo}.html?error=${errorMsg}`);
    }
  }

  /**
   * Handle Google OAuth callback
   */
  async googleCallback(req, res, next) {
    try {
      const { code, state, error, error_description } = req.query;
      const redirectTo = req.query.redirect || 'login';

      // Check if Google returned an error
      if (error) {
        console.error('Google OAuth error:', error, error_description);
        let errorMsg = 'Google authentication failed';
        if (error === 'access_denied') {
          errorMsg = 'Google sign-in was cancelled. Please try again.';
        } else if (error_description) {
          errorMsg = `Google authentication error: ${error_description}`;
        }
        return res.redirect(`/${redirectTo}.html?error=${encodeURIComponent(errorMsg)}`);
      }

      if (!code) {
        console.error('No authorization code received from Google');
        return res.redirect(`/${redirectTo}.html?error=${encodeURIComponent('Google authentication failed: No authorization code received. Please check your Google OAuth configuration.')}`);
      }

      // Verify state (CSRF protection)
      if (state && req.session && req.session.googleOAuthState) {
        if (state !== req.session.googleOAuthState) {
          return res.redirect('/login.html?error=invalid_state');
        }
        // Clear state after use
        delete req.session.googleOAuthState;
      }

      // Verify ID token and get user info
      const googlePayload = await googleAuthService.verifyIdToken(code);

      // Handle user creation/linking and get JWT
      const result = await googleAuthService.handleGoogleCallback(googlePayload);

      // Redirect to frontend with token
      const redirectUrl = `/${redirectTo}.html?google_success=1&token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
      res.redirect(redirectUrl);
    } catch (err) {
      console.error('Google OAuth callback error:', err);
      const redirectTo = req.query.redirect || 'login';
      let errorMsg = err.message || 'Google authentication failed';
      
      // Provide more helpful error messages
      if (errorMsg.includes('not configured')) {
        errorMsg = 'Google Sign-In is not configured. Please configure Google OAuth credentials in .env file.';
      } else if (errorMsg.includes('token verification failed')) {
        errorMsg = 'Google token verification failed. Please check your Google OAuth credentials.';
      } else if (errorMsg.includes('columns not found')) {
        errorMsg = 'Database migration required. Please run: database/migration_add_google_oauth_final.sql';
      } else if (errorMsg.includes('email is not verified')) {
        errorMsg = 'Your Google email is not verified. Please verify your email with Google first.';
      }
      
      res.redirect(`/${redirectTo}.html?error=${encodeURIComponent(errorMsg)}`);
    }
  }
}

module.exports = new AuthController();
