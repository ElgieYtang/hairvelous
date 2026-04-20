/**
 * Integration Tests - Authentication
 * Test ID: IT-01 (Login returns token for valid user)
 */
const request = require('supertest');
const app = require('../../server');
const pool = require('../../config/db');
const bcrypt = require('bcryptjs');

describe('Integration Test - Authentication', () => {
  let testUserId;

  beforeAll(async () => {
    // Skip if test database not available
    try {
      // Setup: Create test user in database
      const passwordHash = await bcrypt.hash('testpass123', 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
        ['Test User', 'test@example.com', passwordHash, 1]
      );
      testUserId = result.insertId;
    } catch (err) {
      console.warn('Test database not available, skipping integration tests');
      testUserId = null;
    }
  });

  afterAll(async () => {
    // Cleanup: Remove test user
    if (testUserId) {
      try {
        await pool.query('DELETE FROM users WHERE user_id = ?', [testUserId]);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
  });

  // IT-01: Login returns token for valid user
  test('IT-01: Login returns token for valid user', async () => {
    if (!testUserId) {
      console.log('Skipping test - database not available');
      return;
    }

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123',
      })
      .expect(200);

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
    expect(response.body.user).toHaveProperty('userId');
    expect(response.body).toHaveProperty('disclaimer');
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  test('Login rejects invalid credentials', async () => {
    if (!testUserId) {
      console.log('Skipping test - database not available');
      return;
    }

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .expect(401);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Invalid');
  });
});
