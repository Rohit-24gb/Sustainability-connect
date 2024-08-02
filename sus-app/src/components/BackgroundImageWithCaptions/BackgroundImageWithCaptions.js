import React from 'react';
import './BackgroundImageWithCaptions.css';

const BackgroundImageWithCaptions = ({ imageSrc, title, text }) => {
  return (
    <div className="background-image">
      <img src={imageSrc} alt="Background" />
      <div className="caption-container">
        <h1 className="caption-title">{title}</h1>
        <p className="caption-text">{text}</p>
      </div>
    </div>
  );
}

export default BackgroundImageWithCaptions;
