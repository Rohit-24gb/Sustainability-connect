const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for recyclable items
const recyclableItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String } 
}, {
  timestamps: true 
});

// Create a model based on the schema
const RecyclableItem = mongoose.model('RecyclableItem', recyclableItemSchema);

module.exports = RecyclableItem;
