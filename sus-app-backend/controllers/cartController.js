const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add item to cart
exports.add = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
};



// /remove
// Remove item from cart
exports.remove = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        if (!userId || !productId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items.splice(itemIndex, 1);
            await cart.save();
            res.status(200).json({ message: 'Item removed from cart' });
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
};




exports.verifyByUserId = async (req, res) => {
  const userId = req.params.userId;
  console.log('Received request to verify cart for userId:', userId);

  try {
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      
      if (!cart) {
          console.log('Cart not found for userId:', userId);
          return res.status(404).json({ message: 'Cart not found' });
      }
      
      if (cart.items.length === 0) {
          console.log('No items found in cart for userId:', userId);
          return res.status(404).json({ message: 'No items found in cart' });
      }

      const products = cart.items.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
          totalPrice: item.quantity * item.productId.price,
          imageUrl: item.productId.image // Ensure this field exists in your Product schema
      }));

      console.log('Cart items:', products);

      res.json({
          cart: {
              userId: cart.userId,
              items: products
          }
      });
  } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Error fetching cart' });
  }
};


///verify/:userId',

// Fetch cart items for a user
// exports.verifyuser =  async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }
        
//         // Format the response to include product details
//         const cartItems = cart.items.map(item => ({
//             productId: item.productId._id,
//             productName: item.productId.name,
//             quantity: item.quantity,
//             price: item.productId.price,
//             totalPrice: item.quantity * item.productId.price,
//             imageUrl: item.productId.image // Ensure this field exists in your Product schema
//         }));

//         res.json({
//             cart: {
//                 userId: cart.userId,
//                 items: cartItems
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching cart:', error);
//         res.status(500).json({ message: 'Error fetching cart' });
//     }
// };
