import api from './api';

// 📌 Add brochure (with file)
export const addBrochure = async (formData) => {
  try {
    const res = await api.post(`/brochure/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 📌 Get all brochures
export const getAllBrochures = async () => {
  try {
    const res = await api.get(`/brochure/all`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 📌 Get brochure by ID
export const getBrochureById = async (id) => {
  try {
    const res = await api.get(`/brochure/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 📌 Delete brochure by ID
export const deleteBrochureById = async (id) => {
  try {
    const res = await api.delete(`/brochure/delete/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 📌 Update brochure (with optional file)
export const updateBrochure = async (id, formData) => {
  try {
    const res = await api.put(`/brochure/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
