const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Reports stub
router.get('/reports', requireAdmin, async (req, res, next) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [assessmentCount] = await pool.query('SELECT COUNT(*) AS total FROM assessment_sessions WHERE completed_at IS NOT NULL');
    res.json({
      reports: {
        totalUsers: userCount[0].total,
        totalAssessments: assessmentCount[0].total,
        note: 'Full reports can be added here (charts, export, etc.).',
      },
    });
  } catch (e) {
    next(e);
  }
});

// System config stub: get
router.get('/config', requireAdmin, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT config_key, config_value, updated_at FROM system_config');
    const config = {};
    rows.forEach(r => { config[r.config_key] = r.config_value; });
    res.json({ config });
  } catch (e) {
    next(e);
  }
});

// System config stub: set
router.patch('/config', requireAdmin, async (req, res, next) => {
  try {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: 'key required' });
    await pool.query('INSERT INTO system_config (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = VALUES(config_value)', [key, value || null]);
    const [rows] = await pool.query('SELECT config_key, config_value FROM system_config WHERE config_key = ?', [key]);
    res.json({ config: { [rows[0].config_key]: rows[0].config_value } });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
