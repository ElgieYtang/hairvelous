/**
 * Firebase Google Sign-In for Hairvelous
 * Requires: firebase-app-compat, firebase-auth-compat, firebase-config.js, app.js
 */
(function() {
  let firebaseApp = null;

  function getAuth() {
    if (!firebaseApp) {
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK not loaded');
      }
      if (typeof firebaseConfig === 'undefined') {
        throw new Error('Firebase config not loaded. Check that firebase-config.js loads correctly.');
      }
      // Avoid "Firebase App named '[DEFAULT]' already exists" when app was initialized elsewhere
      firebaseApp = (firebase.apps && firebase.apps.length) ? firebase.app() : firebase.initializeApp(firebaseConfig);
    }
    return firebase.auth();
  }

  /**
   * Sign in with Google via Firebase, then exchange for backend JWT
   * @param {string} redirectTo - Path to redirect after success (e.g. '/dashboard.html')
   * @returns {Promise<{error?: string}>} - Resolves on success (redirects), or { error } on failure
   */
  window.signInWithGoogleFirebase = async function(redirectTo) {
    redirectTo = redirectTo || '/dashboard.html';
    try {
      const auth = getAuth();
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('/api/auth/google/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { error: data.error || data.message || 'Google sign-in failed' };
      }

      if (data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        if (typeof collapseSidebarForFreshLogin === 'function') collapseSidebarForFreshLogin();
        const r = data.user && (data.user.roleName || data.user.role);
        let finalRedirect = redirectTo || '/dashboard.html';
        if (r === 'admin') finalRedirect = '/admin_dashboard.html';
        else if (r === 'seller') finalRedirect = '/product_management.html';
        else if (r === 'specialist') finalRedirect = '/specialist_dashboard.html';
        window.location.href = finalRedirect;
        return {};
      }
      return { error: 'Invalid response from server' };
    } catch (err) {
      // User cancelled - don't show error
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return { error: null };
      }
      // Popup blocked by browser (e.g. mobile in-app browsers, strict popup blockers)
      if (err.code === 'auth/popup-blocked') {
        return { error: 'Sign-in popup was blocked. Please allow popups for this site or try in a different browser.' };
      }
      // Google provider not enabled in Firebase Console
      if (err.code === 'auth/operation-not-allowed') {
        return { error: 'Google Sign-In is not enabled. Enable it in Firebase Console > Authentication > Sign-in method.' };
      }
      // Domain not in Firebase authorized domains
      if (err.code === 'auth/unauthorized-domain') {
        return { error: 'This domain is not authorized for Google Sign-In. Add it in Firebase Console > Authentication > Settings > Authorized domains.' };
      }
      // Network/other errors
      console.error('Firebase Google sign-in error:', err);
      return { error: err.message || 'Google sign-in failed' };
    }
  };
})();
