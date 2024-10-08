const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Adjust the path as needed

const router = express.Router();

// Secret key for signing tokens (store this in .env for security)
// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const SECRET_KEY = process.env.SECRET_KEY; // Access the secret key from the environment variable


// Signup Route
router.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    // Validate input data
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }

    // Hash password and create user in database
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ first_name, last_name, email, password: hashedPassword });

    // Generate JWT
    const token = jwt.sign({ id: newUser.user_id, email: newUser.email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.user_id, email: user.email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

     // Send back the token and first name
     res.status(200).json({ token, first_name: user.first_name }); // Include first_name here
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;
