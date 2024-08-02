import React from 'react';
import './Footer.css';
import fbIcon from '../../assets/fb_icon.png';  // Adjust the path as necessary
import instaIcon from '../../assets/ig_icon.png';  // Adjust the path as necessary
import twitterIcon from '../../assets/x_icon.png';  // Adjust the path as necessary
import phone from '../../assets/phone.png';
import mail from '../../assets/mail.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-social">
        <div className="social-content">
          <h2>Stay with us On Social</h2>
          <div className="social-icons">
            <span>Follow Us :</span>
            <img src={fbIcon} alt="Facebook" className="social-icon" />
            <img src={instaIcon} alt="Instagram" className="social-icon" />
            <img src={twitterIcon} alt="Twitter" className="social-icon" />
          </div>
        </div>
      </div>
      <div className="footer-content">
        <div className="footer-column">
          <h3>Sustainability Connect</h3>
          <p>Contact</p>
          <p><img src={phone} alt="Facebook" className="social-icon" />+123 (4567) 890</p>
          <p><img src={mail} alt="Facebook" className="social-icon" />example@gmail.com</p>
        </div>
        <div className="footer-column">
          <h3>Company</h3>
          <p>Home</p>
          <p>About Us</p>
          <p>Our Services</p>
          <p>Latest Blog</p>
        </div>
        <div className="footer-column">
          <h3>Quick Links</h3>
          <p>Recycling Center</p>
          <p>Testimonials</p>
          <p>Products</p>
          <p>Contact us</p>
        </div>
        <div className="footer-column">
          <h3>Subscribe</h3>
          <p>Subscribe our Newsletter</p>
          <input type="email" placeholder="Enter E-mail" />
          <button>Subscribe</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
