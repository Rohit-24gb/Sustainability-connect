const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Product schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  productID: { type: Number, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  categoryID: { type: Number, required: true },
  image_url: [String],
  ecoScore: { type: Number, min: 0, max: 100, default: 50 },
  carbonKgCO2e: { type: Number, min: 0, default: 1.5 },
  materials: [{ type: String, trim: true }],
  packagingType: { type: String, trim: true, default: "standard" },
  recyclable: { type: Boolean, default: false },
  durabilityScore: { type: Number, min: 0, max: 100, default: 50 },
  certifications: [{ type: String, trim: true }],
  impactExplanation: { type: String, default: "" }
});

// Create and export the model
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
