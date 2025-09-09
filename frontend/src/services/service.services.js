// src/services/serviceApi.js
import api from "./api";

// ✅ Create a new service (requires projectId in URL)
export const createService = async (projectId, serviceData) => {
  try {
    const response = await api.post(`/service/add/${projectId}`, serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ✅ Get all services
export const getAllServices = async () => {
  try {
    const response = await api.get("/service");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
}

// ✅ Get service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/service/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateService = async (serviceId, updatedData) => {
  try {
    const formData = new FormData();
    if (updatedData.remarks) formData.append("remarks", updatedData.remarks);
    if (updatedData.visitDate) formData.append("visitDate", updatedData.visitDate);
    if (updatedData.bill) formData.append("bill", updatedData.bill);

    const res = await api.put(`service/update/${serviceId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
