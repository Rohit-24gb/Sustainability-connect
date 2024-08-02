const express = require('express');
const router = express.Router();
const RecyclingCenterController = require('../controllers/recyclingCenterController');

// Define routes and link them to controller functions
router.get('/', RecyclingCenterController.getAllRecyclingCenters);
router.get('/:id', RecyclingCenterController.getRecyclingCenterById);
router.get('/centreID/:centreID', RecyclingCenterController.getRecyclingCenterByCentreID); // Add this line

router.post('/', RecyclingCenterController.createRecyclingCenter);
router.put('/:id', RecyclingCenterController.updateRecyclingCenter);
router.delete('/:id', RecyclingCenterController.deleteRecyclingCenter);

module.exports = router;
