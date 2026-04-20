# Hairvelous Testing Suite

## Overview

Comprehensive testing scaffold with Jest framework. Includes unit tests for all modules and integration tests for key workflows.

## Structure

```
backend/tests/
├── unit/
│   ├── auth.test.js          (UA-001 to UA-010)
│   ├── assessment.test.js    (AC-001 to AC-015)
│   ├── recommendation.test.js (PR-001 to PR-012)
│   ├── guide.test.js         (DG-001 to DG-010)
│   ├── routine.test.js       (RT-001 to RT-010)
│   ├── photo.test.js         (PM-001 to PM-008)
│   └── admin.test.js         (UM, PM, GM modules)
├── integration/
│   ├── auth.test.js          (IT-01: Login returns token)
│   ├── assessment-flow.test.js (IT-01: Assessment → Recommendations)
│   └── assessment-recommendation.test.js (IT-01 to IT-09 placeholders)
├── setup.js                  (Test configuration)
├── TEST_PLAN.md              (Complete test plan)
└── README.md                 (This file)
```

## Test IDs

### Unit Tests
- **UA-001 to UA-010**: User Authentication
- **AC-001 to AC-015**: Assessment & Profiling
- **PR-001 to PR-012**: Product Recommendation
- **DG-001 to DG-010**: DIY Guides
- **RT-001 to RT-010**: Routine Tracker
- **PM-001 to PM-008**: Photo Management
- **UM-001 to UM-008**: User Management (Admin)
- **PM-001 to PM-008**: Product Management (Admin)
- **GM-001 to GM-008**: Guide Management (Admin)

### Integration Tests
- **IT-01**: Creating assessment triggers recommendation generation ✅
- **IT-02**: User registration → login → assessment → recommendations flow
- **IT-03**: Admin creates product → appears in recommendations
- **IT-04**: Photo upload → stored in database → retrievable
- **IT-05**: Routine log → progress summary calculation
- **IT-06**: Admin creates guide → visible in public list
- **IT-07**: Forgot password → reset token → password update
- **IT-08**: Admin suspends user → user cannot login
- **IT-09**: Assessment with thinning issue → no products, advice only

## Implemented Tests

### 1. UA-001: Login returns token for valid user
**File**: `tests/unit/auth.test.js`
- Tests login service with mocked database
- Verifies token generation and user data return

### 2. IT-01: Creating assessment triggers recommendation generation
**File**: `tests/integration/assessment-flow.test.js`
- Full flow: create assessment → save responses → complete → verify recommendations
- Tests integration between assessment and recommendation services

## Running Tests

```bash
# Install dependencies (includes Jest and Supertest)
cd backend
npm install

# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode
npm run test:watch

# With coverage report
npm test -- --coverage
```

## Test Database Setup

For integration tests, create a separate test database:

```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE hairvelous_test;"
mysql -u root -p hairvelous_test < ../database/schema_hairvelous.sql

# Set in .env or .env.test
DB_NAME=hairvelous_test
```

## Notes

- Unit tests use mocked database connections (no DB required)
- Integration tests require a test database
- Tests gracefully skip if database is not available
- All tests follow Capstone test table structure
- Two example tests are fully implemented; rest are structured TODOs
