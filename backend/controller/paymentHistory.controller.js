const PaymentHistoryModel = require("../model/paymentHistory.model");
const ProjectModel = require("../model/project.model")
const ClientModel = require("../model/client.model")
const { uploadOnCloudinary } = require("../utils/cloudinary");
const fs = require("fs");


exports.addPayment = async (req, res) => {
  try {
    const { clientId, projectId, amount, message } = req.body;
    const file = req.file;

    if (!clientId || !projectId || amount == null || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Client, Project and a valid Amount are required",
      });
    }

    const project = await ProjectModel.findById(projectId).select("finalBudget client");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    if (project.client.toString() !== clientId) {
      return res.status(400).json({
        success: false,
        message: "This project does not belong to the specified client.",
      });
    }

    const totalPrice = project.finalBudget || 0;

    let paymentHistory = await PaymentHistoryModel.findOne({
      client: clientId,
      project: projectId,
    });

      let totalReceived = 0;
    if (paymentHistory) {
      totalReceived = paymentHistory.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    }
    const pendingAmount = totalPrice - totalReceived;

    if (amount > pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Amount exceeds pending amount. Maximum allowed: ${pendingAmount}`,
      });
    }

    let uploadedDoc;
    if (file) {
      try {
        uploadedDoc = await uploadOnCloudinary(file.path, {
          resource_type: "raw",
          folder: "payment_bills",
        });
      } catch (err) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res
          .status(500)
          .json({ message: "Error uploading document", error: err.message });
      }
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    const newPayment = {
      amount,
      message,
      date: new Date(),
      file: uploadedDoc?.secure_url,
    };

    if (!paymentHistory) {
      paymentHistory = new PaymentHistoryModel({
        client: clientId,
        project: projectId,
        totalPrice,
        payments: [newPayment],
      });
    } else {
      paymentHistory.payments.push(newPayment);
    }

    paymentHistory.totalReceived = paymentHistory.payments.reduce(
      (acc, p) => acc + (p.amount || 0),
      0
    );
    paymentHistory.pending = totalPrice - paymentHistory.totalReceived;
    if (paymentHistory.pending < 0) paymentHistory.pending = 0;

    await paymentHistory.save();

     await ClientModel.findByIdAndUpdate(
      clientId,
      { $addToSet: { paymentHistory: paymentHistory._id } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Payment added successfully",
      paymentHistory,
    });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, message } = req.body;
    const file = req.file;

    if (amount == null || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const paymentDoc = await PaymentHistoryModel.findById(paymentId);
    if (!paymentDoc) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    const project = await ProjectModel.findById(paymentDoc.project).select("finalBudget");
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    let uploadedDoc;
    if (file) {
      try {
        uploadedDoc = await uploadOnCloudinary(file.path, {
          resource_type: "raw",
          folder: "payment_bills",
        });
      } catch (err) {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(500).json({ message: "Error uploading document", error: err.message });
      }
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

      const totalPrice = project.finalBudget || 0;
    const totalReceived = paymentDoc.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    const pendingAmount = totalPrice - totalReceived;

    if (amount > pendingAmount) {
      return res.status(400).json({
        success: false,
        message: `Amount exceeds pending amount. Maximum allowed: ${pendingAmount}`,
      });
    }

    paymentDoc.payments.push({
      amount,
      message,
      date: new Date(),
      file: uploadedDoc?.secure_url,
    });

    paymentDoc.totalPrice = project.finalBudget || 0;
    paymentDoc.totalReceived = paymentDoc.payments.reduce((acc, p) => acc + (p.amount || 0), 0);
    paymentDoc.pending = paymentDoc.totalPrice - paymentDoc.totalReceived;
    if (paymentDoc.pending < 0) paymentDoc.pending = 0;

    await paymentDoc.save();

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: paymentDoc,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentHistoryModel.find()
      .populate("project", "title category")  
      .populate("client", "name email");  

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found",
      });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await PaymentHistoryModel.findById(paymentId)
      .populate("project", "title category")
      .populate("client", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment by ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const paymentDoc = await PaymentHistoryModel.findOne({ "payments._id": paymentId });
    if (!paymentDoc) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const paymentToDelete = paymentDoc.payments.find(p => p._id.toString() === paymentId);
    if (!paymentToDelete) {
      return res.status(404).json({ message: "Payment not found in document" });
    }

    const amountToRemove = paymentToDelete.amount;
    paymentDoc.payments = paymentDoc.payments.filter(p => p._id.toString() !== paymentId);

    paymentDoc.totalReceived -= amountToRemove;
    if (paymentDoc.totalReceived < 0) paymentDoc.totalReceived = 0;
    paymentDoc.pending = paymentDoc.totalPrice - paymentDoc.totalReceived;
    if (paymentDoc.pending < 0) paymentDoc.pending = 0;

    await paymentDoc.save();

    res.status(200).json({
      message: "Payment deleted successfully",
      paymentHistory: paymentDoc,
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
