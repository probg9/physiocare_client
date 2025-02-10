const express = require("express");
const admin = require("../controller/admin-controller");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const router = express.Router();
const Form = require("../models/form-model");

router.get("/users", authMiddleware, adminMiddleware, admin.getAllUsers);
router.get("/users/:id", authMiddleware, adminMiddleware, admin.getUserById);
router.get(
  "/payments/:id",
  authMiddleware,
  adminMiddleware,
  admin.getPaymentsById
);
router.get("/forms/:id", authMiddleware, adminMiddleware, admin.getFormsById);
router.patch(
  "/users/update/:id",
  authMiddleware,
  adminMiddleware,
  admin.updateUserById
);
router.patch(
  "/payments/update/:id",
  authMiddleware,
  adminMiddleware,
  admin.updatePaymentsById
);

router.delete(
  "/users/delete/:id",
  authMiddleware,
  adminMiddleware,
  admin.deleteUserById
);
router.get("/contacts", authMiddleware, adminMiddleware, admin.getAllContacts);
router.get("/payments", authMiddleware, adminMiddleware, admin.getAllPayments);
router.get("/forms", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      forms
    });
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch forms"
    });
  }
});
router.get("/records", authMiddleware, admin.getAllForm);
router.delete("/records/delete/:id", authMiddleware, admin.deleteFormsById);

router.delete(
  "/contacts/delete/:id",
  authMiddleware,
  adminMiddleware,
  admin.deleteContactById
);
router.delete("/forms/delete/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Form deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete form"
    });
  }
});
router.delete(
  "/payments/delete/:id",
  authMiddleware,
  adminMiddleware,
  admin.deletePaymentById
);

router.get("/forms/:id/edit", authMiddleware, async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findById(formId);
    
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form for edit:", error);
    res.status(500).json({ message: "Error fetching form data" });
  }
});

router.patch("/forms/update/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Form updated successfully",
      form
    });
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update form"
    });
  }
});

module.exports = router;
