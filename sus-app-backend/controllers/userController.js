const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');




exports.login =  async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ result: 'Email and password are required' });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ result: 'No user found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send({ result: 'Incorrect password' });
        }

        // Prepare the user response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).send({ success: true, user: userResponse });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ success: false, message: 'Error logging in' });
    }
};




exports.register =  async (req, res) => {
    try {
        const { name, email, password, phone, gender, city } = req.body;

        if (!name || !email || !password || !phone || !gender || !city) {
            return res.status(400).send({ success: false, message: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance
        let user = new User({ name, email, password: hashedPassword, phone, gender, city });
        
        // Save the user to the database
        let result = await user.save();

        // Remove the password from the response
        result = result.toObject();
        delete result.password;

        res.status(201).send({ success: true, message: 'User registered successfully', user: result });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ success: false, message: 'Error registering user' });
    }
};
