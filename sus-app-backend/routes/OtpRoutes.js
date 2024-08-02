const express = require('express');
const { forgetPassword, verifyOtp, changePassword } = require('../controllers/OtpController'); // Adjust the path as needed
const router = express.Router();

// Forget Password Route
router.post('/forget-password', forgetPassword);

// Verify OTP Route
router.post('/verify-otp', verifyOtp);

// Change Password Route
router.post('/change-password', changePassword);

module.exports = router;
