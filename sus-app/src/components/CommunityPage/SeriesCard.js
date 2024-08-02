// SeriesCard.js
import React from "react";
import { Link } from "react-router-dom";

function SeriesCard({ data }) {
  const { id, title, img_url, name, blog_title } = data;
  return (
    <div className="community-page">
      <Link style={{ textDecoration: "none" }} to={`/blog/${id}`}>
        <p className="titleseries">{title}</p>
      
      <img src={img_url} alt="first-img" />
      <p className="Id-name">Posted by: {name}</p>
      </Link>
    </div>
  );
}

export default SeriesCard;