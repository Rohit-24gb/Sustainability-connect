import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL, getAuthHeaders } from "../../config/api";
import { getSessionId } from "../../config/tracking";
import "./RecommendedProducts.css";

const getProductImage = (product) => {
  if (Array.isArray(product.image_url)) {
    return product.image_url[0];
  }

  return product.image_url;
};

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const url = user?._id
        ? `${API_BASE_URL}/api/recommendations/user/${user._id}?limit=8`
        : `${API_BASE_URL}/api/recommendations/session/${getSessionId()}?limit=8`;

      try {
        const response = await fetch(url, {
          headers: user?._id ? getAuthHeaders() : {}
        });
        const data = await response.json();

        if (response.ok) {
          setRecommendations(data.recommendations || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="recommendations-section">
        <div className="recommendations-header">
          <h2>Recommended for you</h2>
        </div>
        <div className="recommendations-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="recommendation-card recommendation-skeleton" key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <section className="recommendations-section">
      <div className="recommendations-header">
        <h2>Recommended for you</h2>
        <p>Personalized from your product views, cart activity, purchases, and browsing signals.</p>
      </div>

      <div className="recommendations-grid">
        {recommendations.map(({ product, recommendationScore, reasons }) => (
          <Link
            to={`/product/${product.productID}`}
            className="recommendation-card"
            key={product._id}
          >
            {getProductImage(product) && (
              <img src={getProductImage(product)} alt={product.name} />
            )}
            <div className="recommendation-content">
              <div>
                <h3>{product.name}</h3>
                <p className="recommendation-price">Rs. {Number(product.price).toFixed(2)}</p>
              </div>
              <p className="recommendation-reason">{reasons?.[0] || "Good fit based on your activity"}</p>
              <span className="recommendation-score">
                Match {Math.round((recommendationScore || 0) * 100)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RecommendedProducts;
