const User = require("../models/user-models");
const Contact = require("../models/contact-model");
const Payment = require("../models/payment-model");
const Form = require("../models/form-model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch users" 
    });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch contacts" 
    });
  }
};

const getAllForm = async (req, res) => {
  try {
    const forms = await Form.find();
    if (!forms || forms.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }
    return res.status(200).json(forms);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error in getAllPayments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payments" 
    });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUserData = req.body;
    const updatedData = await User.updateOne(
      { _id: id },
      { $set: updatedUserData }
    );
    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const updatePaymentsById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPaymentData = req.body;
    const updatedData = await Payment.updateOne(
      { _id: id },
      { $set: updatedPaymentData }
    );
    return res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin users cannot be deleted" 
      });
    }

    await user.deleteOne();
    
    res.status(200).json({ 
      success: true, 
      message: "User deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleteUserById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete user" 
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findOne({ _id: id });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getFormsById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Form.findOne({ _id: id });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPaymentsById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error("Error in getPaymentsById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch payment" 
    });
  }
};

const deleteContactById = async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ 
        success: false, 
        message: "Contact not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Contact deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deleteContactById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete contact" 
    });
  }
};

const deleteFormsById = async (req, res) => {
  try {
    const { id } = req.params;
    await Form.deleteOne({ _id: id });
    return res.status(200).json({ message: "Forms deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deletePaymentById = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) {
      return res.status(404).json({ 
        success: false, 
        message: "Payment not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Payment deleted successfully" 
    });
  } catch (error) {
    console.error("Error in deletePaymentById:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete payment" 
    });
  }
};

module.exports = {
  getAllUsers,
  getAllContacts,
  deleteUserById,
  getAllPayments,
  getAllForm,
  getUserById,
  updateUserById,
  updatePaymentsById,
  deleteContactById,
  deleteFormsById,
  getPaymentsById,
  deletePaymentById,
  getFormsById,

};
