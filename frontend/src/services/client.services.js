import api from './api';

// 1. Register Client by Admin
export const registerClientByAdmin = async (formData) => {
  const response = await api.post('/client/add', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 2. Client Login
export const loginClient = async (credentials) => {
  const response = await api.post('/client/login', credentials);
  return response.data;
};

// 3. Get Client Profile
export const getClientProfile = async () => {
  const response = await api.get('/client/profile');
  return response.data;
};

// 4. Logout Client
export const logoutClient = async () => {
  const response = await api.get('/client/logout');
  return response.data;
};

// 5. Get All Clients (Admin)
export const getAllClientsByAdmin = async () => {
  const response = await api.get('/client/all');
  return response.data;
};

export const getClientByIdService = async (id) => {
  try {
    const response = await api.get(`/client/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: "Unknown error" };
  }
};

// 6. Update Client by Admin
export const updateClientByAdmin = async (id, formData) => {
  const response = await api.put(`/client/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 7. Forgot Password
export const forgotClientPassword = async (data) => {
  const response = await api.post('/client/forgot-password', data);
  return response.data;
};

// 8. Change Password (Non-authenticated route for admin/user)
export const changeClientPassword = async (data) => {
  const response = await api.post('/client/password', data);
  return response.data;
};

// 9. Reset Password (Requires login)
export const resetClientPassword = async (data) => {
  const response = await api.put('/client/reset-password', data);
  return response.data;
};
