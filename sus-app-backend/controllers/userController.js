const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const saltRounds = 10;
const User = require('../models/user');
const {
    createAccessToken,
    createRefreshToken,
    getRefreshExpiry,
    hashToken
} = require('../utlis/tokens');

const sanitizeUser = (user) => {
    const userResponse = user.toObject ? user.toObject() : { ...user };
    delete userResponse.password;
    delete userResponse.refreshTokenHash;
    delete userResponse.refreshTokenExpiresAt;
    return userResponse;
};

const issueTokens = async (user) => {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshTokenHash = hashToken(refreshToken);
    user.refreshTokenExpiresAt = getRefreshExpiry();
    await user.save();

    return { accessToken, refreshToken };
};


exports.login =  async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).send({ success: false, message: 'Database is not connected yet' });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ success: false, message: 'Email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find the user by email
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).send({ success: false, message: 'No user found with this email' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ success: false, message: 'Incorrect password' });
        }

        const { accessToken, refreshToken } = await issueTokens(user);
        const userResponse = sanitizeUser(user);

        res.status(200).send({
            success: true,
            message: 'Logged in successfully',
            token: accessToken,
            accessToken,
            refreshToken,
            user: userResponse
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ success: false, message: 'Error logging in' });
    }
};




exports.register =  async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).send({ success: false, message: 'Database is not connected yet' });
        }

        const { name, email, password, phone, gender, city } = req.body;

        if (!name || !email || !password || !phone || !gender || !city) {
            return res.status(400).send({ success: false, message: 'All fields are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if the user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance
        let user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim(),
            gender: gender.trim(),
            city: city.trim()
        });
        
        // Save the user to the database
        let result = await user.save();

        const { accessToken, refreshToken } = await issueTokens(result);
        result = sanitizeUser(result);

        res.status(201).send({
            success: true,
            message: 'User registered successfully',
            token: accessToken,
            accessToken,
            refreshToken,
            user: result
        });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error.code === 11000) {
            return res.status(400).send({ success: false, message: 'Email already exists' });
        }
        res.status(500).send({ success: false, message: 'Error registering user' });
    }
};

exports.me = async (req, res) => {
    res.status(200).send({ success: true, user: sanitizeUser(req.user) });
};

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).send({ success: false, message: 'Refresh token is required' });
        }

        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        if (payload.type !== 'refresh') {
            return res.status(401).send({ success: false, message: 'Invalid refresh token' });
        }

        const user = await User.findById(payload.sub);

        if (
            !user ||
            !user.refreshTokenHash ||
            user.refreshTokenHash !== hashToken(refreshToken) ||
            !user.refreshTokenExpiresAt ||
            user.refreshTokenExpiresAt <= new Date()
        ) {
            return res.status(401).send({ success: false, message: 'Invalid or expired refresh token' });
        }

        const tokens = await issueTokens(user);

        res.status(200).send({
            success: true,
            message: 'Token refreshed successfully',
            token: tokens.accessToken,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: sanitizeUser(user)
        });
    } catch (error) {
        res.status(401).send({ success: false, message: 'Invalid or expired refresh token' });
    }
};

exports.logout = async (req, res) => {
    try {
        req.user.refreshTokenHash = undefined;
        req.user.refreshTokenExpiresAt = undefined;
        await req.user.save();

        res.status(200).send({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error logging out' });
    }
};
