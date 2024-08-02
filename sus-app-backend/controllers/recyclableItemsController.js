const RecyclableItem = require('../models/RecyclableItem');

// Get all recyclable items
exports.getAllItems = async (req, res) => {
  try {
    const items = await RecyclableItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

// Get a single recyclable item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await RecyclableItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
};

// Create a new recyclable item
exports.createItem = async (req, res) => {
  try {
    const newItem = new RecyclableItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: 'Error creating item', error });
  }
};

// Update a recyclable item by ID
exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await RecyclableItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: 'Error updating item', error });
  }
};

// Delete a recyclable item by ID
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await RecyclableItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};
