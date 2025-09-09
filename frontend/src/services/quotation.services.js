// services/quotationService.js
import api from "./api";

// Add a new quotation
export const addQuotation = async (data) => {
  try {
    const response = await api.post("quotation/add", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all clients' emails
export const getAllClientsEmail = async () => {
  try {
    const response = await api.get("quotation/clients");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all projects by client email
export const getProjectsByClientEmail = async (email) => {
  try {
    const response = await api.get(`quotation/projects/${email}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all quotations (requires auth)
export const getAllQuotations = async () => {
  try {
    const response = await api.get("quotation/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get quotation by ID
export const getQuotationById = async (id) => {
  try {
    const response = await api.get(`quotation/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload final PDF document for a quotation
export const uploadFinalDocument = async (quotationId, file) => {
  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const response = await api.post(`quotation/upload/${quotationId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get final PDF document
export const getFinalDocument = async (quotationId) => {
  try {
    const response = await api.get(`quotation/${quotationId}/finaldocument`, {
      responseType: "blob", // important to download/view PDFs
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
