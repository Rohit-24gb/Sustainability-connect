const express = require('express');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const router = express.Router();

router.post('/orders', async (req, res) => {
  const razorpay = new Razorpay({
    key_id: "rzp_test_g7C8UJjqob4MJj",
    key_secret: "knsjei5gWqtqJBHSGrHt1v7y"
  });

  const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.post('/payment/complete', async (req, res) => {
    const { paymentId, orderId, userId, cartItems, totalAmount } = req.body;
  
    try {
      const newOrder = new Order({
        userId: userId,
        items: cartItems,
        totalAmount: totalAmount,
      });
  
      const savedOrder = await newOrder.save();
  
      const newPayment = new Payment({
        userId: userId,
        orderId: savedOrder._id,
        paymentId: paymentId,
        amount: totalAmount,
        currency: "INR",
        status: "Completed"
      });
  
      const savedPayment = await newPayment.save();
  
      res.status(200).json({ message: "Payment and order saved successfully" });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ message: "Failed to save payment and order", error: error.message });
    }
  });
  
  

module.exports = router;