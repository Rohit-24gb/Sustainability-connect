const express = require('express');
const router = express.Router();
const RecyclingCenterController = require('../controllers/recyclingCenterController');
const { authenticate, requireRole } = require('../middleware/auth');

const adminOnly = [authenticate, requireRole('admin', 'seller')];

// Define routes and link them to controller functions
router.get('/', RecyclingCenterController.getAllRecyclingCenters);
router.get('/centreID/:centreID', RecyclingCenterController.getRecyclingCenterByCentreID); // Add this line
router.get('/:id', RecyclingCenterController.getRecyclingCenterById);

router.post('/', adminOnly, RecyclingCenterController.createRecyclingCenter);
router.put('/:id', adminOnly, RecyclingCenterController.updateRecyclingCenter);
router.delete('/:id', adminOnly, RecyclingCenterController.deleteRecyclingCenter);

module.exports = router;
