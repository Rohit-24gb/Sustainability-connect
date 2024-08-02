import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard/ProductCard";
import './Shop-category.css';

const ShopCategory = ({ banner, categoryID }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("price-asc"); // Default sorting by price ascending
  const [showCount, setShowCount] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://sustainability-connect-backend.onrender.com/api/products/category/${categoryID}`);
        setProducts(response.data);
        setDisplayedProducts(response.data.slice(0, showCount));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryID, showCount]);

  useEffect(() => {
    let sortedProducts = [...products];
    if (sortBy === "price-asc") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setDisplayedProducts(sortedProducts.slice(0, showCount));
  }, [sortBy, showCount, products]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleShowMore = () => {
    setShowCount(showCount + 10); // Show 10 more products
  };

  const handleShowLess = () => {
    setShowCount(Math.max(10, showCount - 10)); // Show 10 less products, minimum is 10
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="shop-category-container">
      <img className="shopcategory-banner" src={banner} alt="Banner" />
      <div className="info-container">
        <div className="product-count">
          <p>Total Products: {products.length}</p>
          <p>Showing: {displayedProducts.length}</p>
        </div>
        <div className="sort-container">
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" value={sortBy} onChange={handleSortChange}>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <div className={`product-container ${products.length === 1 ? 'one-product' : ''}`}>
        {displayedProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="pagination-buttons">
        {showCount < products.length && (
          <button onClick={handleShowMore}>Show More</button>
        )}
        {showCount > 10 && (
          <button onClick={handleShowLess}>Show Less</button>
        )}
      </div>
    </div>
  );
};

export default ShopCategory;




