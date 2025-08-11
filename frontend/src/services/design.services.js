// services/design.services.js
import api from "./api";

// 1. Upload a design PDF to a specific project
export const uploadDesign = async (projectId, pdfFile) => {
  const formData = new FormData();
  formData.append("pdf", pdfFile);

  const response = await api.post(`/design/${projectId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 2. Get all designs for a specific project
export const getDesignsByProjectId = async (projectId) => {
  const response = await api.get(`/design/project/${projectId}`);
  return response.data;
};

// 3. Get all designs (admin view or authenticated)
export const getAllDesigns = async () => {
  const response = await api.get("/design/all");
  return response.data;
};

// 4. Add feedback to a specific design
export const addFeedbackToDesign = async (designId, feedbackData) => {
  const response = await api.put(`/design/feedback/${designId}`, feedbackData);
  return response.data;
};
