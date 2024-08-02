import React from "react";
import process_thumb from "../../assets/process-thumb.jpg";
import leaf2 from "../../assets/leaf2.png";
import process_shape from "../../assets/brand-shape.png";
import img3 from "../../assets/leaf3.png"

import "./Contact.css";

const Contact1 = () => {
   return (
      <div className="row">
         <div className="left-image">
            <img src={process_thumb} className="img2" alt="Contact Us" />
         </div>
         <div className="right-image">
            <div className="conus">
               <p className="p">
                  <span>
                     <img id="leaf" src={leaf2} alt="leaf2" />
                  </span>
                  Contact Us
               </p>
            </div>
            <div className="titletext">
               <span><img src={process_shape} alt="img"></img></span>
               <p className="p1">

                  <span className="line11">Fresh Environmental</span>
                  <span className="line22">plant & Safe Trees</span>
               </p>
            </div>
            <div className="subtitle">
               <p className="p3">Competently cultivate worldwide e-tailers through</p>
               <p className="p3">principle-centered value professionally engineer</p>
               <p className="p3">high-payoff deliverable without exceptional processes</p>
               <p className="p3">Rapidiously network cost-effective vortals.</p>
            </div>

            <div className="btn">Contact Us</div>
         </div>
         <div className="img3">
            <span> <img src={img3} alt="img" /></span>


         </div>

      </div>

   );
};

export default Contact1;
