const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const validate = require('../middleware/validate');
const { cartAddSchema, cartRemoveSchema } = require('../validators/commonValidators');
const { authenticate, requireBodySelfOrRole, requireSelfOrRole } = require('../middleware/auth');


// Define routes for cart functionality
router.post('/add', authenticate, validate(cartAddSchema), requireBodySelfOrRole('userId', 'admin', 'seller'), cartController.add);
router.delete('/remove', authenticate, validate(cartRemoveSchema), requireBodySelfOrRole('userId', 'admin', 'seller'), cartController.remove);
router.get('/verify/:userId', authenticate, requireSelfOrRole('userId', 'admin', 'seller'), cartController.verifyByUserId)

module.exports = router;
