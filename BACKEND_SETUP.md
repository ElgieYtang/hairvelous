# Hairvelous Backend - Complete Setup Guide

## 📋 Overview

Complete Node.js + Express backend with:
- **JWT authentication** (login returns token)
- **bcrypt password hashing**
- **Role-based middleware** (admin vs user)
- **REST API endpoints** for all modules
- **Route/Controller/Service architecture**
- **Input validation** and error handling
- **Non-medical disclaimers** in responses

## 📁 File Locations & Explanations

### Configuration Files

**`backend/.env.example`**
- Location: `backend/.env.example`
- Copy to `backend/.env` and fill in your values
- Contains: DB config, JWT secret, PORT, upload settings

**`backend/config/db.js`**
- MySQL connection pool with connection limit
- Auto-creates pool and tests connection on load
- Exports pool for use in services

**`backend/config/upload.js`**
- Multer configuration for file uploads
- Handles image uploads (jpeg, png, gif, webp)
- Stores files in `uploads/` directory
- Max file size: 5MB (configurable)

### Middleware

**`backend/middleware/auth.js`**
- `optionalAuth`: Sets `req.user` if token valid, else null
- `requireAuth`: Returns 401 if not authenticated
- `requireAdmin`: Returns 403 if not admin
- `signToken(userId)`: Generates JWT token

**`backend/middleware/errorHandler.js`**
- Centralized error handling
- Handles validation errors, MySQL errors, JWT errors, Multer errors
- Adds non-medical disclaimer to all error responses

**`backend/middleware/validation.js`**
- Express-validator rules for all endpoints
- Reusable validation middleware
- Exports: `validateRegister`, `validateLogin`, `validateAssessment`, etc.

### Services (Business Logic)

**`backend/services/authService.js`**
- `register()`: Create user with bcrypt hash
- `login()`: Verify password, return JWT token
- `forgotPassword()`: Generate reset token (stub: returns in response)
- `resetPassword()`: Reset password with token

**`backend/services/profileService.js`**
- `getProfile()`: Get user profile + hair profile
- `updateProfile()`: Update name/email

**`backend/services/assessmentService.js`**
- `createAssessment()`: Create new assessment session
- `saveResponses()`: Save question/answer pairs
- `getResults()`: Parse responses, generate hair profile
- `getLatestResults()`: Get user's latest assessment

**`backend/services/recommendationService.js`**
- `generateRecommendations()`: Rule-based product matching
- Maps issues (dryness, dandruff, frizz, oiliness) to categories
- Creates recommendation records
- `getUserRecommendations()`: List user's recommendations

**`backend/services/photoService.js`**
- `uploadPhoto()`: Save file, create DB record
- `getUserPhotos()`: List user's photos
- `replacePhoto()`: Delete old file, update DB
- `deletePhoto()`: Delete file and DB record

**`backend/services/routineService.js`**
- `createLog()`: Create routine log entry
- `getUserLogs()`: List logs (with limit)
- `getProgressSummary()`: Weekly counts grouped by week
- `updateLog()` / `deleteLog()`: Update/delete logs

**`backend/services/productService.js`**
- `listProducts()`: List with optional category filter
- `getProduct()`: Get single product with categories
- `createProduct()` / `updateProduct()` / `deleteProduct()`: Admin CRUD

**`backend/services/guideService.js`**
- `listGuides()`: List published guides
- `getGuide()`: Get single guide
- `createGuide()` / `updateGuide()` / `deleteGuide()`: Admin CRUD

**`backend/services/adminService.js`**
- `listUsers()`: List all users with stats
- `toggleUserStatus()`: Suspend/reactivate (stub - needs is_suspended column)
- `resetUserPassword()`: Admin password reset
- `getReports()`: Basic stats (users, assessments, products, recommendations)

### Controllers (HTTP Handlers)

**`backend/controllers/authController.js`**
- Handles: register, login, logout, forgot/reset password
- Uses `authService` for business logic
- Returns JSON with disclaimers

**`backend/controllers/profileController.js`**
- Handles: GET/PATCH profile
- Requires authentication

**`backend/controllers/assessmentController.js`**
- Handles: create assessment, save responses, get results
- Calls `recommendationService` to generate recommendations

**`backend/controllers/photoController.js`**
- Handles: upload, list, replace, delete photos
- Uses Multer middleware for file uploads

**`backend/controllers/routineController.js`**
- Handles: create log, list logs, progress summary, update/delete

