import React from 'react';
import './MarqueeWithImages.css';
import rotateImage from '../../assets/text-shape-leaf.png';

const MarqueeWithImages = ({ texts, delay = 1000 }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-content" style={{ animationDelay: `${delay}ms` }}>
        {texts.map((text, index) => (
          <div className="marquee-item" key={index}>
            {text}
            <img src={rotateImage} alt="Rotating Icon" className="rotating-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarqueeWithImages;
