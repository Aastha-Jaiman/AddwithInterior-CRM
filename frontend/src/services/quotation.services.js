// services/quotationService.js
import api from "./api";

// 1. Add a new quotation
export const addQuotation = async (quotationData) => {
  const response = await api.post("quotation/add", quotationData);
  return response.data;
};

// 2. Update an existing quotation
export const updateQuotation = async (quotationId, updatedData) => {
  const response = await api.put(`quotation/update/${quotationId}`, updatedData);
  return response.data;
};

// 3. Get all client emails
export const getAllClientsEmail = async () => {
  const response = await api.get("quotation/clients");
  return response.data;
};

// 4. Get projects by client email
export const getProjectsByClientEmail = async (email) => {
  const response = await api.get(`quotation/projects/${email}`);
  return response.data;
};

// 5. Get all quotations (protected)
export const getAllQuotations = async () => {
  const response = await api.get("quotation/");
  return response.data;
};

// 6. Get a single quotation by ID
export const getQuotationById = async (id) => {
  const response = await api.get(`quotation/${id}`);
  return response.data;
};

// 7. Upload final document (PDF file)
export const uploadFinalDocument = async (quotationId, file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const response = await api.post(`quotation/upload/${quotationId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 8. Get final document (returns file blob, likely PDF)
export const getFinalDocument = async (quotationId) => {
  const response = await api.get(`quotation/${quotationId}/finaldocument`);
  return response;
};

// 9. Get default sections by project ID
export const getDefaultSections = async (projectId) => {
  const response = await api.get(`quotation/default/${projectId}`);
  return response.data;
};
