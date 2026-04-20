# Enable Google Account Login/Registration - Step by Step Guide

## ✅ Good News!

Google Sign-In is **already implemented** in your app! You just need to configure Google OAuth credentials.

## 🚀 Quick Setup (5 Steps)

### Step 1: Get Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select a Project**:
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Name: `Hairvelous` (or any name)
   - Click **"Create"**

3. **Configure OAuth Consent Screen**:
   - Go to **"APIs & Services"** > **"OAuth consent screen"**
   - Choose **"External"** (for testing)
   - Click **"Create"**
   - Fill in:
     - **App name**: `Hairvelous`
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **"Save and Continue"**
   - On **Scopes** page: Click **"Add or Remove Scopes"**
     - Select: `email`, `profile`, `openid`
     - Click **"Update"** > **"Save and Continue"**
   - On **Test users** page: Click **"Add Users"**
     - Add your email address (for testing)
     - Click **"Add"** > **"Save and Continue"**
   - Click **"Back to Dashboard"**

4. **Create OAuth 2.0 Client**:
   - Go to **"APIs & Services"** > **"Credentials"**
   - Click **"+ CREATE CREDENTIALS"** > **"OAuth client ID"**
   - Application type: **"Web application"**
   - Name: `Hairvelous Web Client`
   - **Authorized JavaScript origins**:
     - Click **"+ ADD URI"**
     - Add: `http://localhost:3000`
   - **Authorized redirect URIs**:
     - Click **"+ ADD URI"**
     - Add: `http://localhost:3000/api/auth/google/callback`
   - Click **"CREATE"**

5. **Copy Credentials**:
   - You'll see a popup with:
     - **Your Client ID**: `123456789-abc.apps.googleusercontent.com`
     - **Your Client Secret**: `GOCSPX-xxxxxxxxxxxxx`
   - **Copy both** (you won't see the secret again!)

### Step 2: Update `.env` File

Open `.env` file in your project root and add/update:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

**Replace** `your-actual-client-id-here` and `your-actual-client-secret-here` with the values from Google Cloud Console.

### Step 3: Run Database Migration (If Not Done)

The database needs Google OAuth columns. Run the migration:

**Option A: Using phpMyAdmin (XAMPP)**
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Select `hairvelous` database
3. Click **SQL** tab
4. Open `database/migration_add_google_oauth_final.sql`
5. Copy all contents
6. Paste into phpMyAdmin SQL editor
7. Click **"Go"**

**Option B: Using Node.js Script**
```bash
cd backend
node scripts/run_google_oauth_migration.js
```

### Step 4: Restart Your Server

```bash
# Stop server (Ctrl+C if running)
cd backend
npm start
```

### Step 5: Test Google Sign-In

1. **Go to**: http://localhost:3000/login.html or http://localhost:3000/register.html
2. **You should see**: "Continue with Google" button
3. **Click it**: Should redirect to Google account selection
4. **Select your Google account**: Should redirect back and log you in!

## ✅ What's Already Implemented

- ✅ Google OAuth service (`backend/services/googleAuthService.js`)
- ✅ Backend routes (`/api/auth/google` and `/api/auth/google/callback`)
- ✅ Frontend buttons on login and register pages
- ✅ Database schema support (migration ready)
- ✅ Account linking (links Google to existing email accounts)
- ✅ New user creation via Google

## 🎯 How It Works

### For New Users (Registration):
1. User clicks "Continue with Google" on register page
2. Redirects to Google account selection
3. User selects Google account
4. Google redirects back with user info
5. System creates new account automatically
6. User is logged in and redirected to dashboard

### For Existing Users (Login):
1. User clicks "Continue with Google" on login page
2. Redirects to Google account selection
3. User selects Google account
4. System finds account by Google ID or email
5. Links Google account if needed
6. User is logged in and redirected to dashboard

### Account Linking:
- If user has local account with same email → Links Google account
- User can then login with either email/password OR Google

## 🔍 Verify Setup

### Check if Google OAuth is configured:
Visit: http://localhost:3000/api/auth/google/status

Should return: `{"configured":true}`

### Check button visibility:
- Go to `/login.html` or `/register.html`
- Button should be **fully visible** (not faded/grayed out)
- Button should redirect to Google when clicked

## 🐛 Troubleshooting

### Button is grayed out or hidden?
- Check `.env` file has correct credentials (no extra spaces)
- Restart server after updating `.env`
- Verify: `http://localhost:3000/api/auth/google/status` returns `{"configured":true}`

### "Redirect URI mismatch" error?
- Check Google Cloud Console > Credentials
- Verify redirect URI is exactly: `http://localhost:3000/api/auth/google/callback`
- Make sure no trailing slashes or typos

### "Access blocked" error?
- Add your email as a test user in OAuth consent screen
- Or publish the app (for production use)

### Database errors?
- Run the migration: `database/migration_add_google_oauth_final.sql`
- Check columns exist: `auth_provider`, `google_sub`, `is_email_verified`

## 📝 Current Status

**What's Working:**
- ✅ Code is ready
- ✅ Frontend buttons exist
- ✅ Backend routes configured
- ✅ Database migration ready

**What You Need:**
- ⚠️ Google OAuth credentials (from Google Cloud Console)
- ⚠️ Add credentials to `.env` file
- ⚠️ Run database migration (if not done)
- ⚠️ Restart server

## 🎉 After Setup

Once configured, users can:
- ✅ Register with Google account
- ✅ Login with Google account
- ✅ Link Google to existing email account
- ✅ Use either email/password OR Google to login

## Need Help?

If you encounter issues:
1. Check `QUICK_GOOGLE_SETUP.md` for detailed instructions
2. Check `GOOGLE_OAUTH_SETUP.md` for comprehensive guide
3. Verify `.env` file has correct values
4. Check server logs for errors
5. Verify database migration ran successfully
