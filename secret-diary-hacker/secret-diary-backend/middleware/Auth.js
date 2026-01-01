// ...existing code...
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
module.exports = authenticateToken;
