import React from "react";
// import savetree from "../../assets/savetree.jpg";
import leaf from "../../assets/small_leaf.png";
import "./OurServices.css";
import RecyleWithEase from '../../assets/recycle-with-ease.jpg'
import SustainableShoppingMadeEasy from '../../assets/Sustainable-Shopping-Made-Easy.jpg';
import ConnectandShare from '../../assets/Connect-and-Share.jpg'

const OurServices = () => {
  return (
    <>
      <div className="ourservicesbg">
        <div className="ourservice-content">
          <div className="ourserviceimgheader">
            <img src={leaf} alt="" srcset="" />
            <h2>Our Services</h2>
          </div>
          <h1>Provide Environment Best Eco - friendly Solutions</h1>
        </div>

        <div className="ourserviceflex-item">
          <div className="ourservice-product">
            <img src={RecyleWithEase} alt="" srcset="" />
            <p>Recyle With Ease</p>
          </div>

          <div className="ourservice-product">
            <img src={SustainableShoppingMadeEasy} alt="" srcset="" />
            <p>Sustainable Shopping Made Easy</p>
          </div>

          <div className="ourservice-product">
            <img src={ConnectandShare} alt="" srcset="" />
            <p>Connect and Share</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurServices;
