import React from 'react';
import './PopularItems.css';

const PopularItems = ({ products, addToCart }) => {
  return (
    <div className="popular-items">
      <h2>Popular Items</h2>
      <div className="popular-items-grid">
        {products.map(product => (
          <div className="popular-item-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularItems;
