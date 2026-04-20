# Troubleshooting Google OAuth "Cannot GET /api/auth/google"

## Issue
Getting "Cannot GET /api/auth/google" error when clicking "Continue with Google" button.

## Solutions

### 1. Install Dependencies
Make sure all packages are installed:
```bash
cd backend
npm install
```

This should install:
- `google-auth-library`
- `express-session`

### 2. Restart the Server
After installing packages, **restart your server**:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

### 3. Check Environment Variables
Make sure your `.env` file has:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
SESSION_SECRET=your-session-secret-key
```

### 4. Verify Route Registration
The route should be registered at:
- **Path**: `/api/auth/google`
- **Method**: GET
- **Handler**: `authController.googleAuth`

### 5. Check Server Logs
Look for errors in the server console when clicking the button. Common errors:
- "Google OAuth is not configured" - Missing env variables
- "Cannot find module 'google-auth-library'" - Package not installed
- Session errors - SESSION_SECRET not set

### 6. Test Route Directly
Try accessing directly in browser:
```
http://localhost:3000/api/auth/google
```

Should redirect to Google consent screen (if configured) or show error message.

### 7. Clear Browser Cache
Sometimes browser cache can cause issues. Try:
- Hard refresh (Ctrl+Shift+R)
- Clear cache and cookies
- Try incognito/private window

## Quick Fix Checklist

- [ ] Ran `npm install` in backend directory
- [ ] Restarted the server after installing packages
- [ ] Set GOOGLE_CLIENT_ID in .env
- [ ] Set GOOGLE_CLIENT_SECRET in .env
- [ ] Set GOOGLE_CALLBACK_URL in .env
- [ ] Set SESSION_SECRET in .env
- [ ] Server is running on correct port (3000)
- [ ] No errors in server console

## Still Not Working?

1. Check if server is actually running:
   ```bash
   curl http://localhost:3000/api/auth/google
   ```

2. Verify the route exists:
   ```bash
   cd backend
   node -e "const r = require('./routes/authRoutes'); console.log(r.stack.map(s => s.route?.path))"
   ```

3. Check for conflicting routes or middleware issues
