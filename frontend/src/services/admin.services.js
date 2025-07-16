import api from './api';

// 1.  Create Admin
export const createAdmin = async (formData) => {
  const res = await api.post('/admin/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 2.  Register Staff (by Admin)
export const registerStaffByAdmin = async (formData) => {
  const res = await api.post('/admin/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 3.  Admin/Staff Login
// export const loginAdmin = async (credentials) => {
//   const res = await api.post('/admin/login', credentials);
//   return res.data;
// };
export const loginAdmin = async ({ email, identifier, password }) => {
  const res = await api.post('/admin/login', {
    identifier: identifier || email, //  fallback logic
    password,
  });
  return res.data;
};


// 4.  Get Own Profile
export const getProfile = async () => {
  const res = await api.get('/admin/profile');
  return res.data;
};

// 5.  Logout
export const logout = async () => {
  const res = await api.get('/admin/logout');
  return res.data;
};

// 6.  Get All Staffs (admin only)
export const getAllStaff = async () => {
  const res = await api.get('/admin/staffs');
  return res.data;
};

// 7.  Update Staff (by Admin)
export const updateStaffByAdmin = async (id, formData) => {
  const res = await api.put(`/admin/update/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 10. Get Single Client by ID (Admin)
export const getClientById = async (id) => {
  const response = await api.get(`/client/${id}`);
  return response.data;
};

// 8. Update Own Profile (Admin/Staff)
export const updateAdminSelf = async (formData) => {
  const res = await api.put('/admin/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// 9. Forgot Password (send token to email)
export const resetEmailToken = async (email) => {
  const res = await api.post('/admin/forgot-password', { email });
  return res.data;
};

// 10. Change Password (send old & new)
export const changePassword = async (data) => {
  const res = await api.post('/admin/password', data);
  return res.data;
};

// 11. Reset Password (token-based, with login)
export const resetPassword = async (data) => {
  const res = await api.put('/admin/reset-password', data);
  return res.data;
};
