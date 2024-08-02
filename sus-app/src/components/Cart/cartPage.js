import './Cart.css';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        toast.error('Please log in to view cart items');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://sustainability-connect-backend.onrender.com/api/cart/verify/${user._id}`);
        const data = await response.json();
        console.log('Cart data:', data);
        if (response.ok) {
          setCartItems(data.cart.items || []);
        } else {
          toast.error('Failed to fetch cart items');
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Error fetching cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const createRazorpayOrder = async (amount) => {
    const data = JSON.stringify({
      amount: amount * 100,
      currency: "INR",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://sustainability-connect-backend.onrender.com/payment/orders`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    try {
      const response = await axios.request(config);
      console.log(response.data);
      handleRazorpayScreen(response.data);
    } catch (error) {
      console.log("Error at", error);
      toast.error('Error creating Razorpay order');
    }
  };

  const handleRazorpayScreen = async (orderData) => {
    const res = await loadScript(`https://checkout.razorpay.com/v1/checkout.js`);

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const options = {
      key: "rzp_test_g7C8UJjqob4MJj",
      amount: orderData.amount,
      currency: 'INR',
      name: "Sustainability Connect",
      description: "Payment Page",
      image: "path/to/your/image.png",
      order_id: orderData.order_id,
      handler: async function (response) {
        const paymentDetails = {
          paymentId: response.razorpay_payment_id,
          orderId: orderData.order_id,
          userId: JSON.parse(localStorage.getItem('user'))._id,
          cartItems: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: calculateTotalAmount()
        };

        try {
          await axios.post(`https://sustainability-connect-backend.onrender.com/payment/payment/complete`, paymentDetails);
          localStorage.setItem('onComplete', JSON.stringify(response));
          toast.success('Payment successful and order saved!');
          navigate('/success');
        } catch (error) {
          console.error("Error saving payment details:", error);
          toast.error('Failed to save payment details');
        }
      },
      prefill: {
        name: "Sustainability Connect",
        email: "sustainabilityconnect.bpl@gmail.com",
      },
      theme: {
        color: "#1ec734",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleCheckout = () => {
    const totalAmount = calculateTotalAmount();
    toast.success('Proceeding to checkout...');
    createRazorpayOrder(totalAmount);
  };

  const handleRemoveFromCart = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.error('Please log in to remove items from the cart');
      return;
    }

    const requestBody = { userId: user._id, productId };

    try {
      const response = await fetch(`https://sustainability-connect-backend.onrender.com/api/cart/remove`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.productId !== productId));
        toast.success('Item removed from cart');
      } else {
        console.error('Error removing item from cart');
        toast.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Error removing item from cart');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {cartItems.map(item => (
              <li key={item.productId} className="cart-item">
                <img src={item.imageUrl} alt={item.productName} />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.productName}</div>
                  <div className="cart-item-quantity">Quantity: {item.quantity}</div>
                  <div className="cart-item-price">Price: ${item.price} each</div>
                </div>
                <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total Amount: ${calculateTotalAmount()}</h3>
          </div>
          <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;




// import './Cart.css';
// import React, { useEffect, useState } from 'react';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       const user = JSON.parse(localStorage.getItem('user'));

//       if (!user) {
//         toast.error('Please log in to view cart items');
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch(`https://sustainability-connect-backend.onrender.com/api/cart/verify/${user._id}`);
//         const data = await response.json();
//         console.log('Cart data:', data);
//         if (response.ok) {
//           setCartItems(data.cart.items || []);
//         } else {
//           toast.error('Failed to fetch cart items');
//         }
//       } catch (error) {
//         toast.error('Error fetching cart items');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   const calculateTotalAmount = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//   };

//   const loadScript = (src) => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = src;

//       script.onload = () => {
//         resolve(true);
//       };

//       script.onerror = () => {
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const createRazorpayOrder = async (amount) => {
//     const data = JSON.stringify({
//       amount: amount * 100,
//       currency: "INR",
//     });

//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `https://sustainability-connect-backend.onrender.com/payment/orders`,
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       data: data
//     };

//     try {
//       const response = await axios.request(config);
//       console.log(response.data);
//       handleRazorpayScreen(response.data);
//     } catch (error) {
//       console.log("Error at", error);
//     }
//   };

//   const handleRazorpayScreen = async (orderData) => {
//     const res = await loadScript(`https://checkout.razorpay.com/v1/checkout.js`);

//     if (!res) {
//       alert("Razorpay SDK failed to load. Are you online?");
//       return;
//     }

//     const options = {
//       key: "rzp_test_g7C8UJjqob4MJj",
//       amount: orderData.amount,
//       currency: 'INR',
//       name: "Sustainability Connect",
//       description: "Payment Page",
//       image: "path/to/your/image.png",
//       order_id: orderData.order_id,
//       handler: async function (response) {
//         const paymentDetails = {
//           paymentId: response.razorpay_payment_id,
//           orderId: orderData.order_id,
//           userId: JSON.parse(localStorage.getItem('user'))._id,
//           cartItems: cartItems.map(item => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             price: item.price
//           })),
//           totalAmount: calculateTotalAmount()
//         };

//         try {
//           await axios.post(`https://sustainability-connect-backend.onrender.com/payment/payment/complete`, paymentDetails);
//           localStorage.setItem('onComplete', JSON.stringify(response));
//           toast.success('Payment successful and order saved!');
//           navigate('/success');
//         } catch (error) {
//           console.error("Error saving payment details:", error);
//           toast.error('Failed to save payment details');
//         }
//       },
//       prefill: {
//         name: "Sustainability Connect",
//         email: "sustainabilityconnect.bpl@gmail.com",
//       },
//       theme: {
//         color: "#1ec734",
//       },
//     };

//     const paymentObject = new window.Razorpay(options);
//     paymentObject.open();
//   };

//   const handleCheckout = () => {
//     const totalAmount = calculateTotalAmount();
//     toast.success('Proceeding to checkout...');
//     createRazorpayOrder(totalAmount);
//   };

//   const handleRemoveFromCart = async (productId) => {
//     const user = JSON.parse(localStorage.getItem('user'));

//     if (!user) {
//       toast.error('Please log in to remove items from the cart');
//       return;
//     }

//     const requestBody = { userId: user._id, productId };

//     try {
//       const response = await fetch(`https://sustainability-connect-backend.onrender.com/api/cart/remove`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody)
//       });

//       if (response.ok) {
//         setCartItems(cartItems.filter(item => item.productId !== productId));
//         toast.success('Item removed from cart');
//       } else {
//         console.error('Error removing item from cart');
//         toast.error('Failed to remove item from cart');
//       }
//     } catch (error) {
//       console.error('Error removing item from cart:', error);
//       toast.error('Error removing item from cart');
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="cart-container">
//       <h2>Your Cart</h2>
//       {cartItems.length === 0 ? (
//         <p>Your cart is empty</p>
//       ) : (
//         <>
//           <ul>
//             {cartItems.map(item => (
//               <li key={item.productId} className="cart-item">
//                 <img src={item.imageUrl} alt={item.productName} />
//                 <div className="cart-item-details">
//                   <div className="cart-item-name">{item.productName}</div>
//                   <div className="cart-item-quantity">Quantity: {item.quantity}</div>
//                   <div className="cart-item-price">Price: ${item.price} each</div>
//                 </div>
//                 <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//           <div className="cart-total">
//             <h3>Total Amount: ${calculateTotalAmount()}</h3>
//           </div>
//           <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
//         </>
//       )}
//       <ToastContainer />
//     </div>
//   );
// };

// export default Cart;


