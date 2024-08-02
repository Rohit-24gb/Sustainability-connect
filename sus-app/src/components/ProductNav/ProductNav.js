import React, { useState, useEffect, useRef } from "react";
import "./ProductNav.css";
import { Link } from "react-router-dom";
import hamburgerIcon from "../../assets/hamburger.png"; // Path to your hamburger image

const ProductNav = ({ isProductNextPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`product-nav ${isProductNextPage ? "product-next-nav" : ""}`}>
      <button className="product-nav-hamburger" onClick={toggleMenu}>
          <img src={hamburgerIcon} alt="Menu" />
        </button>
      <div ref={menuRef} className={`product-nav-menu ${menuOpen ? "product-nav-menu-visible" : ""}`}>
        <Link to="/products/personal-care" className="nav-link" onClick={() => setMenuOpen(false)}>Personal Care</Link>
        <Link to="/products/stationery" className="nav-link" onClick={() => setMenuOpen(false)}>Stationery</Link>
        <Link to="/products/electronics" className="nav-link" onClick={() => setMenuOpen(false)}>Electronics</Link>
        <Link to="/products/clothing" className="nav-link" onClick={() => setMenuOpen(false)}>Clothing</Link>
        <Link to="/products/kitchen" className="nav-link" onClick={() => setMenuOpen(false)}>Kitchen</Link>
        <Link to="/products/accessories" className="nav-link" onClick={() => setMenuOpen(false)}>Accessories</Link>
        <Link to="/products/household" className="nav-link" onClick={() => setMenuOpen(false)}>Household</Link>
        <Link to="/products/cleaning" className="nav-link" onClick={() => setMenuOpen(false)}>Cleaning</Link>
        <Link to="/products/beauty" className="nav-link" onClick={() => setMenuOpen(false)}>Beauty</Link>
        <Link to="/products/fitness" className="nav-link" onClick={() => setMenuOpen(false)}>Fitness</Link>
        <Link to="/products/technology" className="nav-link" onClick={() => setMenuOpen(false)}>Technology</Link>
      </div>
    </nav>
  );
};

export default ProductNav;




