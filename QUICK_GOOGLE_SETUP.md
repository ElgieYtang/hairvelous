# Quick Google OAuth Setup Guide

## Why is the Google button hidden?

The "Continue with Google" button is automatically hidden when Google OAuth credentials are not configured. This prevents errors when users try to use it.

## To Show the Google Button:

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/

2. **Create or Select a Project**:
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one

3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: External
     - App name: Hairvelous (or your app name)
     - Support email: your email
     - Scopes: email, profile, openid
     - Test users: Add your email (for testing)
   - Application type: Web application
   - Name: Hairvelous Web Client
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback`
   - Click "Create"

5. **Copy Credentials**:
   - Copy the "Client ID" (looks like: `123456789-abc.apps.googleusercontent.com`)
   - Copy the "Client Secret" (looks like: `GOCSPX-xxxxxxxxxxxxx`)

### Step 2: Update `.env` File

Open `.env` file in the project root and update:

```env
GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**Important**: Replace `your-actual-client-id` and `your-actual-client-secret` with the values from Google Cloud Console.

### Step 3: Restart Server

```bash
# Stop the server (Ctrl+C)
# Then restart:
cd backend
npm start
```

### Step 4: Test

1. Go to `/register.html` or `/login.html`
2. The "Continue with Google" button should now be visible
3. Click it to test Google sign-in

## Troubleshooting

### Button still not showing?
- Check `.env` file has correct values (no extra spaces)
- Restart the server after updating `.env`
- Check browser console for errors
- Verify the status endpoint: `http://localhost:3000/api/auth/google/status` should return `{"configured":true}`

### Getting errors when clicking?
- Verify redirect URI matches exactly: `http://localhost:3000/api/auth/google/callback`
- Check Google Cloud Console > Credentials > OAuth 2.0 Client IDs
- Ensure OAuth consent screen is configured
- For testing, add your email as a test user in OAuth consent screen

## Option: Show Button Always (Without Configuration)

If you want the button to always show (even without credentials), I can modify the code. However, clicking it will show an error until credentials are configured.

Would you like me to:
1. Help you set up Google OAuth credentials (recommended)
2. Make the button always visible (will error until configured)
