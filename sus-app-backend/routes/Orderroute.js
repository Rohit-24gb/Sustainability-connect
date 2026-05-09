// routes/Orders.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { authenticate, requireSelfOrRole } = require('../middleware/auth');

router.get('/:userId', authenticate, requireSelfOrRole('userId', 'admin', 'seller'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database is not connected yet' });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const orders = await Order.find({ userId: req.params.userId })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name'
      });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;
