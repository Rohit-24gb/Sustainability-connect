import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./Pages/Homepage";
import RecyclingCenter from "./Pages/RecyclingCenter";
import Products from "./Pages/Product";
import Community from "./Pages/Community";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Nav from "./components/Nav/Nav";
import Login from "./Pages/Login";
import CartPage from "./components/Cart/cartPage";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import RecyclingCenterDetail from "./components/RecyclingCenterDetails/RecyclingCenterDetail";
import SignUp from "./Pages/Signup";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword";
import OtpVerification from './components/ForgetPassword/OtpVerification'
import ChangePassword from './components/ForgetPassword/ChangePassword'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Success from './components/Sucess'
import Cancel from './components/Cancel'
import Order from './components/Myorder/MyOrder'
import BlogPage from "./components/CommunityPage/BlogPage";

function App() {
  return (
    <Router>
      <Nav />
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/recyclingcenter" element={<RecyclingCenter />} />
        <Route path="/products/*" element={<Products />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Cart" element={<CartPage />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/product/:productID" element={<ProductDetails />} />
        <Route
          path="/recycling-center/:centerID"
          element={<RecyclingCenterDetail />}
        />

        <Route path="/blog/:id" element={<BlogPage />} />

        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />



      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
