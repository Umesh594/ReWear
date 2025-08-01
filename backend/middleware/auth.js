const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
