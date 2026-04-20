# Quick Start - Running Tests

## Installation

Dependencies are already installed. If you need to reinstall:

```bash
cd backend
npm install
```

## Running Tests

### All Tests
```bash
cd backend
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### With Coverage Report
```bash
npm test -- --coverage
```

## Test Database Setup (for Integration Tests)

Integration tests require a test database. If you don't have one set up, the tests will skip gracefully.

To set up test database:

```bash
# Create test database
mysql -u root -p -e "CREATE DATABASE hairvelous_test;"

# Load schema
mysql -u root -p hairvelous_test < ../database/schema_hairvelous.sql

# Set in .env or create .env.test
DB_NAME=hairvelous_test
```

## Current Status

- ✅ Jest installed and working
- ✅ 2 example tests implemented (UA-001, IT-01)
- ✅ 93 unit test placeholders ready
- ✅ 8 integration test placeholders ready

## Troubleshooting

**"jest is not recognized"**
- Make sure you're in the `backend` directory
- Run `npm install` to install dependencies
- Use `npm test` instead of running `jest` directly

**Tests fail with database errors**
- Unit tests use mocked DB (should work without DB)
- Integration tests need test database (will skip if not available)
- Check `.env` has correct DB credentials

**"Cannot find module" errors**
- Run `npm install` again
- Make sure you're in the `backend` directory
