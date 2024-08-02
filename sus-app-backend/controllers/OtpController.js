const User = require('../models/user'); // Adjust the path as needed
const Otp = require('../models/Otp');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const sendOtpEmail = require('../utlis/mailer');



// Forget Password API
exports.forgetPassword =  async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            const otp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false });
            console.log('Generated OTP:', otp); // Log OTP for debugging
            let otpRecord = new Otp({ email, otp });
            await otpRecord.save();
            sendOtpEmail(email, otp);
            res.send({ success: true, message: 'OTP sent to your email' });
        } else {
            res.send({ success: false, message: 'Email not found' });
        }
    } catch (error) {
        console.error('Error in forget-password API:', error);
        res.status(500).send({ success: false, message: 'Error sending OTP' });
    }
  };
  
  
  
  // Verify OTP API
exports.verifyOtp =async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(`Verifying OTP for email: ${email}`);
        console.log(`Received OTP: ${otp}`);
        let otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
        console.log(`Found OTP record: ${otpRecord}`);
        if (otpRecord && otpRecord.otp === otp) {
            if (new Date() - otpRecord.createdAt < 5 * 60 * 1000) { // 5 minutes
                res.send({ success: true, message: 'OTP verified' });
            } else {
                res.send({ success: false, message: 'OTP expired' });
            }
        } else {
            res.send({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error verifying OTP' });
    }
  };


  
  // Change Password API
  exports.changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' });
        }
        if (password.length < 6) {
            return res.send({ success: false, message: 'Password too short' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
        if (user) {
            res.send({ success: true, message: 'Password changed successfully' });
        } else {
            res.send({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Error changing password' });
    }
  };
  