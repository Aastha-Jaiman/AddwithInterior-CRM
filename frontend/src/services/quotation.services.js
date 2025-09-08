import api from "./api";

// Add a new quotation
export const addQuotation = async (data) => {
  const res = await api.post("/quotation/add", data);
  return res.data;
};

// Get all clients (emails)
export const getAllClientsEmail = async () => {
  const res = await api.get("/quotation/clients");
  return res.data;
};

// Get projects by client email
export const getProjectsByClientEmail = async (email) => {
  const res = await api.get(`/quotation/projects/${email}`);
  return res.data;
};

// Get all quotations
export const getAllQuotations = async () => {
  const res = await api.get("/quotation");
  return res.data;
};

// Get single quotation by ID
export const getQuotationById = async (id) => {
  const res = await api.get(`/quotation/${id}`);
  return res.data;
};

// Upload final document (PDF)
export const uploadFinalDocument = async (quotationId, file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  const res = await api.post(`/quotation/upload/${quotationId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Get final document of a quotation
export const getFinalDocument = async (quotationId) => {
  const res = await api.get(`/quotation/${quotationId}/finaldocument`);
  return res.data;
};
