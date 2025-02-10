const jwt = require("jsonwebtoken");
const User = require("../models/user-models");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided or invalid format" 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token found" 
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log("Decoded token:", decoded);

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      req.user = user;
      req.token = token;
      next();

    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

module.exports = authMiddleware;
