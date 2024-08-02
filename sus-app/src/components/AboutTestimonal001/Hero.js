

import React from 'react';
import circle from '../../assets/team.png';
import star from '../../assets/circle.png';
import team from '../../assets/star (1).png';

import './Hero.css';

const Hero = () => {
  return (
    <div className='hero-container'>
      <div className='hero-background'>
        <div className='stats-container'>
          <div className='stat-item'>
            <img src={circle} alt='Team Members' />
            <span>100+ Team Members</span>
          </div>
          <div className='stat-item'>
            <img src={star} alt='Complete Works' />
            <span>960+ Complete Works</span>
          </div>
          <div className='stat-item'>
            <img src={team} alt='Average Ratings' />
            <span>4.7 Avg Ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
