const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const projectRoot = path.join(__dirname, '..', '..');
const uploadDir = path.join(projectRoot, 'uploads');
try { require('fs').mkdirSync(uploadDir, { recursive: true }); } catch (_) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = (file.originalname && path.extname(file.originalname)) || '.jpg';
    cb(null, `hair-${req.user.id}-${uuidv4()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Only image files (jpeg, png, gif, webp) are allowed'), false);
  },
});

// List current user's hair photos
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, file_path, file_name, caption, analysis_notes, created_at FROM hair_photos WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    res.json({ photos: rows });
  } catch (e) {
    next(e);
  }
});

// Upload photo (single)
router.post('/', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const relativePath = path.relative(projectRoot, req.file.path).replace(/\\/g, '/');
    const [result] = await pool.query(
      'INSERT INTO hair_photos (user_id, file_path, file_name, caption, analysis_notes) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, relativePath, req.file.originalname || req.file.filename, req.body.caption || null, 'Demo: Heuristic analysis placeholder. No medical diagnosis.']
    );
    const [rows] = await pool.query('SELECT * FROM hair_photos WHERE id = ?', [result.insertId]);
    res.status(201).json({ photo: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Replace photo (delete old file, upload new)
router.put('/:id', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await pool.query('SELECT id, file_path FROM hair_photos WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Photo not found' });
    const oldPath = path.join(projectRoot, existing[0].file_path);
    try { await fs.unlink(oldPath); } catch (_) {}
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const relPath = path.relative(projectRoot, req.file.path).replace(/\\/g, '/');
    await pool.query('UPDATE hair_photos SET file_path = ?, file_name = ? WHERE id = ?', [relPath, req.file.originalname || req.file.filename, id]);
    const [rows] = await pool.query('SELECT * FROM hair_photos WHERE id = ?', [id]);
    res.json({ photo: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Delete photo
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await pool.query('SELECT id, file_path FROM hair_photos WHERE id = ? AND user_id = ?', [id, req.user.id]);
    if (existing.length === 0) return res.status(404).json({ error: 'Photo not found' });
    const fullPath = path.join(projectRoot, existing[0].file_path);
    try { await fs.unlink(fullPath); } catch (_) {}
    await pool.query('DELETE FROM hair_photos WHERE id = ?', [id]);
    res.json({ message: 'Photo deleted' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
