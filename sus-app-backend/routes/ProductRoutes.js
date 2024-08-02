const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Route to create a new product
router.post('/', ProductController.createProduct);

// Route to get all products
router.get('/', ProductController.getAllProducts);

//by id
router.get('/:productID', ProductController.getProductById)


router.get('/productID/:productID', ProductController.getProductByProductID);



// Route to get products by category
router.get('/category/:categoryID', ProductController.getProductsByCategory);

// Route to update a product by ID
router.put('/:id', ProductController.updateProduct);

// Route to delete a product by ID
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
