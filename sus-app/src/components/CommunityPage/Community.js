import React from "react";
import SeriesCard from "./SeriesCard";
import dataset from "../../data/dataset.json";
import './Community.css'

function SeriesGrid() {


    return (
      <> 

      <div className="community-center">
      <div className="article">
          <h1>All Blog Article</h1>

        </div>
        <div className="community-blog">
            {dataset.map((curElem)=> (
         <SeriesCard key={curElem.id} data={curElem}/>))}
        </div>
      </div>
        
        </>
    );
}

export default SeriesGrid;










// import React from "react";
// import evmotor from "../assets/evmotor.jpg"
// import nopoverty from "../assets/nopoverty.jpeg"
// // import zerohunger from "../assets/zerohunger.jpeg"
// import goodhealth from "../assets/goodhealth.jpeg"
// import nature from "../assets/nature.jpg"

// // import db from "../api/db"
// import dataset from "../api/dataset.json"
// import SeriesCard from "../Component/list"


// function Community() {
//   return (
//     <>
    
//        {dataset.map((curElem)=> (
//          <SeriesCard key={curElem.id} data={curElem}/>
//         ))}
//     </>
//   );
// }

// export default Community;