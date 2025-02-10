const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const Contact = require("../models/contact-model");

// Get all contacts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Error fetching contacts" });
  }
});

// Create new contact
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { username, email, phone, message } = req.body;

    if (!username || !email || !message) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide all required fields" 
      });
    }

    const newContact = new Contact({
      username,
      email,
      phone,
      message
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact: newContact
    });

  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to send message" 
    });
  }
});

// Delete contact
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Error deleting contact" });
  }
});

module.exports = router;
