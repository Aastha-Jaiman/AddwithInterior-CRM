const PaymentHistoryModel = require("../model/paymentHistory.model");


exports.addPayment = async (req, res) => {
  try {
    const { clientId, projectId, totalPrice, amount } = req.body;

    if (!clientId || !projectId || !totalPrice || !amount) {
      return res.status(400).json({
        success: false,
        message: "Client, Project, Total Price and Amount are required",
      });
    }

    let paymentHistory = await PaymentHistoryModel.findOne({ client: clientId, project: projectId });

    if (!paymentHistory) {
      paymentHistory = new PaymentHistoryModel({
        client: clientId,
        project: projectId,
        totalPrice,
        totalReceived: amount,
        pending: totalPrice - amount,
        payments: [{ amount }],
      });
    } else {
      paymentHistory.totalReceived += amount;
      paymentHistory.pending = paymentHistory.totalPrice - paymentHistory.totalReceived;
      paymentHistory.payments.push({ amount });
    }

    await paymentHistory.save();

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
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const payment = await PaymentHistoryModel.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.totalReceived += amount;
    payment.pending = payment.totalPrice - payment.totalReceived;

    payment.payments.push({
      amount,
      date: new Date()
    });

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      data: payment
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

