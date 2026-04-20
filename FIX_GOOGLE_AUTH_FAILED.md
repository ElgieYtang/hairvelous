# Fix "google_auth_failed" Error

## Common Causes & Solutions

### 1. Google OAuth Credentials Not Configured

**Check:** Your `.env` file should have real Google credentials, not placeholders.

**Current `.env` (WRONG):**
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

**Should be (CORRECT):**
```env
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**Solution:**
1. Get credentials from Google Cloud Console
2. Replace placeholders in `.env`
3. Restart server

### 2. Redirect URI Mismatch

**Error:** Google shows "redirect_uri_mismatch"

**Solution:**
- Check Google Cloud Console > Credentials > OAuth 2.0 Client
- Authorized redirect URI must be **exactly**: `http://localhost:3000/api/auth/google/callback`
- No trailing slash, no typos
- Must match `.env` file: `GOOGLE_CALLBACK_URL`

### 3. OAuth Consent Screen Not Configured

**Error:** "Access blocked: This app's request is invalid"

**Solution:**
1. Go to Google Cloud Console > APIs & Services > OAuth consent screen
2. Configure:
   - User Type: External
   - App name: Hairvelous
   - Support email: Your email
   - Scopes: email, profile, openid
   - Test users: Add your email
3. Save and try again

### 4. Database Migration Not Run

**Error:** "Google OAuth columns not found"

**Solution:**
Run the migration:
```bash
# Option 1: phpMyAdmin
# Copy contents of database/migration_add_google_oauth_final.sql
# Paste in phpMyAdmin SQL tab and execute

# Option 2: Node script
cd backend
node scripts/run_google_oauth_migration.js
```

### 5. User Denied Access

**Error:** "access_denied" in URL

**Solution:**
- User clicked "Cancel" on Google consent screen
- Try again and click "Allow"

### 6. Server Not Restarted

**After updating `.env`:**
```bash
# Stop server (Ctrl+C)
cd backend
npm start
```

## Debugging Steps

### Step 1: Check if Google OAuth is Configured

Visit: http://localhost:3000/api/auth/google/status

Should return: `{"configured":true}`

If `false`, check `.env` file.

### Step 2: Check Server Logs

When you click "Continue with Google", check your server console for errors:

```bash
# Look for:
Google OAuth error: ...
Google OAuth callback error: ...
```

### Step 3: Check Browser Console

Open browser DevTools (F12) > Console tab
Look for any JavaScript errors

### Step 4: Check Google Cloud Console

1. Go to: https://console.cloud.google.com/
2. APIs & Services > Credentials
3. Click your OAuth 2.0 Client
4. Verify:
   - Authorized redirect URIs includes: `http://localhost:3000/api/auth/google/callback`
   - Status is "Published" or "Testing"

## Quick Fix Checklist

- [ ] `.env` has real Google credentials (not placeholders)
- [ ] Redirect URI matches exactly in Google Console
- [ ] OAuth consent screen is configured
- [ ] Database migration is run
- [ ] Server restarted after `.env` changes
- [ ] Test user email added in OAuth consent screen

## Test After Fix

1. Go to: http://localhost:3000/login.html
2. Click "Continue with Google"
3. Should redirect to Google account selection
4. Select account
5. Should redirect back and log you in

## Still Not Working?

Check server logs for the exact error message. The improved error handling will now show more specific errors instead of just "google_auth_failed".

Common specific errors:
- "Google OAuth is not configured" → Add credentials to `.env`
- "redirect_uri_mismatch" → Fix redirect URI in Google Console
- "access_denied" → User cancelled, try again
- "Google token verification failed" → Check credentials are correct
- "Database columns not found" → Run migration
