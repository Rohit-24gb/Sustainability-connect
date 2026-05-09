import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetails.css';
import { toast } from 'react-toastify';
import { API_BASE_URL, getAuthHeaders } from "../../config/api";
import { getSessionId, trackInteraction } from "../../config/tracking";

const ProductDetail = () => {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products/${productID}`);
        setProduct(response.data);
        trackInteraction({
          eventType: "view",
          productId: response.data._id,
          category: String(response.data.categoryID || ""),
          metadata: {
            productID: response.data.productID,
            source: "product_detail"
          }
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productID]);

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      toast.error('Please log in to add items to the cart');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity: 1,
          sessionId: getSessionId()
        })
      });

      if (response.ok) {
        toast.success('Item added to cart');
      } else {
        console.error('Error adding item to cart');
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error adding item to cart');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product Not Found</p>;

  const image = product.image_url && product.image_url.length > 0 ? product.image_url[0] : null;
  const ecoScore = product.ecoScore ?? 50;

  return (
    <div className="product-detail-container">
      <div className="product-image-container">
        {image ? (
          <img src={image} alt={product.name} className="product-main-image" />
        ) : (
          <p>No image available</p>
        )}
        <div className="button-container">
          <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
          <button className="buy-now-button">Buy Now</button>
        </div>
      </div>
      <div className="product-details-info">
        <h1 className="product-detail-title">{product.name}</h1>
        <div className="eco-score-badge">Eco Score {ecoScore}/100</div>
        <p className="product-detail-price">₹ {product.price}</p>
        <p className="product-detail-description">{product.description}</p>
        <div className="impact-card">
          <h2>Sustainability Impact</h2>
          <div className="impact-grid">
            <div>
              <span>Carbon estimate</span>
              <strong>{product.carbonKgCO2e ?? 1.5} kg CO2e</strong>
            </div>
            <div>
              <span>Packaging</span>
              <strong>{product.packagingType || "standard"}</strong>
            </div>
            <div>
              <span>Recyclable</span>
              <strong>{product.recyclable ? "Yes" : "Limited info"}</strong>
            </div>
            <div>
              <span>Durability</span>
              <strong>{product.durabilityScore ?? 50}/100</strong>
            </div>
          </div>
          {product.materials?.length > 0 && (
            <p className="impact-tags">
              {product.materials.map((material) => (
                <span key={material}>{material}</span>
              ))}
            </p>
          )}
          <p className="impact-explanation">
            {product.impactExplanation || "Impact details will improve as this product gets sustainability metadata."}
          </p>
          {product.certifications?.length > 0 && (
            <p className="impact-certifications">
              Certifications: {product.certifications.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
