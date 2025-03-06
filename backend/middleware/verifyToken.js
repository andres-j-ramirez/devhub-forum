const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Expect token in the Authorization header as: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token is not valid" });
    req.user = decoded; // decoded contains the payload, e.g., user id
    next();
  });
};

module.exports = verifyToken;
