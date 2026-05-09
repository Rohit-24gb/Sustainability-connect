const express = require('express');
const router = express.Router();
const RecyclableItemController = require('../controllers/recyclableItemsController'); 
const { authenticate, requireRole } = require('../middleware/auth');

const adminOnly = [authenticate, requireRole('admin', 'seller')];

// Get all recyclable items
router.get('/', RecyclableItemController.getAllItems);

// Get recyclable item by ID
router.get('/:id', RecyclableItemController.getItemById);

// Create a new recyclable item
router.post('/', adminOnly, RecyclableItemController.createItem);

// Update a recyclable item
router.put('/:id', adminOnly, RecyclableItemController.updateItem);

// Delete a recyclable item
router.delete('/:id', adminOnly, RecyclableItemController.deleteItem);

module.exports = router;
