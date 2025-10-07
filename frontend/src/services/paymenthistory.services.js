// // src/services/payments.services.js
// import api from "./api";

// // Add new payment
// export const addPayment = (paymentData) => {
//   return api.post("/payment/add", paymentData);
// };

// // Get all payments
// export const getAllPayments = () => {
//   return api.get("/payment/all");
// };

// // Get single payment by ID
// export const getPaymentById = (paymentId) => {
//   return api.get(`/payment/${paymentId}`);
// };

// // Update payment
// export const updatePayment = (paymentId, paymentData) => {
//   return api.put(`/payment/update/${paymentId}`, paymentData);
// };


// src/services/payments.services.js
import api from "./api";

// Add new payment (supports file upload)
export const addPayment = (paymentData) => {
  return api.post("/payment/add", paymentData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get all payments
export const getAllPayments = () => {
  return api.get("/payment/all");
};

// Get single payment by ID
export const getPaymentById = (paymentId) => {
  return api.get(`/payment/${paymentId}`);
};

// Update payment (supports file upload)
export const updatePayment = (paymentId, paymentData) => {
  return api.put(`/payment/update/${paymentId}`, paymentData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Delete payment
export const deletePayment = (paymentId) => {
  return api.delete(`/payment/delete/${paymentId}`);
};

export const getMyProjectPaymentHistory = async () => {
  try {
    const response = await api.get("payment/my/history");
    return response.data;
  } catch (error) {
    console.error("Error fetching client payment history:", error);
    throw error.response?.data || error;
  }
};
