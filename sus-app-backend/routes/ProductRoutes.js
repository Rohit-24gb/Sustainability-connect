const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../validators/commonValidators');

const adminOnly = [authenticate, requireRole('admin', 'seller')];

// Route to create a new product
router.post('/', adminOnly, validate(productSchema), ProductController.createProduct);

// Route to get all products
router.get('/', ProductController.getAllProducts);

router.get('/search', ProductController.searchProducts);

router.get('/productID/:productID', ProductController.getProductByProductID);

// Route to get products by category
router.get('/category/:categoryID', ProductController.getProductsByCategory);

//by id
router.get('/:productID', ProductController.getProductById);

// Route to update a product by ID
router.put('/:id', adminOnly, ProductController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', adminOnly, ProductController.deleteProduct);

module.exports = router;
