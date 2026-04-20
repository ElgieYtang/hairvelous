/**
 * Assessment Service
 * Location: backend/services/assessmentService.js
 * Purpose: Business logic for hair assessments
 */
const pool = require('../config/db');

function normalizeScalarAnswer(a) {
  if (a == null) return null;
  if (typeof a === 'object' && !Array.isArray(a) && a.other === true) {
    const s = (a.specify || '').trim();
    return s ? `Other: ${s}` : 'Other';
  }
  if (typeof a === 'string') return a;
  if (Array.isArray(a) && a.length) return normalizeScalarAnswer(a[0]);
  return String(a);
}

function normalizeIssueEntry(i) {
  if (typeof i === 'string') return i;
  if (typeof i === 'object' && i && i.other === true) {
    const s = (i.specify || '').trim();
    return s ? `Other: ${s}` : 'Other';
  }
  if (i && i.value != null) return String(i.value);
  return String(i);
}

// In-memory store for SKIP_DB_FOR_TESTING mode
const _mockStore = {
  nextId: 1,
  assessments: {},   // assessmentId -> { userId, responses: [] }
};

class AssessmentService {
  constructor() {
    this.tablesReady = false;
  }

  async ensureTables() {
    if (this.tablesReady) return;
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hair_assessment (
        assessment_id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        date_taken TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_date_taken (date_taken),
        CONSTRAINT fk_assessment_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessment_responses (
        response_id INT PRIMARY KEY AUTO_INCREMENT,
        assessment_id INT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        INDEX idx_assessment_id (assessment_id),
        CONSTRAINT fk_response_assessment FOREIGN KEY (assessment_id) REFERENCES hair_assessment(assessment_id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
    this.tablesReady = true;
  }

  /**
   * Create a new assessment
   */
  async createAssessment(userId) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      const assessmentId = _mockStore.nextId++;
      _mockStore.assessments[assessmentId] = { userId, responses: [] };
      return { assessmentId };
    }
    await this.ensureTables();
    const [result] = await pool.query(
      'INSERT INTO hair_assessment (user_id) VALUES (?)',
      [userId]
    );
    return { assessmentId: result.insertId };
  }

  /**
   * Save assessment responses
   */
  async saveResponses(assessmentId, responses) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      if (_mockStore.assessments[assessmentId]) {
        _mockStore.assessments[assessmentId].responses = responses || [];
      }
      return;
    }
    await this.ensureTables();
    const billingService = require('./billingService');
    await billingService.ensureDiyGuidesAddonColumns();

    // Delete existing responses for this assessment
    await pool.query('DELETE FROM assessment_responses WHERE assessment_id = ?', [assessmentId]);

    // Insert new responses
    if (responses && responses.length > 0) {
      const values = responses.map(r => [assessmentId, r.question, r.answer]);
      await pool.query(
        'INSERT INTO assessment_responses (assessment_id, question, answer) VALUES ?',
        [values]
      );
    }

