import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    console.log('Product clicked:', product.productId);
    navigate(`/product/${product.productID}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img src={product.image_url} alt={product.name} />
      <div className="product-card-content">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">${product.price.toFixed(2)}</p>
        {/* <p className="product-card-description">{product.description}</p> */}
      </div>
    </div>
  );
};

export default ProductCard;


