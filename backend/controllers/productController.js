/**
 * Product Controller
 * Location: backend/controllers/productController.js
 * Purpose: Handle HTTP requests for products
 */
const productService = require('../services/productService');
const { validationResult } = require('express-validator');

class ProductController {
  async listProducts(req, res, next) {
    try {
      const category = req.query.category || null;
      const products = await productService.listProducts(category);
      res.json({ products });
    } catch (err) {
      next(err);
    }
  }

  async getProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productService.getProduct(parseInt(productId));
      res.json({
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCategories(req, res, next) {
    try {
      const categories = await productService.getCategories();
      res.json({ categories });
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await productService.createProduct(req.body);
      res.status(201).json({ product });
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const product = await productService.updateProduct(parseInt(productId), req.body);
      res.json({
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { productId } = req.params;
      const result = await productService.deleteProduct(parseInt(productId));
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
