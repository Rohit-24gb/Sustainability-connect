import React from 'react';
import './NavStyle.css';
import mail from '../../assets/mail.png';
import mapPin from '../../assets/map_pin.png';
import call from '../../assets/phone.png';
import facebook from '../../assets/fb_icon.png';
import instagram from '../../assets/ig_icon.png';
import twitter from '../../assets/x_icon.png';

const Nav = () => {
  return (
    <div className='nav'>
      <div className='nav-left'>
        <div className='nav-item'>
          <img src={mail} alt='Mail Icon' className='icon' /> sustainabilityconnect.bpl@gmail.com
        </div>
        <div className='nav-item'>
          <img src={mapPin} alt='Map Pin Icon' className='icon' /> Bhopal, M.P.
        </div>
        <div className='nav-item'>
          <img src={call} alt='Call Icon' className='icon' /> +91 999-999-9999
        </div>
      </div>
      <div className='nav-right'>
        <span>Follow us on</span>
        <div className='nav-item'>
          <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
            <img src={facebook} alt='Facebook' className='icon' />
          </a>
        </div>
        <div className='nav-item'>
          <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
            <img src={instagram} alt='Instagram' className='icon' />
          </a>
        </div>
        <div className='nav-item'>
          <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
            <img src={twitter} alt='Twitter' className='icon' />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Nav;
