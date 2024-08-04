import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Popular.css'; // Add your CSS styles here

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/products');
        // Limit to the first 8 products
        setProducts(response.data.slice(0, 8));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Popular Products</h2>
      <div className="popular-products-container">
        {products.map(product => (
          <div key={product.productID} className="product-card">
            <Link to={`/product/${product.productID}`}>
              <img src={product.image_url[0]} alt={product.name} className="product-image-popular" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
