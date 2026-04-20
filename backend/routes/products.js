const express = require('express');
const pool = require('../config/db');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// List products (public or by category)
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const category = req.query.category;
    let sql = 'SELECT p.id, p.name, p.slug, p.description, p.brand, p.image_url, p.target_issues_json, c.name AS category_name FROM products p LEFT JOIN product_categories c ON p.category_id = c.id WHERE p.is_active = 1';
    const params = [];
    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }
    sql += ' ORDER BY p.name';
    const [rows] = await pool.query(sql, params);
    res.json({ products: rows });
  } catch (e) {
    next(e);
  }
});

// Categories list (must be before /:id)
router.get('/categories/list', optionalAuth, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, slug, description FROM product_categories ORDER BY name');
    res.json({ categories: rows });
  } catch (e) {
    next(e);
  }
});

// Get single product
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [rows] = await pool.query(
      'SELECT p.*, c.name AS category_name FROM products p LEFT JOIN product_categories c ON p.category_id = c.id WHERE p.id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Admin: create product
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, slug, description, brand, categoryId, targetIssues, imageUrl } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
    const targetJson = targetIssues ? JSON.stringify(Array.isArray(targetIssues) ? targetIssues : [targetIssues]) : null;
    await pool.query(
      'INSERT INTO products (name, slug, description, brand, category_id, target_issues_json, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, brand || null, categoryId || null, targetJson, imageUrl || null]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE slug = ?', [slug]);
    res.status(201).json({ product: rows[0] });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Slug already exists' });
    next(e);
  }
});

// Admin: update product
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, slug, description, brand, categoryId, targetIssues, imageUrl, isActive } = req.body;
    const updates = [];
    const values = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (slug !== undefined) { updates.push('slug = ?'); values.push(slug); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (brand !== undefined) { updates.push('brand = ?'); values.push(brand); }
    if (categoryId !== undefined) { updates.push('category_id = ?'); values.push(categoryId); }
    if (targetIssues !== undefined) { updates.push('target_issues_json = ?'); values.push(JSON.stringify(Array.isArray(targetIssues) ? targetIssues : [targetIssues])); }
    if (imageUrl !== undefined) { updates.push('image_url = ?'); values.push(imageUrl); }
    if (isActive !== undefined) { updates.push('is_active = ?'); values.push(isActive ? 1 : 0); }
    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    await pool.query('UPDATE products SET ' + updates.join(', ') + ' WHERE id = ?', values);
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    res.json({ product: rows[0] });
  } catch (e) {
    next(e);
  }
});

// Admin: delete product (soft: set is_active = 0)
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await pool.query('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
    res.json({ message: 'Product deactivated' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
