const express = require('express');
const router = express.Router();
const ProductCategoryController = require('../controllers/ProductCategoryController');
const { authenticate, requireRole } = require('../middleware/auth');

const adminOnly = [authenticate, requireRole('admin', 'seller')];

// Create a new product category
router.post('/', adminOnly, ProductCategoryController.createCategory);

// Get all product categories
router.get('/', ProductCategoryController.getAllCategories);

// Update a product category
router.put('/:id', adminOnly, ProductCategoryController.updateCategory);

// Delete a product category
router.delete('/:id', adminOnly, ProductCategoryController.deleteCategory);

module.exports = router;
