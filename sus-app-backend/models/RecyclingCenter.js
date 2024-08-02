const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecyclingCenterSchema = new Schema(
  {
    centreID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone_no: { type: String }, 
    email: { type: String, required: false }, 
    website: { type: String },
    dist: { type: String, required: false },
    state: { type: String, required: true },
    country: { type: String, required: false }, 
    pincode: { type: String }, 
    city: { type: String, required: false } 
  },
  { timestamps: true }
);

const RecyclingCenter = mongoose.model("RecyclingCenter", RecyclingCenterSchema);
module.exports = RecyclingCenter;
