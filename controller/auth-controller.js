const User = require("../models/user-models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// *-------------------
// Home Logic
// *-------------------
const home = async (req, res) => {
  try {
    res.status(200).json({ msg: "Welcome to our home page" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Password will be automatically hashed by the schema setter
    const userCreated = await User.create({ 
      username, 
      email, 
      phone, 
      password 
    });

    const token = await userCreated.generateToken();
    
    res.status(201).json({
      msg: "Registration successful",
      token,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// *-------------------------------
//* User Login Logic 📝
// *-------------------------------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );

    // Remove password from response
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const user = async (req, res) => {
  try {
    const userData = req.user;
    
    if (!userData) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      userData: {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        isAdmin: userData.isAdmin
      }
    });
  } catch (error) {
    console.error("User route error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

module.exports = { home, register, login, user };
