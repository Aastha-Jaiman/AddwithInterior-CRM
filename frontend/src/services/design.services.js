// services/design.services.js
import api from "./api";

// Upload a design PDF to a specific project
export const uploadDesign = async (projectId, formData) => {
  try {
    const response = await api.post(`/design/${projectId}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Upload design service error:", error);
    throw error;
  }
};

// Get all designs for a specific project
export const getDesignsByProjectId = async (projectId) => {
  try {
    const response = await api.get(`/design/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Get designs service error:", error);
    throw error;
  }
};

// Get all designs (admin view or authenticated)
export const getAllDesigns = async () => {
  try {
    const response = await api.get("/design/all");
    return response.data;
  } catch (error) {
    console.error("Get all designs service error:", error);
    throw error;
  }
};

// Add feedback to a specific design
export const addFeedbackToDesign = async (designId, feedbackData) => {
  try {
    const response = await api.put(`/design/feedback/${designId}`, feedbackData);
    return response.data;
  } catch (error) {
    console.error("Add feedback service error:", error);
    throw error;
  }
};
