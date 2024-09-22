const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure that the decoded token includes the email
    if (!decoded.email) {
      console.error('Token does not contain email');
      return res.status(401).json({ message: 'Invalid token structure' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    console.log('User authenticated:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    });

    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};