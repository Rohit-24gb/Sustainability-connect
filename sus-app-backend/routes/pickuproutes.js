const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');

// Define the route for scheduling pickups
router.post('/schedule-pickup', pickupController.schedulePickup);

module.exports = router;
