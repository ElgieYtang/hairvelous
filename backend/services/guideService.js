/**
 * Guide Service
 * Location: backend/services/guideService.js
 * Purpose: Business logic for DIY guides
 */
const pool = require('../config/db');
const billingService = require('./billingService');

class GuideService {
  /**
   * List guides with optional filters
   */
  async listGuides(filters = {}, options = {}) {
    await billingService.ensureDiyGuidesAddonColumns();
    let sql = 'SELECT guide_id, title, category, difficulty, ingredients, steps, caution, date_created, is_pro_only FROM diy_guides WHERE 1=1';
    const params = [];
    if (!options.isAdmin && !options.isProUser) {
      sql += ' AND is_pro_only = 0';
    }


    // Filter by category
    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    // Filter by difficulty
    if (filters.difficulty) {
      sql += ' AND difficulty = ?';
      params.push(filters.difficulty);
    }

    sql += ' ORDER BY date_created DESC';

    const [rows] = await pool.query(sql, params);

    return rows.map(r => ({
      guideId: r.guide_id,
      title: r.title,
      category: r.category,
      difficulty: r.difficulty,
      ingredients: r.ingredients,
      steps: r.steps,
      caution: r.caution,
      dateCreated: r.date_created,
      isProOnly: !!r.is_pro_only,
    }));
  }

  /**
   * Get single guide
   */
  async getGuide(guideId, options = {}) {
    await billingService.ensureDiyGuidesAddonColumns();
    const [rows] = await pool.query(
      `SELECT g.*, u.name as creator_name 
       FROM diy_guides g 
       LEFT JOIN users u ON g.created_by = u.user_id 
       WHERE g.guide_id = ?`,
      [guideId]
    );

    if (rows.length === 0) {
      throw new Error('Guide not found');
    }

    const r = rows[0];
    if (r.is_pro_only && !options.isAdmin && !options.isProUser) {
      throw new Error('This guide is available for Pro users only');
    }
    return {
      guideId: r.guide_id,
      title: r.title,
      category: r.category,
      difficulty: r.difficulty,
      ingredients: r.ingredients,
      steps: r.steps,
      caution: r.caution,
      createdBy: r.created_by,
      creatorName: r.creator_name,
      dateCreated: r.date_created,
      isProOnly: !!r.is_pro_only,
    };
  }

  /**
   * Create guide (admin)
   */
  async createGuide(data, adminUserId) {
    await billingService.ensureDiyGuidesAddonColumns();
    const { title, category, difficulty, ingredients, steps, caution } = data;

    if (!title || !steps) {
      throw new Error('Title and steps are required');
    }

    const validCategories = ['mask', 'oil', 'rinse', 'growth'];
    const validDifficulties = ['easy', 'medium', 'hard'];

    if (category && !validCategories.includes(category)) {
      throw new Error('Invalid category');
    }

    if (difficulty && !validDifficulties.includes(difficulty)) {
      throw new Error('Invalid difficulty');
    }

    const [result] = await pool.query(
      'INSERT INTO diy_guides (title, category, difficulty, ingredients, steps, caution, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        category || 'mask',
        difficulty || 'easy',
        ingredients || null,
        steps,
        caution || null,
        adminUserId,
      ]
    );

    return this.getGuide(result.insertId);
  }

  /**
   * Update guide (admin)
   */
  async updateGuide(guideId, data) {
    await billingService.ensureDiyGuidesAddonColumns();
    const { title, category, difficulty, ingredients, steps, caution } = data;

    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (category !== undefined) {
      const validCategories = ['mask', 'oil', 'rinse', 'growth'];
      if (!validCategories.includes(category)) {
        throw new Error('Invalid category');
      }
      updates.push('category = ?');
      values.push(category);
    }
    if (difficulty !== undefined) {
      const validDifficulties = ['easy', 'medium', 'hard'];
      if (!validDifficulties.includes(difficulty)) {
        throw new Error('Invalid difficulty');
      }
      updates.push('difficulty = ?');
      values.push(difficulty);
    }
    if (ingredients !== undefined) {
      updates.push('ingredients = ?');
      values.push(ingredients);
    }
    if (steps !== undefined) {
      updates.push('steps = ?');
      values.push(steps);
    }
    if (caution !== undefined) {
      updates.push('caution = ?');
      values.push(caution);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(guideId);
    await pool.query(`UPDATE diy_guides SET ${updates.join(', ')} WHERE guide_id = ?`, values);

    return this.getGuide(guideId);
  }

  /**
   * Delete guide (admin)
   */
  async deleteGuide(guideId) {
    await billingService.ensureDiyGuidesAddonColumns();
    const [result] = await pool.query('DELETE FROM diy_guides WHERE guide_id = ?', [guideId]);
    if (result.affectedRows === 0) {
      throw new Error('Guide not found');
    }
    return { message: 'Guide deleted' };
  }
}

module.exports = new GuideService();
