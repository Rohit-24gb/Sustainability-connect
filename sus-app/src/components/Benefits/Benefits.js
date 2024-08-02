import React, { useState } from 'react';
import benefits from '../../data/benefits.json';
import './Benefits.css';

const Benefits = () => {
  const [visibleBenefits, setVisibleBenefits] = useState(5);
  const [showAll, setShowAll] = useState(false);

  const toggleBenefits = () => {
    if (showAll) {
      setVisibleBenefits(5);
    } else {
      setVisibleBenefits(benefits.length);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="section benefits-container">
      <h2>Benefits of Recycling</h2>
      <div className="benefits">
        {benefits.slice(0, visibleBenefits).map(benefit => (
          <div key={benefit.id} className="benefit-card">
            <img src={benefit.image} alt={benefit.name} />
            <h3>{benefit.name}</h3>
            <p>{benefit.description}</p>
          </div>
        ))}
      </div>
      <button onClick={toggleBenefits} className="toggle-btn">
        {showAll ? 'Less' : 'More'}
      </button>
    </div>
  );
};

export default Benefits;
