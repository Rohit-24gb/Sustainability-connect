// ReviewCarousel.js
import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import avatar from '../../assets/avatar.png'

const reviews = [
  { avatar: {avatar}, name: 'John Doe', review: 'Great service!' },
  { avatar: {avatar}, name: 'Jane Smith', review: 'Excellent quality!' },
  // Add more reviews here
];

const ReviewCarousel = () => (
  <Carousel
    swipeable={true}
    draggable={true}
    showDots={true}
    responsive={{
      superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
      desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2 },
      tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
      mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    }}
  >
    {reviews.map((review, index) => (
      <div key={index} className='review-item'>
        <img src={review.avatar} alt={review.name} className='avatar' />
        <p className='name'>{review.name}</p>
        <p className='review'>{review.review}</p>
      </div>
    ))}
  </Carousel>
);

export default ReviewCarousel;
