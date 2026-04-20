# Hairvelous Testing Plan

## Test Framework
- **Framework**: Jest
- **Test Runner**: `npm test`
- **Coverage**: `npm test -- --coverage`
- **Watch Mode**: `npm test:watch`

## Test Structure

### Unit Tests
Located in `backend/tests/unit/`
- `auth.test.js` - User Authentication (UA-001 to UA-010)
- `assessment.test.js` - Assessment & Profiling (AC-001 to AC-015)
- `recommendation.test.js` - Product Recommendation (PR-001 to PR-012)
- `guide.test.js` - DIY Guides (DG-001 to DG-010)
- `routine.test.js` - Routine Tracker (RT-001 to RT-010)
- `photo.test.js` - Photo Management (PM-001 to PM-008)
- `admin.test.js` - Admin Modules (UM-001 to UM-008, PM-001 to PM-008, GM-001 to GM-008)

### Integration Tests
Located in `backend/tests/integration/`
- `auth.test.js` - Authentication flow (IT-01)
- `assessment-flow.test.js` - Assessment → Recommendations (IT-01)
- `assessment-recommendation.test.js` - All integration tests (IT-01 to IT-09)

## Test ID Mapping

### User Authentication (UA)
- UA-001: ✅ Login returns token for valid user (IMPLEMENTED)
- UA-002: TODO - Login rejects invalid email
- UA-003: TODO - Login rejects invalid password
- UA-004: TODO - Register creates user with hashed password
- UA-005: TODO - Register rejects duplicate email
- UA-006: TODO - Forgot password generates reset token
- UA-007: TODO - Reset password validates token expiration
- UA-008: TODO - Reset password updates password hash
- UA-009: TODO - JWT token contains correct user ID
- UA-010: TODO - Password hashing uses bcrypt with salt rounds 10

### Assessment & Profiling (AC)
- AC-001: TODO - Create assessment returns assessment ID
- AC-002: TODO - Save responses stores question-answer pairs
- AC-003: TODO - Get results parses responses correctly
- AC-004: TODO - Get results creates hair profile
- AC-005: TODO - Get results updates existing profile
- AC-006: TODO - Get results extracts hair type from responses
- AC-007: TODO - Get results extracts scalp condition from responses
- AC-008: TODO - Get results extracts issues array from responses
- AC-009: TODO - Get latest results returns most recent assessment
- AC-010: TODO - Get results verifies user ownership
- AC-011: TODO - Assessment session belongs to correct user
- AC-012: TODO - Multiple responses for same question overwrites previous
- AC-013: TODO - Empty responses array clears existing responses
- AC-014: TODO - Get results handles missing profile gracefully
- AC-015: TODO - Date taken is set on assessment creation

### Product Recommendation (PR)
- PR-001: TODO - Generate recommendations maps issues to categories
- PR-002: TODO - Generate recommendations scores products correctly
- PR-003: TODO - Generate recommendations filters by budget
- PR-004: TODO - Generate recommendations filters by product type
- PR-005: TODO - Generate recommendations returns 5-10 products
- PR-006: TODO - Generate recommendations creates routine plan
- PR-007: TODO - Generate recommendations includes warnings
- PR-008: TODO - Generate recommendations matches DIY guides
- PR-009: TODO - Thinning issue returns no products, only advice
- PR-010: TODO - Hair type compatibility affects scoring
- PR-011: TODO - Scalp condition compatibility affects scoring
- PR-012: TODO - Generate reason text includes all relevant factors

### DIY Guides (DG)
- DG-001: TODO - List guides returns published guides only
- DG-002: TODO - List guides filters by category
- DG-003: TODO - List guides filters by difficulty
- DG-004: TODO - Get guide returns full guide details
- DG-005: TODO - Create guide validates category enum
- DG-006: TODO - Create guide validates difficulty enum
- DG-007: TODO - Create guide sets created_by to admin user ID
- DG-008: TODO - Update guide allows partial updates
- DG-009: TODO - Delete guide removes guide from database
- DG-010: TODO - Get guide includes creator name via JOIN

### Routine Tracker (RT)
- RT-001: TODO - Create log stores routine entry
- RT-002: TODO - Get user logs returns logs for specific user only
- RT-003: TODO - Get user logs respects limit parameter
- RT-004: TODO - Get progress summary groups by week
- RT-005: TODO - Get progress summary respects weeks parameter
- RT-006: TODO - Update log verifies user ownership
- RT-007: TODO - Delete log verifies user ownership
- RT-008: TODO - Date logged is stored as DATE type
- RT-009: TODO - Notes field is optional
- RT-010: TODO - Activity type is required

### Photo Management (PM)
- PM-001: TODO - Upload photo creates database record
- PM-002: TODO - Upload photo stores relative path
- PM-003: TODO - Get user photos returns only user's photos
- PM-004: TODO - Replace photo deletes old file
- PM-005: TODO - Replace photo verifies user ownership
- PM-006: TODO - Delete photo removes file from filesystem
- PM-007: TODO - Delete photo verifies user ownership
- PM-008: TODO - AI result field is optional

### User Management - Admin (UM)
- UM-001: TODO - List users returns all users with role names
- UM-002: TODO - Suspend user sets is_suspended flag
- UM-003: TODO - Reactivate user clears is_suspended flag
- UM-004: TODO - Reset user password updates password hash
- UM-005: TODO - List users includes assessment count
- UM-006: TODO - Admin cannot suspend themselves
- UM-007: TODO - User list is ordered by date_created DESC
- UM-008: TODO - Reports return correct user count

### Product Management - Admin (PM)
- PM-001: TODO - Create product requires name and price
- PM-002: TODO - Create product allows multiple categories
- PM-003: TODO - Update product allows partial updates
- PM-004: TODO - Delete product soft deletes (sets is_active = 0)
- PM-005: TODO - List products filters by category
- PM-006: TODO - Get product includes categories via JOIN
- PM-007: TODO - Product slug must be unique
- PM-008: TODO - Price must be positive decimal

### Guide Management - Admin (GM)
- GM-001: TODO - Create guide requires title and steps
- GM-002: TODO - Create guide validates category enum
- GM-003: TODO - Create guide validates difficulty enum
- GM-004: TODO - Update guide allows partial updates
- GM-005: TODO - Delete guide removes from database
- GM-006: TODO - Create guide sets created_by to admin ID
- GM-007: TODO - Ingredients field is optional
- GM-008: TODO - Caution field is optional

## Integration Tests (IT)

- IT-01: ✅ Creating assessment triggers recommendation generation (IMPLEMENTED)
- IT-02: TODO - User registration → login → assessment → recommendations flow
- IT-03: TODO - Admin creates product → appears in recommendations
- IT-04: TODO - Photo upload → stored in database → retrievable
- IT-05: TODO - Routine log → progress summary calculation
- IT-06: TODO - Admin creates guide → visible in public list
- IT-07: TODO - Forgot password → reset token → password update
- IT-08: TODO - Admin suspends user → user cannot login
- IT-09: TODO - Assessment with thinning issue → no products, advice only

## Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## Test Database Setup

For integration tests, use a separate test database:
```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE hairvelous_test;"
mysql -u root -p hairvelous_test < database/schema_hairvelous.sql

# Set in .env.test
DB_NAME=hairvelous_test
```

## Notes

- Unit tests use mocked database connections
- Integration tests require a test database
- Two example tests are fully implemented:
  1. UA-001: Login returns token for valid user
  2. IT-01: Creating assessment triggers recommendation generation
- All other tests are structured TODO placeholders ready for implementation
