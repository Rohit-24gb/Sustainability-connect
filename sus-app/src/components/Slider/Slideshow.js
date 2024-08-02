import React from 'react';
import './Slider.css';
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.jpg';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const fadeImages = [
  {
    url: slide1, 
    caption: 'Navigate Green Living: Your Sustainable Product Guide'
  },
  {
    url: slide2, 
    caption: 'From Waste to Worth: Recycle for a Better Earth'
  }  
];

const Slideshow = () => {
  return (
    <div className="slide-container">
      <Fade
        duration={2000}  // Change images every 2 seconds
        transitionDuration={700} // Duration of the transition between images
        indicators={true}  // Enable dot navigation
      >
        {fadeImages.map((fadeImage, index) => (
          <div key={index} className="slide">
            <img src={fadeImage.url} alt={`Slide ${index + 1}`} />
            <div className="text-overlay">
              <div className="common-text">
                <div className="line1">Save Environment Save Future</div>
                <div className="line2">
                <span>Keep your</span>
                <span>World Sustainable</span>
                </div>
              </div>
              <div className="slide-text">
                <p>{fadeImage.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </Fade>
    </div>
  )
}

export default Slideshow;
