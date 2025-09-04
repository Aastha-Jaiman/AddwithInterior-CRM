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

// ✅ Update service (add remarks, update status)
export const updateService = async (serviceId, updateData) => {
  try {
    const response = await api.put(`/service/update/${serviceId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
