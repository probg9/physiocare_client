const express = require("express");
const router = express.Router();
const multer = require("multer");
const Form = require("../controller/form-controller");

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
    // Check if the file exists
    if (!file) {
      cb(null, true); // No file uploaded, continue without error
    } else if (file.fieldname === "GaitImage" || file.fieldname === "PostureImage") {
      cb(null, true); // File uploaded and matches the specified fieldnames
    } else {
      cb(new Error("Invalid field!")); // File uploaded but does not match the specified fieldnames
    }
  }
});

// Handle form submissions with optional file uploads
router.route("/form").post(upload.fields([{ name: 'GaitImage', maxCount: 1 }, { name: 'PostureImage', maxCount: 1 }]), Form);

// Route handler for form submission
router.post('/form', async (req, res) => {
  try {
    const formData = req.body; // Assuming you're using express.json() middleware
    // Process formData here, e.g., save to database
    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error processing form:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
