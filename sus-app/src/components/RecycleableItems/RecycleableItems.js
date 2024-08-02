import React, { useState, useEffect } from 'react';
import './RecycleableItems.css';

const RecyclableItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recyclable-items`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching recyclable items:', error);
      }
    };

    fetchData();
  }, []); 

  return (
    <div className="section items-container">
      <h2>Popularly Recyclable Items</h2>
      <div className="items">
        <div className="items-content">
          {items.map(item => (
            <div key={item.id} className="item-card">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecyclableItems;


