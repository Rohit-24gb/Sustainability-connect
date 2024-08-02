import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { Shopcontext } from '../Context/Shopcontext';
import './Navbar.css';
import cart from '../../assets/cart_icon.png';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  // const { getTotalCartItems } = useContext(Shopcontext) || {};

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  const toggleNavbar = () => {
    setIsActive(!isActive);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/Login');
  };

  const auth = localStorage.getItem('user'); // Determine if user is logged in

  return (
    <nav className='navbar'>
      <div className='navbar-content'>
        <span className='navbar-logo'>Sustainability Connect</span>
        <span className='navbar-toggle' onClick={toggleNavbar}>&#9776;</span>
        <div className={`navbar-links ${isActive ? 'active' : ''}`}>
          <Link to="/home">Home</Link>
          <Link to="/recyclingcenter">Recycling Center</Link>
          <Link to="/products">Products</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
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

