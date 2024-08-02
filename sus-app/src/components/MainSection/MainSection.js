import React from "react";
import project2 from '../../assets/project2.jpg'
import icon from "../../assets/icon.png";
import handleaf from "../../assets/hand-leaf.png";
import headerleaf from "../../assets/header-leaf.png"
import './MainSection.css';


function MainSection() {
  return (
    <>
      <div className="container-context">
        <div className="bgimg">
          <img src={project2} alt="" className="bg-img" />
        </div>
        <div className="container-context-item">
          <p className="heading-first"> 
            Environmental Sustainable <br /> <span className="sub-heading-first">Forever Green Future </span> </p>
          <p className="sub-heading">
            At Sustainable Connect we are dedicated to committing to
            environmental sustainability, paving the way for a lasting green
            future. Our mission is to pioneer innovative sustainable solutions
            that contribute to a perpetually green tomorrow, ensuring a
            harmonious balance between progress and planet Earth. Join us in
            shaping a brighter, greener future for generations to come.
          </p>

          <hr />
          <div className="main-menu">
            <img src={icon} alt="" />
            <p> Discover Sustainable Treasures</p>
            <img src={handleaf} alt="" className="handleaf-img"/>
            <p>Find Your Green Hub</p>
          </div>
          <hr />
        </div>
        <div>
            <img src={headerleaf} alt="" srcset="" />
        </div>
      </div>
    </>
  );
}

export default MainSection;
