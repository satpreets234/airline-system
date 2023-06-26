const jwt = require('jsonwebtoken');

const authenticateUserToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    // Token is valid, set the user on the request object
    req.user = user;
    next();
  });
};
const authenticateAdminToken = (req, res, next) => {
  // Get the token from the request headers
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token missing.' });
  }

  // Verify the token
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token.');
    }
    else if (user.userType !== 'admin') {
      return res.status(408).send('Admin Rights.');
    }
    // Token is valid, set the user on the request object
    req.user = user;
    next();
  });
};

const authenticateCompanyToken = (req, res, next) => {
    // Get the token from the request headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Token missing.' });
    }
    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).send('Invalid token.');
      }
      else if (user.userType !== 'flightCompany') {
        return res.status(408).send('Request Denied.');
      }
  
      // Token is valid, set the user on the request object
      req.user = user;
      next();
    });
  };

module.exports = {authenticateCompanyToken,authenticateUserToken,authenticateAdminToken};
