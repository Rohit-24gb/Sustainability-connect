import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './MyOrder.css';
import { API_BASE_URL, getAuthHeaders } from "../../config/api";

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
        const response = await fetch(`${API_BASE_URL}/orders/${user._id}`, {
          headers: getAuthHeaders()
        });
        const data = await response.json();

        if (response.ok) {
          setOrders(Array.isArray(data) ? data : []);
        } else {
          toast.error(data.message || 'Failed to fetch orders');
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
                {(order.items || []).map((item, index) => (
                  <li key={item.productId?._id || item.productId || index}>
                    <div className="product-name">
                      Product Name: {item.productId?.name || 'Product unavailable'}
                    </div>
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
    </div>
  );
};

export default MyOrders;
