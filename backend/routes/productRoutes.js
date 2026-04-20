// backend/routes/productRoutes.js
/**
 * Product Routes
 * Location: backend/routes/productRoutes.js
 * Purpose: Define product endpoints
 */
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { optionalAuth, requireAuth, requireSellerOrAdmin } = require('../middleware/auth');
const { validateProduct, validateProductId } = require('../middleware/validation');

router.get('/categories', optionalAuth, productController.getCategories);
router.get('/', optionalAuth, productController.listProducts);
router.get('/:productId', optionalAuth, validateProductId, productController.getProduct);

// Only seller or admin can create/update/delete products
router.post('/', requireAuth, requireSellerOrAdmin, validateProduct, productController.createProduct);
router.patch('/:productId', requireAuth, requireSellerOrAdmin, validateProductId, productController.updateProduct);
router.delete('/:productId', requireAuth, requireSellerOrAdmin, validateProductId, productController.deleteProduct);

module.exports = router;