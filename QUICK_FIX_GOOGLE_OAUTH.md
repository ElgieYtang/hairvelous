# Quick Fix: Google OAuth Not Configured

## The Issue
You're seeing: "Google OAuth is not configured. Please contact administrator."

## Solution Options

### Option 1: Hide Google Button (Recommended for now)
The Google button will automatically hide if Google OAuth is not configured. You can still use email/password login.

**No action needed** - the app will work without Google OAuth.

### Option 2: Enable Google Sign-In

1. **Get Google OAuth Credentials:**
   - Go to https://console.cloud.google.com/
   - Create a project
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:3000/api/auth/google/callback`

2. **Update `.env` file:**
   ```env
   GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-actual-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
   ```

3. **Restart server:**
   ```bash
   # Stop server (Ctrl+C)
   cd backend
   npm start
   ```

## Current Status

✅ **App works without Google OAuth** - Email/password login works fine
✅ **Google button auto-hides** - Won't show if not configured
✅ **Error handling improved** - Better error messages

## To Test Email/Password Login

1. Go to `/login.html` or `/register.html`
2. Use the email/password form (Google button will be hidden)
3. Login works normally!

## Next Steps

- If you want Google Sign-In: Follow Option 2 above
- If you don't need it: Just use email/password login (it's already working!)
