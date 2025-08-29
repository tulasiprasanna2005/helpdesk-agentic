const jwt = require('jsonwebtoken');

// A function that acts as middleware to protect routes
function auth(req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user information from the token to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

// Middleware to check for admin role
function adminAuth(req, res, next) {
  // The 'auth' middleware must run first to populate req.user
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied: Admin role required' });
  }
}

module.exports = {
  auth,
  adminAuth
};