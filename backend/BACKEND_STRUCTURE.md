# Hairvelous Backend Structure

Complete Node.js + Express backend with route/controller/service architecture.

## 📁 Directory Structure

```
backend/
├── config/
│   ├── db.js              # MySQL connection pool
│   └── upload.js          # Multer file upload configuration
├── middleware/
│   ├── auth.js            # JWT authentication & role-based access
│   ├── errorHandler.js    # Centralized error handling
│   └── validation.js      # Express-validator rules
├── services/              # Business logic layer
│   ├── authService.js
│   ├── profileService.js
│   ├── assessmentService.js
│   ├── recommendationService.js
│   ├── photoService.js
│   ├── routineService.js
│   ├── productService.js
│   ├── guideService.js
│   └── adminService.js
├── controllers/           # HTTP request handlers
│   ├── authController.js
│   ├── profileController.js
│   ├── assessmentController.js
│   ├── photoController.js
│   ├── routineController.js
│   ├── productController.js
│   ├── guideController.js
│   └── adminController.js
├── routes/                # Route definitions
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── assessmentRoutes.js
│   ├── photoRoutes.js
│   ├── routineRoutes.js
│   ├── productRoutes.js
│   ├── guideRoutes.js
│   └── adminRoutes.js
├── .env.example          # Environment variables template
├── package.json
└── server.js              # Main entry point
```

## 🔐 Authentication

- **JWT tokens** with configurable expiration (default: 7 days)
- **bcrypt** password hashing (10 rounds)
- **Role-based middleware**: `requireAuth()`, `requireAdmin()`
- **Optional auth**: `optionalAuth()` for public endpoints that can show user-specific data

## 📡 API Endpoints

### Auth (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login (returns JWT token)
- `POST /logout` - Logout (client-side token removal)
- `POST /forgot-password` - Generate reset token (stub: returns token in response)
- `POST /reset-password` - Reset password with token

### Profile (`/api/profile`)
- `GET /` - Get current user's profile
- `PATCH /` - Update profile (name, email)

### Assessment (`/api/assessments`)
- `POST /` - Create new assessment
- `POST /:assessmentId/responses` - Save assessment responses
- `GET /:assessmentId/results` - Get assessment results + recommendations
- `GET /latest/results` - Get latest assessment results for user

### Photos (`/api/photos`)
- `GET /` - List user's photos
- `POST /` - Upload photo (multipart/form-data, field: `photo`)
- `PUT /:photoId` - Replace photo
- `DELETE /:photoId` - Delete photo

### Routine (`/api/routine`)
- `POST /logs` - Create routine log
- `GET /logs` - List user's logs (query: `?limit=100`)
- `GET /progress` - Get progress summary (query: `?weeks=4`)
- `PATCH /logs/:routineId` - Update log
- `DELETE /logs/:routineId` - Delete log

### Products (`/api/products`)
- `GET /` - List products (query: `?category=anti-dandruff`)
- `GET /categories` - List all categories
- `GET /:productId` - Get single product
- `POST /` - Create product (admin)
- `PATCH /:productId` - Update product (admin)
- `DELETE /:productId` - Delete product (admin)

### Guides (`/api/guides`)
- `GET /` - List published guides
- `GET /:guideId` - Get single guide
- `POST /` - Create guide (admin)
- `PATCH /:guideId` - Update guide (admin)
- `DELETE /:guideId` - Delete guide (admin)

### Admin (`/api/admin`)
- `GET /users` - List all users
- `PATCH /users/:userId/status` - Suspend/reactivate user
- `POST /users/:userId/reset-password` - Reset user password
- `GET /reports` - Get basic reports (stub)

## 🗄️ Database

Uses `schema_hairvelous.sql` with tables:
- `users`, `roles`
- `hair_assessment`, `assessment_responses`
- `hair_profiles`, `hair_photos`
- `products`, `product_categories`, `recommendations`
- `routine_logs`, `diy_guides`

## 🔧 Configuration

Copy `backend/.env.example` to `backend/.env` and set:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET` (min 32 chars)
- `PORT` (default: 3000)
- `UPLOAD_DIR`, `MAX_FILE_SIZE`, `ALLOWED_FILE_TYPES`

## 🚀 Running

```bash
cd backend
npm install
node server.js
```

Server runs at `http://localhost:3000` (or PORT from .env).

## 📝 Notes

- **Non-medical disclaimers** included in all assessment/recommendation responses
- **Input validation** using express-validator
- **Error handling** centralized with appropriate HTTP status codes
- **File uploads** stored in `uploads/` directory (relative to project root)
- **Recommendations** generated rule-based (maps issues to product categories)
- **Progress summary** groups routine logs by week
