import api from "./api";

// Upload new update with images
export const uploadDailyUpdate = async (projectId, formData) => {
  try {
    const response = await api.post(`/dailyupdate/upload/${projectId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all daily updates
export const getAllDailyUpdates = async () => {
  try {
    const response = await api.get(`/dailyupdate/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get single update by ID
export const getDailyUpdateById = async (id) => {
  try {
    const response = await api.get(`/dailyupdate/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete a specific daily update
export const deleteDailyUpdate = async (updateId, dailyUpdateId) => {
  try {
    const response = await api.delete(`/dailyupdate/${updateId}/daily/${dailyUpdateId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
