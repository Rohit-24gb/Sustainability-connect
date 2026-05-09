import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Shopcontext } from '../Context/Shopcontext';
import './Navbar.css';
import cart from '../../assets/cart_icon.png';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  // const { getTotalCartItems } = useContext(Shopcontext) || {};

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/Login');
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchTerm('');
      setIsActive(false);
    }
  };

  const auth = localStorage.getItem('user'); // Determine if user is logged in
  const user = auth ? JSON.parse(auth) : null;

  return (
    <nav className='navbar'>
      <div className='navbar-content'>
        <span className='navbar-logo'>Sustainability Connect</span>
        <span className='navbar-toggle' onClick={toggleNavbar}>&#9776;</span>
        <div className={`navbar-links ${isActive ? 'active' : ''}`}>
          <Link to="/home">Home</Link>
          <Link to="/recyclingcenter">Recycling Center</Link>
          <Link to="/products">Products</Link>
          <form className="navbar-search" onSubmit={handleSearch}>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search eco products"
            />
            <button type="submit">Search</button>
          </form>
          <Link to="/community">Community</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          {auth && user?.role && ["admin", "seller"].includes(user.role) && (
            <Link to="/admin/analytics">Analytics</Link>
          )}
          <Link to="/orders">My Order</Link>
        
            {auth ? (
              <Link onClick={logout} to="/Login">Logout</Link>
            ) : (
              <>
                <Link to="/SignUp">Sign Up</Link>
                <Link to="/Login">Login</Link>
              </>
            )}
        
          <div className="navbar-cart">
            <Link to="/cart">
              <img src={cart} alt="Cart" className="cart-icon" />
              <div className="cart-count">
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

