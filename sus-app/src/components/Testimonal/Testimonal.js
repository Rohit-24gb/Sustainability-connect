import React from 'react';
import './Testimonal.css';
import backgroundImageLeft from '../../assets/backtestimonal.jpg';
import overlayImage from '../../assets/testimonial-circle.png';
import backgroundImageRight from '../../assets/dot-background.jpg';
import icon from '../../assets/icon.png';
import ReviewCarousel from '../ReviewCarousel/ReviewCarousel'; // Import your carousel component here

const ReviewSection = () => {
  return (
    <div className='review-section'>
      <div className='left-side'>
        <div className='background-image'>
          <img src={backgroundImageLeft} alt='Background' />
          <div className='overlay-image'>
            <img src={overlayImage} alt='Overlay' />
          </div>
        </div>
      </div>
      <div className='right-side'>
        <div className='background-image'>
          <img src={backgroundImageRight} alt='Background' />
        </div>
        <div className='text-content'>
          <h1>
            <img src={icon} alt='Icon' className='icon' />
            Title Here
          </h1>
          <h2>Subtitle Here</h2>
          <ReviewCarousel />
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;