**`backend/controllers/productController.js`**
- Handles: list, get, create, update, delete products
- Admin routes for create/update/delete

**`backend/controllers/guideController.js`**
- Handles: list, get, create, update, delete guides
- Admin routes for create/update/delete

**`backend/controllers/adminController.js`**
- Handles: list users, suspend/reactivate, reset password, reports

### Routes

**`backend/routes/authRoutes.js`**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

**`backend/routes/profileRoutes.js`**
- `GET /api/profile` (requireAuth)
- `PATCH /api/profile` (requireAuth)

**`backend/routes/assessmentRoutes.js`**
- `POST /api/assessments` (requireAuth)
- `POST /api/assessments/:assessmentId/responses` (requireAuth)
- `GET /api/assessments/:assessmentId/results` (requireAuth)
- `GET /api/assessments/latest/results` (requireAuth)

**`backend/routes/photoRoutes.js`**
- `GET /api/photos` (requireAuth)
- `POST /api/photos` (requireAuth, multer)
- `PUT /api/photos/:photoId` (requireAuth, multer)
- `DELETE /api/photos/:photoId` (requireAuth)

**`backend/routes/routineRoutes.js`**
- `POST /api/routine/logs` (requireAuth)
- `GET /api/routine/logs` (requireAuth)
- `GET /api/routine/progress` (requireAuth)
- `PATCH /api/routine/logs/:routineId` (requireAuth)
- `DELETE /api/routine/logs/:routineId` (requireAuth)

**`backend/routes/productRoutes.js`**
- `GET /api/products/categories` (optionalAuth)
- `GET /api/products` (optionalAuth, query: ?category=)
- `GET /api/products/:productId` (optionalAuth)
- `POST /api/products` (requireAdmin)
- `PATCH /api/products/:productId` (requireAdmin)
- `DELETE /api/products/:productId` (requireAdmin)

**`backend/routes/guideRoutes.js`**
- `GET /api/guides` (optionalAuth)
- `GET /api/guides/:guideId` (optionalAuth)
- `POST /api/guides` (requireAdmin)
- `PATCH /api/guides/:guideId` (requireAdmin)
- `DELETE /api/guides/:guideId` (requireAdmin)

**`backend/routes/adminRoutes.js`**
- `GET /api/admin/users` (requireAdmin)
- `PATCH /api/admin/users/:userId/status` (requireAdmin)
- `POST /api/admin/users/:userId/reset-password` (requireAdmin)
- `GET /api/admin/reports` (requireAdmin)

### Main Server

**`backend/server.js`**
- Entry point
- Loads .env from backend/ or project root
- Sets up Express app, CORS, JSON parsing
- Serves static files from `public/`
- Serves uploads from `uploads/`
- Mounts all API routes
- SPA fallback for HTML pages
- Error handler (must be last)

## 🗄️ Database

**`database/schema_hairvelous.sql`**
- Complete schema with all tables
- Foreign keys and indexes
- Seed data: roles, products, categories, DIY guides
- Run: `mysql -u root -p < database/schema_hairvelous.sql`

## 🚀 Quick Start

1. **Setup database:**
   ```bash
   mysql -u root -p < database/schema_hairvelous.sql
   ```

2. **Configure environment:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your DB credentials and JWT_SECRET
   ```

3. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Start server:**
   ```bash
   node server.js
   ```

5. **Test:**
   - Server runs at `http://localhost:3000`
   - API endpoints at `http://localhost:3000/api/*`
   - Frontend at `http://localhost:3000`

## 📝 Key Features

- **JWT Auth**: Login returns token; include in `Authorization: Bearer <token>` header
- **Role-Based Access**: Admin routes protected with `requireAdmin` middleware
- **File Uploads**: Multer handles image uploads; files stored in `uploads/`
- **Validation**: Express-validator on all inputs
- **Error Handling**: Centralized with appropriate HTTP status codes
- **Disclaimers**: Non-medical disclaimers in all assessment/recommendation responses
- **Recommendations**: Rule-based matching (issues → categories → products)

## 🔧 Notes

- **Reset Password**: Stub implementation returns token in response (for prototype). In production, send email.
- **User Suspension**: `adminService.toggleUserStatus()` is a stub. Add `is_suspended` column to users table if needed.
- **Recommendations**: Rule-based logic maps issues to product categories. Can be replaced with ML/AI later.
- **Progress Summary**: Groups routine logs by week (YYYY-WW format).
