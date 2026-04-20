# Google OAuth 2.0 Setup Guide

## Quick Setup Steps

### 1. Create Google Cloud OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API** (or **Google Identity Services API**)
4. Go to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth client ID**
6. Choose **Web application**
7. Configure:
   - **Name**: Hairvelous OAuth Client
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
8. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add to your `.env` file (or create from `.env.example`):

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your-session-secret-key
```

### 3. Run Database Migration

```bash
mysql -u root -p hairvelous < database/migration_add_google_oauth.sql
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Start Server

```bash
npm start
```

## How It Works

1. User clicks "Continue with Google" button
2. Redirects to Google consent screen
3. User grants permission
4. Google redirects back to `/api/auth/google/callback` with authorization code
5. Backend exchanges code for ID token
6. Backend verifies ID token and checks `email_verified`
7. If verified:
   - Creates new user OR links to existing account
   - Issues JWT token
   - Redirects to frontend with token
8. Frontend stores JWT and redirects to dashboard

## Security Features

- ✅ CSRF protection with state parameter
- ✅ ID token signature verification
- ✅ Audience validation
- ✅ Email verification check
- ✅ Secure session management

## Testing

1. Start the server
2. Navigate to `/login.html` or `/register.html`
3. Click "Continue with Google"
4. Sign in with a verified Google account
5. Should redirect to dashboard with JWT stored

## Troubleshooting

**Error: "Google email is not verified"**
- User must verify their Google email address in their Google account settings

**Error: "redirect_uri_mismatch"**
- Ensure the redirect URI in Google Cloud Console exactly matches `GOOGLE_CALLBACK_URL` in `.env`

**Error: "invalid_client"**
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

**Session not working**
- Ensure `SESSION_SECRET` is set in `.env`
- In production, ensure cookies are secure (HTTPS)
