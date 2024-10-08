// handles login/sign up logic
const User = require('../models/user');

exports.signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Validate that required fields are present
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Create user in database
    const user = await User.create({ first_name, last_name, email, password });

    // Respond with user details (excluding password)
    res.status(201).json({ message: 'User created', user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } });
  } catch (error) {
    // Handle potential errors, e.g., unique email constraint
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate that required fields are present
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check user in database
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Respond with user details (excluding password)
    res.status(200).json({ message: 'Login successful', user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email: user.email } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
