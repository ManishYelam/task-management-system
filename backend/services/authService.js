const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id, role) => {
  return jwt.sign(
    { id, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.login = async (email, password) => {
  // Check if email and password exist
  if (!email || !password) {
    throw new Error('Please provide email and password!');
  }

  // Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new Error('Incorrect email or password');
  }

  // If everything ok, send token to client
  const token = signToken(user._id, user.role);

  // Remove password from output
  user.password = undefined;

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    }
  };
};

exports.getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};