const express = require('express');
const pool = require('../config/db');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List published DIY guides (public)
// NOTE: Legacy file — app uses guideRoutes/guideService. Query matches Hairvelous diy_guides (guide_id, steps, …).
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT guide_id, title, steps, category, difficulty, ingredients, caution, date_created
       FROM diy_guides
       ORDER BY date_created DESC`
    );
    const guides = rows.map((g) => ({
      id: g.guide_id,
      title: g.title,
      summary: g.steps
        ? String(g.steps).replace(/\s+/g, ' ').trim().slice(0, 220)
        : '',
      category: g.category,
      date_created: g.date_created,
    }));
    res.json({ guides });
  } catch (e) {
    next(e);
  }
});

// Get single guide by id or slug
router.get('/:idOrSlug', optionalAuth, async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    const isId = /^\d+$/.test(idOrSlug);
    const [rows] = await pool.query(
      isId ? 'SELECT * FROM diy_guides WHERE id = ?' : 'SELECT * FROM diy_guides WHERE slug = ?',
      [isId ? parseInt(idOrSlug, 10) : idOrSlug]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Guide not found' });
    const guide = rows[0];
    if (!guide.is_published && (!req.user || req.user.role_name !== 'admin')) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.json({ guide: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Admin: create guide
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, summary, content, tags, isPublished } = req.body;
    if (!title || !slug || !content) return res.status(400).json({ error: 'title, slug, and content required' });
    const tagsJson = tags ? JSON.stringify(Array.isArray(tags) ? tags : [tags]) : null;
    await pool.query(
      'INSERT INTO diy_guides (title, slug, summary, content, tags_json, is_published, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, slug, summary || null, content, tagsJson, isPublished !== false ? 1 : 0, req.user.id]
    );
    const [rows] = await pool.query('SELECT * FROM diy_guides WHERE slug = ?', [slug]);
    res.status(201).json({ guide: rows[0] });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Slug already exists' });
    next(e);
  }
});

// Admin: update guide
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, slug, summary, content, tags, isPublished } = req.body;
    const updates = [];
    const values = [];
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); values.push(slug); }
    if (summary !== undefined) { updates.push('summary = ?'); values.push(summary); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (tags !== undefined) { updates.push('tags_json = ?'); values.push(JSON.stringify(Array.isArray(tags) ? tags : [tags])); }
    if (isPublished !== undefined) { updates.push('is_published = ?'); values.push(isPublished ? 1 : 0); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    await pool.query('UPDATE diy_guides SET ' + updates.join(', ') + ' WHERE id = ?', values);
    const [rows] = await pool.query('SELECT * FROM diy_guides WHERE id = ?', [id]);
    res.json({ guide: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Admin: delete guide
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query('DELETE FROM diy_guides WHERE id = ?', [id]);
    res.json({ message: 'Guide deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
