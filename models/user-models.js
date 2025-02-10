const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [6, "Password must be at least 6 characters long"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully. Hash length:', hashedPassword.length);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    // Since password might not be selected, we need to check
    if (!this.password) {
      // Fetch the user again with password
      const user = await this.constructor.findById(this._id).select('+password');
      if (!user) return false;
      return bcrypt.compare(candidatePassword, user.password);
    }
    return bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Error comparing password:', error);
    return false;
  }
};

// Token generation
userSchema.methods.generateToken = function() {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      isAdmin: this.isAdmin
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h"
    }
  );
};

// Define the model or the collection name
const User = mongoose.model("USER", userSchema);

module.exports = User;
