/**
 * Authentication middleware
 * -------------------------
 * Verifies a JSON Web Token (JWT) provided in the HTTP `Authorization` header
 * in the format `Bearer <token>`. On success, attaches `req.userId` and calls
 * `next()` to continue request processing. On failure, returns an appropriate
 * 4xx response and does NOT call next().
 *
 * Behavior summary:
 *  - If the `Authorization` header is missing -> 401
 *  - If the header format is invalid -> 401
 *  - If token is missing after `Bearer` -> 401
 *  - If token verification fails or token expired -> 403
 */

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  try {
    // Read authorization header (support both lowercase and capitalized keys)
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log('Auth Header:', authHeader);

    // Header must exist
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Extract token portion
    const token = parts[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify the token using the server's JWT secret. jwt.verify throws on invalid/expired tokens.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user identity to request for downstream handlers
    req.userId = decoded.userId;

    // Token is valid — proceed
    next();
  } catch (err) {
    // Log error for debugging and return forbidden. Use 403 to indicate valid auth credentials are required but token is invalid/expired
    console.error('Auth error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
