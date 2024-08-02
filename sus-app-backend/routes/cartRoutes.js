const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
console.log(cartController);


// Define routes for cart functionality
router.post('/add', cartController.add);
router.delete('/remove', cartController.remove);
router.get('/verify/:userId', cartController.verifyByUserId)

module.exports = router;
