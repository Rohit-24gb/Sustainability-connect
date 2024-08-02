const express = require('express');
const router = express.Router();
const RecyclableItemController = require('../controllers/recyclableItemsController'); 

// Get all recyclable items
router.get('/', RecyclableItemController.getAllItems);

// Get recyclable item by ID
router.get('/:id', RecyclableItemController.getItemById);

// Create a new recyclable item
router.post('/', RecyclableItemController.createItem);

// Update a recyclable item
router.put('/:id', RecyclableItemController.updateItem);

// Delete a recyclable item
router.delete('/:id', RecyclableItemController.deleteItem);

module.exports = router;
