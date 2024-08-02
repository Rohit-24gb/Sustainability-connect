const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  productID: { type: Number, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  categoryID: { type: Number, required: true },
  image_url: [String] 
});

// Create and export the model
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
 