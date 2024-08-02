const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the ProductCategory schema
const ProductCategorySchema = new Schema({
    category_id: { type: Number, required: true, unique: true },
    category_name: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }] // Reference to Product model
});

// Create and export the model
const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);
module.exports = ProductCategory;
