import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';

const Item = ({ id, name, image_url, price, onClick }) => {
  return (
    <div className="item" onClick={onClick}>
      <Link to={`/product/${id}`} onClick={(e) => e.stopPropagation()}>
        <img src={image_url} alt={name} />
      </Link>
      <p>{name}</p>
      <div className="item-price">
        <div className="item-price-new">
          ${price}
        </div>
      </div>
    </div>
  );
};

export default Item;
