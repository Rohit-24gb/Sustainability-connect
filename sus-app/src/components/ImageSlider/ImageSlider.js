import React from 'react';
import Slider from 'react-slick';
import './ImageSlider.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ImageSlider = ({ products }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {products.map(product => (
        <div key={product.id}>
          <img src={product.image} alt={product.name} className="slider-image" />
          <div className="slider-caption">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
