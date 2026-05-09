const express = require('express');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const dotenv = require('dotenv')
dotenv.config();
const validate = require('../middleware/validate');
const { paymentOrderSchema, paymentCompleteSchema } = require('../validators/commonValidators');
const { recordInteraction } = require('../utlis/interactionTracker');
const { authenticate, requireBodySelfOrRole } = require('../middleware/auth');

const router = express.Router();

router.post('/orders', authenticate, validate(paymentOrderSchema), async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
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
    res.status(500).json({ success: false, message: "Failed to create payment order" });
  }
});

router.post('/payment/complete', authenticate, validate(paymentCompleteSchema), requireBodySelfOrRole('userId', 'admin', 'seller'), async (req, res) => {
    const { paymentId, orderId, userId, cartItems, totalAmount } = req.body;
  
    try {
      const productIds = cartItems.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } }).select("_id price");
      const priceById = new Map(products.map((product) => [product._id.toString(), product.price]));

      if (products.length !== productIds.length) {
        return res.status(400).json({ success: false, message: "One or more cart products are invalid" });
      }

      const normalizedItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: priceById.get(item.productId)
      }));
      const calculatedTotal = normalizedItems.reduce((total, item) => total + item.price * item.quantity, 0);

      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        return res.status(400).json({ success: false, message: "Cart total does not match product prices" });
      }

      const newOrder = new Order({
        userId: userId,
        items: normalizedItems,
        totalAmount: calculatedTotal,
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

      await Promise.all(normalizedItems.map((item) => recordInteraction({
        userId,
        productId: item.productId,
        eventType: 'purchase',
        sessionId: req.body.sessionId || req.headers['x-session-id'] || `server-${userId}`,
        metadata: {
          orderId: savedOrder._id,
          paymentId: savedPayment.paymentId,
          quantity: item.quantity,
          price: item.price
        }
      })));
  
      res.status(200).json({ success: true, message: "Payment and order saved successfully" });
    } catch (error) {
      console.error("Error details:", error);
      res.status(500).json({ success: false, message: "Failed to save payment and order", error: error.message });
    }
  });
  
  

module.exports = router;
