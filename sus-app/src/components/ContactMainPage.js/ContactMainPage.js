import React from 'react';
import './ContactMainPage.css'; // Import the CSS file for styling
import process_thumb from '../../assets/process-thumb.jpg'

const ContactMainPage = () => {
  return (
    <div className="environmental-card">
      <div className="image-container">
        <img 
          src={process_thumb} // Replace with the actual image path
          alt="Plant in hands" 
          className="environmental-image" 
        />
      </div>
      <div className="content-container">
        <h2 className="contact-us">Contact us</h2>
        <h3 className="title">Fresh Environmental<br />Plant & Safe Trees</h3>
        <p className="description">
          Competently cultivate worldwide e-tailers through principle-centered value.
          Professionally engineer high-payoff deliverables without exceptional processes.
          Rapidiously network cost effective portals.
        </p>
        <button className="contact-button">Contact Us</button>
      </div>
    </div>
  );
};

export default ContactMainPage;
