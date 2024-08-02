const Pickup = require('../models/Pickup');

exports.schedulePickup = async (req, res) => {
  try {
    const pickup = new Pickup(req.body);
    await pickup.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving pickup:', error);
    res.status(500).json({ success: false, error: 'Failed to save pickup' });
  }
};
