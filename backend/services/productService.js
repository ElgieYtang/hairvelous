/**
 * Product Service
 * Location: backend/services/productService.js
 * Purpose: Business logic for products
 */
const pool = require('../config/db');

class ProductService {
  constructor() {
    this.schemaReady = false;
  }

  async ensureProductCategoryTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        category_id INT PRIMARY KEY AUTO_INCREMENT,
        product_id INT NOT NULL,
        category_name VARCHAR(120) NOT NULL,
        INDEX idx_product_id (product_id),
        INDEX idx_category_name (category_name),
        CONSTRAINT fk_product_category_product
          FOREIGN KEY (product_id) REFERENCES products(product_id)
          ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  async ensureSchema() {
    if (this.schemaReady) return;
    await this.ensureProductColumns();
    await this.ensureProductCategoryTable();
    this.schemaReady = true;
  }

  async ensureProductColumns() {
    const tryAlter = async (sql) => {
      try {
        await pool.query(sql);
      } catch (err) {
        if (err && (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060)) return;
        throw err;
      }
    };
    await tryAlter('ALTER TABLE products ADD COLUMN image_url VARCHAR(500) NULL');
    await tryAlter("ALTER TABLE products ADD COLUMN expiry_type ENUM('not_applicable','date','period_after_opening') NOT NULL DEFAULT 'not_applicable'");
    await tryAlter('ALTER TABLE products ADD COLUMN expiry_date DATE NULL');
    await tryAlter('ALTER TABLE products ADD COLUMN expiry_period_months INT NULL');
  }

  /**
   * List products with optional category filter
   */
  async listProducts(category = null) {
    await this.ensureSchema();
    let sql = `
      SELECT DISTINCT p.product_id, p.name, p.brand, p.description, p.image_url, p.price,
             p.expiry_type, p.expiry_date, p.expiry_period_months,
             GROUP_CONCAT(DISTINCT pc.category_name) as categories
      FROM products p
      LEFT JOIN product_categories pc ON p.product_id = pc.product_id
    `;

    const params = [];
    if (category) {
      sql += ` WHERE pc.category_name = ?`;
      params.push(category);
    }

    sql += ` GROUP BY p.product_id ORDER BY p.name`;

    const [rows] = await pool.query(sql, params);

    return rows.map(r => ({
      productId: r.product_id,
      name: r.name,
      brand: r.brand,
      description: r.description,
      imageUrl: r.image_url || null,
      price: parseFloat(r.price),
      expiryType: r.expiry_type || 'not_applicable',
      expiryDate: r.expiry_date || null,
      expiryPeriodMonths: r.expiry_period_months != null ? Number(r.expiry_period_months) : null,
      categories: r.categories ? r.categories.split(',') : [],
    }));
  }

  /**
   * Get single product
   */
  async getProduct(productId) {
    await this.ensureSchema();
    const [rows] = await pool.query(
      `SELECT p.product_id, p.name, p.brand, p.description, p.image_url, p.price,
              p.expiry_type, p.expiry_date, p.expiry_period_months,
              GROUP_CONCAT(DISTINCT pc.category_name) as categories
       FROM products p
       LEFT JOIN product_categories pc ON p.product_id = pc.product_id
       WHERE p.product_id = ?
       GROUP BY p.product_id`,
      [productId]
    );

    if (rows.length === 0) {
      throw new Error('Product not found');
    }

    const r = rows[0];
    return {
      productId: r.product_id,
      name: r.name,
      brand: r.brand,
      description: r.description,
      imageUrl: r.image_url || null,
      price: parseFloat(r.price),
      expiryType: r.expiry_type || 'not_applicable',
      expiryDate: r.expiry_date || null,
      expiryPeriodMonths: r.expiry_period_months != null ? Number(r.expiry_period_months) : null,
      categories: r.categories ? r.categories.split(',') : [],
    };
  }

  /**
   * Create product (seller/admin)
   */
  async createProduct(data) {
    await this.ensureSchema();
    const {
      name,
      brand,
      description,
      imageUrl,
      price,
      expiryType,
      expiryDate,
      expiryPeriodMonths,
      categories
    } = data;

    const safeExpiryType = expiryType || 'not_applicable';
    const safeExpiryDate = safeExpiryType === 'date' ? (expiryDate || null) : null;
    const safeExpiryPeriodMonths =
      safeExpiryType === 'period_after_opening'
        ? (expiryPeriodMonths != null ? Number(expiryPeriodMonths) : null)
        : null;

    const [result] = await pool.query(
      `INSERT INTO products
       (name, brand, description, image_url, price, expiry_type, expiry_date, expiry_period_months)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        brand || null,
        description || null,
        imageUrl || null,
        price,
        safeExpiryType,
        safeExpiryDate,
        safeExpiryPeriodMonths,
      ]
    );

    const productId = result.insertId;

    // Add categories
    if (categories && Array.isArray(categories) && categories.length > 0) {
      const catValues = categories.map(cat => [productId, cat]);
      await pool.query(
        'INSERT INTO product_categories (product_id, category_name) VALUES ?',
        [catValues]
      );
    }

    return this.getProduct(productId);
  }

  /**
   * Update product (seller/admin)
   */
  async updateProduct(productId, data) {
    await this.ensureSchema();
    const {
      name,
      brand,
      description,
      imageUrl,
      price,
      expiryType,
      expiryDate,
      expiryPeriodMonths,
      categories
    } = data;

    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (brand !== undefined) {
      updates.push('brand = ?');
      values.push(brand);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (imageUrl !== undefined) {
      updates.push('image_url = ?');
      values.push(imageUrl);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }

    if (expiryType !== undefined) {
      updates.push('expiry_type = ?');
      values.push(expiryType);

      if (expiryType === 'date') {
        updates.push('expiry_date = ?');
        values.push(expiryDate || null);
        updates.push('expiry_period_months = NULL');
      } else if (expiryType === 'period_after_opening') {
        updates.push('expiry_period_months = ?');
        values.push(expiryPeriodMonths != null ? Number(expiryPeriodMonths) : null);
        updates.push('expiry_date = NULL');
      } else {
        updates.push('expiry_date = NULL');
        updates.push('expiry_period_months = NULL');
      }
    } else {
      // allow direct updates if type wasn't explicitly changed
      if (expiryDate !== undefined) {
        updates.push('expiry_date = ?');
        values.push(expiryDate || null);
      }
      if (expiryPeriodMonths !== undefined) {
        updates.push('expiry_period_months = ?');
        values.push(expiryPeriodMonths != null ? Number(expiryPeriodMonths) : null);
      }
    }

    if (updates.length > 0) {
      values.push(productId);
      await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE product_id = ?`, values);
    }

    // Update categories
    if (categories !== undefined) {
      await pool.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
      if (Array.isArray(categories) && categories.length > 0) {
        const catValues = categories.map(cat => [productId, cat]);
        await pool.query(
          'INSERT INTO product_categories (product_id, category_name) VALUES ?',
          [catValues]
        );
      }
    }

    return this.getProduct(productId);
  }

  /**
   * Delete product
   */
  async deleteProduct(productId) {
    await pool.query('DELETE FROM products WHERE product_id = ?', [productId]);
    return { message: 'Product deleted' };
  }

  /**
   * Get categories list
   */
  async getCategories() {
    await this.ensureSchema();
    const [rows] = await pool.query(
      'SELECT DISTINCT category_name FROM product_categories ORDER BY category_name'
    );
    return rows.map(r => r.category_name);
  }
}

module.exports = new ProductService();