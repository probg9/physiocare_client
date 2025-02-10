const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const Payment = require("../models/payment-model");

// Get all payments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ date: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// Delete payment
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Error deleting payment" });
  }
});

module.exports = router;
