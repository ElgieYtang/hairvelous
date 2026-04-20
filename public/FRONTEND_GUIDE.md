# Hairvelous Frontend Guide

Complete TailwindCSS frontend with no framework dependencies. All pages use fetch() for API calls and localStorage for JWT tokens.

## 📁 Page Structure

### Public Pages
- **landing.html** - Landing page with disclaimer, CTA to login/register, feature cards
- **login.html** - Login form with redirect handling
- **register.html** - Registration form
- **forgot.html** - Forgot password (shows reset token in prototype)

### Authenticated Pages
- **dashboard.html** - Main dashboard with cards for assessment, recommendations, guides, tracker; shows profile summary and recent recommendations
- **assessment.html** - Quiz form with question navigation, optional photo upload section with tips
- **results.html** - Hair profile summary, detected indicators, severity warnings, disclaimer
- **recommendations.html** - Product cards, preferences panel (budget/product type), routine plan, warnings, DIY guide suggestions
- **guides.html** - Guide cards with filters (category/difficulty), detail view
- **tracker.html** - Log routine form, progress summary (weekly counts), recent logs list

### Admin Pages
- **admin_dashboard.html** - Admin dashboard with cards linking to management pages, system reports
- **user_management.html** - User table, suspend/reactivate, reset password
- **product_management.html** - Product list, add/edit/delete products with categories
- **guide_management.html** - Guide list, add/edit/delete guides, publish/draft toggle

## 🎨 Design System

- **Colors**: Dark slate background (`bg-slate-900`), purple accents (`violet-600`), amber warnings
- **Typography**: Outfit font family
- **Layout**: Max-width containers, consistent spacing, card-based design
- **Components**: Rounded corners (`rounded-xl`), borders (`border-slate-700`), hover states

## 🔧 Shared JavaScript

### `/js/app.js`
- `getToken()`, `setToken()`, `getUser()`, `setUser()` - localStorage management
- `isLoggedIn()`, `requireAuth()`, `requireAdmin()` - Auth helpers
- `api()`, `apiForm()` - Fetch wrappers with JWT headers
- `showToast()` - Toast notifications

### `/js/layout.js`
- `renderNav()` - Dynamic navigation based on auth state
- `renderDisclaimer()` - Disclaimer banner
- `initLayout()` - Auto-initialize on page load

## 🔐 Authentication Flow

1. **Login**: POST `/api/auth/login` → Store token + user → Redirect to dashboard
2. **Register**: POST `/api/auth/register` → Store token + user → Redirect to dashboard
3. **Protected Routes**: Check `requireAuth()` → Redirect to login if not authenticated
4. **Admin Routes**: Check `requireAdmin()` → Redirect to dashboard if not admin

## 📡 API Integration

All pages use `api()` helper which:
- Adds `Authorization: Bearer <token>` header if logged in
- Handles JSON responses
- Throws errors for non-2xx responses
- Returns parsed JSON data

### Example Usage
```javascript
// GET request
const data = await api('/profile');

// POST request
const result = await api('/assessments', {
  method: 'POST',
  body: JSON.stringify({ ... })
});

// Form upload
const formData = new FormData();
formData.append('photo', file);
await apiForm('/photos', formData);
```

## 🎯 Key Features

### Assessment Page
- Dynamic quiz rendering from API questions
- Previous/Next navigation
- Response saving to session
- Photo upload with quality tips
- Login prompt if not authenticated

### Recommendations Page
- Preferences panel (budget, product type)
- Product cards with reasons
- Routine plan (daily/weekly)
- Warnings section
- DIY guide suggestions

### Tracker Page
- Log form with date, activity type, notes
- Progress summary (weekly counts)
- Recent logs list with delete

### Admin Pages
- User management: table view, suspend/reactivate, reset password
- Product management: CRUD with categories
- Guide management: CRUD with publish/draft

## 🚀 Navigation Flow

1. **Landing** → Login/Register
2. **Login** → Dashboard (or redirect URL)
3. **Dashboard** → Assessment/Recommendations/Guides/Tracker
4. **Assessment** → Results
5. **Results** → Recommendations
6. **Admin Dashboard** → User/Product/Guide Management

## 📝 Notes

- All pages include disclaimer banner at top
- Navigation adapts based on auth state (logged in vs logged out)
- Admin links only show for admin users
- Error handling via `showToast()` for user feedback
- Form validation handled by HTML5 `required` attributes
- Photo uploads use `apiForm()` for multipart/form-data