    const [assessmentRows] = await pool.query(
      'SELECT user_id FROM hair_assessment WHERE assessment_id = ?',
      [assessmentId]
    );
    const assRow = assessmentRows && assessmentRows[0];
    if (assRow) {
      const [respRows] = await pool.query(
        'SELECT question, answer FROM assessment_responses WHERE assessment_id = ?',
        [assessmentId]
      );
      const data = this._parseResponses(respRows || []);
      await this.upsertHairProfile(assRow.user_id, {
        hairType: data.hairType || null,
        scalpCondition: data.scalpCondition || null,
        issuesDetected: data.issues || [],
      });
      const recommendationService = require('./recommendationService');
      await recommendationService.generateAndPersistRecommendations(assRow.user_id, {
        budget: 'medium',
        productType: 'all',
      });
    }
  }

  /**
   * Persist hair profile for dashboard + recommendation engine (single row per user).
   */
  async upsertHairProfile(userId, { hairType, scalpCondition, issuesDetected }) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return;
    const issuesText =
      Array.isArray(issuesDetected) && issuesDetected.length
        ? issuesDetected.join(', ')
        : null;
    await pool.query('DELETE FROM hair_profiles WHERE user_id = ?', [userId]);
    await pool.query(
      `INSERT INTO hair_profiles (user_id, hair_type, scalp_condition, issues_detected) VALUES (?, ?, ?, ?)`,
      [userId, hairType || null, scalpCondition || null, issuesText]
    );
  }

  /**
   * Parse raw responses array into a profile data object (shared helper)
   */
  _parseResponses(responses) {
    const data = {};
    responses.forEach(r => {
      const q = r.question.toLowerCase();
      let a = r.answer;
      try { a = JSON.parse(a); } catch (e) { /* keep as string */ }
      const answerLower = typeof a === 'string' ? a.toLowerCase() : '';

      if (q.includes('hair type') || q.includes('hairtype')) {
        data.hairType = normalizeScalarAnswer(a) || data.hairType;
      }
      if (q.includes('scalp') && (q.includes('condition') || q.includes('type'))) {
        data.scalpCondition = normalizeScalarAnswer(a) || data.scalpCondition;
      }
      if (q.includes('issue') || q.includes('concern') || q.includes('problem')) {
        if (!data.issues) data.issues = [];
        if (Array.isArray(a)) {
          data.issues.push(...a.map((i) => normalizeIssueEntry(i)));
        } else if (typeof a === 'string') {
          if (a.includes(',')) {
            data.issues.push(...a.split(',').map(s => s.trim()));
          } else {
            data.issues.push(a);
          }
        } else {
          data.issues.push(String(a));
        }
      }
      // Bald / very little hair flag
      if (q.includes('very little or no hair') || q.includes('bald')) {
        data.isBald = (answerLower === 'yes');
      }
    });
    return data;
  }

  /**
   * Get assessment results and generate profile
   */
  async getResults(assessmentId, userId) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      const mock = _mockStore.assessments[assessmentId];
      if (!mock) throw new Error('Assessment not found');
      if (mock.userId !== userId) throw new Error('Unauthorized');
      const data = this._parseResponses(mock.responses || []);
      return {
        assessmentId,
        hairType: data.hairType || null,
        scalpCondition: data.scalpCondition || null,
        issuesDetected: data.issues || [],
        isBald: !!data.isBald,
      };
    }

    await this.ensureTables();
    // Verify ownership
    const [assessment] = await pool.query(
      'SELECT user_id FROM hair_assessment WHERE assessment_id = ?',
      [assessmentId]
    );

    if (assessment.length === 0) {
      throw new Error('Assessment not found');
    }

    if (assessment[0].user_id !== userId) {
      throw new Error('Unauthorized');
    }

    // Get responses
    const [rows] = await pool.query(
      'SELECT question, answer FROM assessment_responses WHERE assessment_id = ?',
      [assessmentId]
    );

    const data = this._parseResponses(rows || []);

    return {
      assessmentId,
      hairType: data.hairType || null,
      scalpCondition: data.scalpCondition || null,
      issuesDetected: data.issues || [],
      isBald: !!data.isBald,
    };
  }

  /**
   * Get latest assessment results for a user
   */
  async getLatestResults(userId) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') {
      const ids = Object.keys(_mockStore.assessments)
        .map(id => parseInt(id, 10))
        .filter(id => _mockStore.assessments[id].userId === userId);
      if (!ids.length) return null;
      const latestId = Math.max(...ids);
      const data = this._parseResponses(_mockStore.assessments[latestId].responses || []);
      return {
        assessmentId: latestId,
        hairType: data.hairType || null,
        scalpCondition: data.scalpCondition || null,
        issuesDetected: data.issues || [],
        isBald: !!data.isBald,
      };
    }

    await this.ensureTables();
    const [rows] = await pool.query(
      'SELECT assessment_id FROM hair_assessment WHERE user_id = ? ORDER BY date_taken DESC LIMIT 1',
      [userId]
    );
    if (!rows.length) return null;
    const latestId = rows[0].assessment_id;

    const [respRows] = await pool.query(
      'SELECT question, answer FROM assessment_responses WHERE assessment_id = ?',
      [latestId]
    );
    const data = this._parseResponses(respRows || []);

    return {
      assessmentId: latestId,
      hairType: data.hairType || null,
      scalpCondition: data.scalpCondition || null,
      issuesDetected: data.issues || [],
      isBald: !!data.isBald,
    };
  }

  /**
   * Latest assessment Q&A rows for Hair AI context
   */
  async getLatestAssessmentAnswers(userId) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return [];
    await this.ensureTables();
    const latest = await this.getLatestResults(userId);
    if (!latest || !latest.assessmentId) return [];
    const [rows] = await pool.query(
      'SELECT question, answer FROM assessment_responses WHERE assessment_id = ? ORDER BY response_id ASC',
      [latest.assessmentId]
    );
    return (rows || []).map((r) => ({ question: r.question, answer: r.answer }));
  }
}

module.exports = new AssessmentService();