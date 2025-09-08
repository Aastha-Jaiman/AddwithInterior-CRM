// src/services/payments.services.js
import api from "./api";

// Add new payment
export const addPayment = (paymentData) => {
  return api.post("/payment/add", paymentData);
};

// Get all payments
export const getAllPayments = () => {
  return api.get("/payment/all");
};

// Get single payment by ID
export const getPaymentById = (paymentId) => {
  return api.get(`/payment/${paymentId}`);
};

// Update payment
export const updatePayment = (paymentId, paymentData) => {
  return api.put(`/payment/update/${paymentId}`, paymentData);
};

