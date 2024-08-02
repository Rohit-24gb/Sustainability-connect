import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MyOrder.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        toast.error('Please log in to view your orders');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://sustainability-connect-backend.onrender.com/orders/${user._id}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        toast.error('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <div className="order-date">Date: {new Date(order.date).toLocaleDateString()}</div>
              <ul className="order-items">
                {order.items.map(item => (
                  <li key={item.productId._id}>
                    <div className="product-name">Product Name: {item.productId.name}</div>
                    <div className="quantity">Quantity: {item.quantity}</div>
                    <div className="price">Price: ${item.price}</div>
                  </li>
                ))}
              </ul>
              <div className="total-amount">Total Amount: ${order.totalAmount}</div>
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default MyOrders;
