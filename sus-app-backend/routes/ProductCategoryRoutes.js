const express = require('express');
const router = express.Router();
const ProductCategoryController = require('../controllers/ProductCategoryController');

// Create a new product category
router.post('/', ProductCategoryController.createCategory);

// Get all product categories
router.get('/', ProductCategoryController.getAllCategories);

// Update a product category
router.put('/:id', ProductCategoryController.updateCategory);

// Delete a product category
router.delete('/:id', ProductCategoryController.deleteCategory);

module.exports = router;
