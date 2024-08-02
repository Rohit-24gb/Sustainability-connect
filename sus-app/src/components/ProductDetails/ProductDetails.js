import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import { Shopcontext } from '../Context/Shopcontext';
import './ProductDetails.css';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { addToCart } = useContext(Shopcontext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/products/${productID}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productID]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.error('Please log in to add items to the cart');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: product._id, quantity: 1 })
      });

      if (response.ok) {
        toast.success('Item added to cart');
      } else {
        console.error('Error adding item to cart');
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    }
  };

  const handleRemoveFromCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.error('Please log in to remove items from the cart');
      return;
    }

    try {
      const response = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId: product._id })
      });

      if (response.ok) {
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product Not Found</p>;

  const images = Array.isArray(product.images) ? product.images : [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="product-detail-container">
      <div className="product-carousel">
        <Slider {...settings}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Product ${index}`} className="product-carousel-image" />
              </div>
            ))
          ) : (
            <p>No images available</p>
          )}
        </Slider>
      </div>
      <div className="product-detail">
        <h1 className="product-detail-title">{product.name}</h1>
        <p className="product-detail-price">${product.price}</p>
        <p className="product-detail-description">{product.description}</p>
        <div className="button-container">
          <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
          {/* <button className="remove-from-cart-button" onClick={handleRemoveFromCart}>Remove from Cart</button> */}
          <button className="buy-now-button">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;



