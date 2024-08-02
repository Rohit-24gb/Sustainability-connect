const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  center: String,
  pincode: String,
  contact: String,
  wasteType: String,
  date: String,
});

const Pickup = mongoose.model('Pickup', PickupSchema);
module.exports = Pickup;
