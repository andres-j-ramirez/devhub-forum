const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    // Get the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Authorization token required' });
    }

    // If header starts with "Bearer ", extract just the token part
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    console.log("Received token:", token);  // Debug: log token value

    // Verify the token using your JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("JWT verify error:", err);  // Debug: log error details
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        console.log("Decoded token:", decoded);  // Debug: log decoded payload
        // Attach the userId from the token payload to the request object
        req.userId = decoded.userId;
        next();
    });
};

module.exports = authMiddleware;
