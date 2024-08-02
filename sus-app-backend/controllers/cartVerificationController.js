const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// exports.verifyByUserId = async (req, res) => {
//     const userId = req.params.userId;
//     console.log('Received request to verify cart for userId:', userId);
  
//     try {
//         const cart = await Cart.findOne({ userId }).populate('items.productId');
        
//         if (!cart) {
//             console.log('Cart not found for userId:', userId);
//             return res.status(404).json({ message: 'Cart not found' });
//         }
        
//         if (cart.items.length === 0) {
//             console.log('No items found in cart for userId:', userId);
//             return res.status(404).json({ message: 'No items found in cart' });
//         }
  
//         const products = cart.items.map(item => ({
//             productId: item.productId._id,
//             productName: item.productId.name,
//             quantity: item.quantity,
//             price: item.productId.price,
//             totalPrice: item.quantity * item.productId.price,
//             imageUrl: item.productId.image // Ensure this field exists in your Product schema
//         }));
  
//         console.log('Cart items:', products);
  
//         res.json({
//             cart: {
//                 userId: cart.userId,
//                 items: products
//             }




//         });
//     } catch (error) {
//         console.error('Error fetching cart:', error);
//         res.status(500).json({ message: 'Error fetching cart' });
//     }
// };

module.exports = router;