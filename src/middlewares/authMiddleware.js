const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header and attaches user data to request
 */
const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Extract token from "Bearer <token>" format
    // Split by space and get the second part (the token itself)
    const parts = authHeader.split(" ");

    // Check if header has proper format (Bearer <token>)
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        success: false,
        message: "Access denied. Invalid token format. Use: Bearer <token>",
      });
    }

    const token = parts[1];

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Get JWT secret from environment variables
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact support.",
      });
    }

    // Verify token
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) {
        // Handle different JWT errors
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Access denied. Token has expired.",
          });
        }

        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            success: false,
            message: "Access denied. Invalid token.",
          });
        }

        // Handle other JWT errors
        return res.status(401).json({
          success: false,
          message: "Access denied. Token verification failed.",
        });
      }

      // Attach decoded payload to request object
      req.user = decoded;

      // Continue to next middleware or route handler
      next();
    });
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

module.exports = authenticateToken;

