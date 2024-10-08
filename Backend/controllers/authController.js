//handles log in/sign up logic

const User = require('../models/user');

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  // Validate and create user in database
  const user = await User.create({ email, password });
  res.status(201).json({ message: 'User created', user });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Validate and check user in database
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.status(200).json({ message: 'Login successful', user });
};
