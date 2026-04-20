const express = require('express');
const pool = require('../config/db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get assessment questions (public or authenticated)
router.get('/questions', optionalAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, question_key, question_text, question_order, question_type, options_json FROM hair_assessment ORDER BY question_order');
    res.json({ questions: rows });
  } catch (e) {
    next(e);
  }
});

// Start or get current session (requires auth)
router.post('/sessions', requireAuth, async (req, res, next) => {
  try {
    const [result] = await pool.query('INSERT INTO assessment_sessions (user_id) VALUES (?)', [req.user.id]);
    const [rows] = await pool.query('SELECT * FROM assessment_sessions WHERE id = ?', [result.insertId]);
    res.status(201).json({ session: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Submit response for one question
router.post('/sessions/:sessionId/responses', requireAuth, async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
    const { questionId, responseValue } = req.body;
    if (!questionId || responseValue === undefined) {
      return res.status(400).json({ error: 'questionId and responseValue required' });
    }
    const [sessionRows] = await pool.query('SELECT id FROM assessment_sessions WHERE id = ? AND user_id = ?', [sessionId, req.user.id]);
    if (sessionRows.length === 0) return res.status(404).json({ error: 'Session not found' });

    await pool.query(
      'INSERT INTO assessment_responses (session_id, question_id, response_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE response_value = VALUES(response_value)',
      [sessionId, questionId, typeof responseValue === 'object' ? JSON.stringify(responseValue) : String(responseValue)]
    );
    res.json({ message: 'Response saved' });
  } catch (e) {
    next(e);
  }
});

// Complete session and generate profile (rule-based heuristic)
router.post('/sessions/:sessionId/complete', requireAuth, async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
    const [sessionRows] = await pool.query('SELECT id, user_id FROM assessment_sessions WHERE id = ? AND user_id = ?', [sessionId, req.user.id]);
    if (sessionRows.length === 0) return res.status(404).json({ error: 'Session not found' });

    const [responses] = await pool.query('SELECT question_id, response_value FROM assessment_responses WHERE session_id = ?', [sessionId]);
    const [questions] = await pool.query('SELECT id, question_key FROM hair_assessment');
    const byKey = {};
    questions.forEach(q => { byKey[q.id] = q.question_key; });
    const answers = {};
    responses.forEach(r => {
      const key = byKey[r.question_id];
      let val = r.response_value;
      try { val = JSON.parse(val); } catch (_) {}
      answers[key] = val;
    });

    // Rule-based profile (heuristic for prototype)
    const issues = Array.isArray(answers.issues) ? answers.issues : (answers.issues ? [answers.issues] : []);
    if (issues.includes('none')) issues.length = 0;
    const severity = parseInt(answers.severity, 10) || 1;
    const severityFlag = severity >= 4 ? 1 : 0;
    const summaryText = `Hair type: ${answers.hair_type || 'unknown'}. Scalp: ${answers.scalp_condition || 'unknown'}. Concerns: ${issues.length ? issues.join(', ') : 'none noted'}.`;
    const routineSummary = issues.includes('dryness') ? 'Focus on hydration: moisturizing shampoo, conditioner, and weekly mask.' : '';
    const issuesJson = JSON.stringify(issues.filter(i => i !== 'none'));

    await pool.query('UPDATE assessment_sessions SET completed_at = NOW() WHERE id = ?', [sessionId]);
    const [ins] = await pool.query(
      'INSERT INTO hair_profiles (session_id, user_id, summary_text, issues_json, routine_summary, severity_flag) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, req.user.id, summaryText, issuesJson, routineSummary || 'Follow a consistent routine based on your hair type.', severityFlag]
    );
    const profileId = ins.insertId;

    // Stub recommendations: match products by target_issues_json
    const [products] = await pool.query('SELECT id, target_issues_json FROM products WHERE is_active = 1');
    const recs = [];
    const issueList = issues.filter(i => i !== 'none');
    products.forEach((p, i) => {
      let target = [];
      try { target = p.target_issues_json ? JSON.parse(p.target_issues_json) : []; } catch (_) {}
      if (issueList.some(iss => target.includes(iss)) || issueList.length === 0) {
        recs.push({ product_id: p.id, rank_order: i + 1, reason_text: 'Matched to your profile' });
      }
    });
    for (const r of recs.slice(0, 6)) {
      await pool.query('INSERT IGNORE INTO recommendations (hair_profile_id, product_id, rank_order, reason_text) VALUES (?, ?, ?, ?)', [profileId, r.product_id, r.rank_order, r.reason_text]);
    }

    const [profileRows] = await pool.query('SELECT * FROM hair_profiles WHERE id = ?', [profileId]);
    const [recRows] = await pool.query(
      'SELECT r.id, r.product_id, r.rank_order, r.reason_text, p.name, p.slug, p.description, p.brand FROM recommendations r JOIN products p ON r.product_id = p.id WHERE r.hair_profile_id = ? ORDER BY r.rank_order',
      [profileId]
    );
    res.json({
      profile: profileRows[0],
      recommendations: recRows,
      severityAdvisory: severityFlag ? 'Based on your answers, we recommend consulting a hair or healthcare professional for personalized advice.' : null,
    });
  } catch (e) {
    next(e);
  }
});

// Get user's latest profile (or by session id)
router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const sessionId = req.query.sessionId ? parseInt(req.query.sessionId, 10) : null;
    let profile;
    if (sessionId) {
      const [rows] = await pool.query('SELECT * FROM hair_profiles WHERE session_id = ? AND user_id = ?', [sessionId, req.user.id]);
      profile = rows[0] || null;
    } else {
      const [rows] = await pool.query('SELECT * FROM hair_profiles WHERE user_id = ? ORDER BY id DESC LIMIT 1', [req.user.id]);
      profile = rows[0] || null;
    }
    if (!profile) return res.json({ profile: null, recommendations: [] });
    const [recs] = await pool.query(
      'SELECT r.id, r.product_id, r.rank_order, r.reason_text, p.name, p.slug, p.description, p.brand FROM recommendations r JOIN products p ON r.product_id = p.id WHERE r.hair_profile_id = ? ORDER BY r.rank_order',
      [profile.id]
    );
    res.json({ profile, recommendations: recs });
  } catch (e) {
    next(e);
  }
});

// List user's assessment sessions
router.get('/sessions', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, user_id, completed_at, created_at FROM assessment_sessions WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    res.json({ sessions: rows });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
