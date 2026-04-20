const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Get routine logs (own, optional date range)
router.get('/logs', requireAuth, async (req, res, next) => {
  try {
    const from = req.query.from;
    const to = req.query.to;
    let sql = 'SELECT id, user_id, log_date, routine_type, notes, created_at FROM routine_logs WHERE user_id = ?';
    const params = [req.user.id];
    if (from) { sql += ' AND log_date >= ?'; params.push(from); }
    if (to) { sql += ' AND log_date <= ?'; params.push(to); }
    sql += ' ORDER BY log_date DESC, id DESC LIMIT 100';
    const [rows] = await pool.query(sql, params);
    res.json({ logs: rows });
  } catch (e) {
    next(e);
  }
});

// Add routine log
router.post(
  '/logs',
  requireAuth,
  [
    body('logDate').notEmpty(),
    body('routineType').optional().trim(),
    body('notes').optional().trim(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      await pool.query(
        'INSERT INTO routine_logs (user_id, log_date, routine_type, notes) VALUES (?, ?, ?, ?)',
        [req.user.id, req.body.logDate, req.body.routineType || null, req.body.notes || null]
      );
      const [rows] = await pool.query('SELECT * FROM routine_logs WHERE user_id = ? ORDER BY id DESC LIMIT 1', [req.user.id]);
      res.status(201).json({ log: rows[0] });
    } catch (e) {
      next(e);
    }
  }
);

// Update routine log (own)
router.patch('/logs/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { logDate, routineType, notes } = req.body;
    const [existing] = await pool.query('SELECT id FROM routine_logs WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Log not found' });
    const updates = [];
    const values = [];
    if (logDate !== undefined) { updates.push('log_date = ?'); values.push(logDate); }
    if (routineType !== undefined) { updates.push('routine_type = ?'); values.push(routineType); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    await pool.query('UPDATE routine_logs SET ' + updates.join(', ') + ' WHERE id = ?', values);
    const [rows] = await pool.query('SELECT * FROM routine_logs WHERE id = ?', [id]);
    res.json({ log: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Delete routine log (own)
router.delete('/logs/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [result] = await pool.query('DELETE FROM routine_logs WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Log not found' });
    res.json({ message: 'Log deleted' });
  } catch (e) {
    next(e);
  }
});

// Get notification/reminder settings (stub)
router.get('/settings', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notification_settings WHERE user_id = ?', [req.user.id]);
    const settings = rows[0] || { reminders_enabled: 1, reminder_frequency: 'weekly' };
    res.json({ settings });
  } catch (e) {
    next(e);
  }
});

// Update notification settings (stub)
router.patch('/settings', requireAuth, async (req, res, next) => {
  try {
    const { remindersEnabled, reminderFrequency } = req.body;
    await pool.query(
      'INSERT INTO notification_settings (user_id, reminders_enabled, reminder_frequency) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reminders_enabled = VALUES(reminders_enabled), reminder_frequency = VALUES(reminder_frequency)',
      [req.user.id, remindersEnabled !== false ? 1 : 0, reminderFrequency || 'weekly']
    );
    const [rows] = await pool.query('SELECT * FROM notification_settings WHERE user_id = ?', [req.user.id]);
    res.json({ settings: rows[0] });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
