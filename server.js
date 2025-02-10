require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./router/auth-router");
const contactRouter = require("./router/contact-router");
const paymentRouter = require("./router/payment-router");
const adminRouter = require("./router/admin-router");
const formRouter = require("./router/form-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middleware/error-middleware");
const multer = require("multer");
const path = require("path");
const User = require("./models/user-models");
const bcrypt = require("bcryptjs");

// Update CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://desphysio.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false // Change to false since we're using token-based auth
}));

app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "GaitImage" || file.fieldname === "PostureImage") {
      cb(null, true);
    } else {
      cb(new Error("Invalid field!"), false);
    }
  },
});

app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dataform", formRouter);
app.use("/api/contact", contactRouter);
app.use("/api/payments", paymentRouter);

// File upload endpoint
app.post("/api/upload", upload.single("file"), (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded!" });
  }
  res.json({
    filename: req.file.filename,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

// Add before error middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  next(err);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Add this function to create a test admin user
const createTestUser = async () => {
  try {
    const testUser = {
      username: "Admin User",
      email: "admin1@gmail.com",
      phone: "1234567890",
      password: "admin123",
      isAdmin: true
    };

    // Delete existing user if any
    await User.deleteOne({ email: testUser.email });

    // Create new user
    const user = new User(testUser);
    await user.save();

    // Verify the user was created
    const savedUser = await User.findOne({ email: testUser.email }).select('+password');
    console.log('Test user created:', {
      email: savedUser.email,
      passwordLength: savedUser.password.length,
      isAdmin: savedUser.isAdmin
    });

  } catch (error) {
    console.error("Error creating test user:", error);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDb();
    await createTestUser(); // Create test user on server start
    
    const PORT = process.env.PORT || 5500;
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

module.exports = app;
