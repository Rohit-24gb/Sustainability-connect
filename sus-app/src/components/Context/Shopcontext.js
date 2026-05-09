import { API_BASE_URL, getAuthHeaders } from "../../config/api";
import { getSessionId } from "../../config/tracking";
// src/Context/Shopcontext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Shopcontext = createContext(null);

const ShopcontextProvider = (props) => {
  // const url = 'http://localhost:4000'
  const [cartItems, setCartItems] = useState({});
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCartItems = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        setCartItems({});
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/verify/${user._id}`, {
          headers: getAuthHeaders()
        });
        const nextCart = {};

        (response.data.cart?.items || []).forEach((item) => {
          nextCart[item.productId] = item.quantity;
        });

        setCartItems(nextCart);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.error("Please log in to add items to cart");
      return;
    }

    try {
      setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

      await axios.post(`${API_BASE_URL}/api/cart/add`, {
        userId: user._id,
        productId: itemId,
        quantity: 1,
        sessionId: getSessionId()
      }, {
        headers: getAuthHeaders()
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      console.error("Please log in to remove items from cart");
      return;
    }

    try {
      setCartItems((prev) => {
        const newCart = { ...prev };
        if (newCart[itemId] > 1) {
          newCart[itemId] -= 1;
        } else {
          delete newCart[itemId];
        }
        return newCart;
      });

      await axios.delete(`${API_BASE_URL}/api/cart/remove`, {
        headers: getAuthHeaders(),
        data: {
          userId: user._id,
          productId: itemId,
          sessionId: getSessionId()
        }
      });
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = allProducts.find((product) => product._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0);
  };

  const contextValue = {
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
  };

  return (
    <Shopcontext.Provider value={contextValue}>
      {props.children}
    </Shopcontext.Provider>
  );
};

export default ShopcontextProvider;
