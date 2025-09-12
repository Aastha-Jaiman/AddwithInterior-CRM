import api from "./api";

// 1. Register Client by Admin
export const registerClientByAdmin = async (formData) => {
  const res = await api.post("/client/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 2. Client Login
export const loginClient = async ({ email, identifier, password }) => {
  const res = await api.post("/client/login", {
    identifier: identifier || email,
    password,
  });
  return res.data;
};

// 3. Get Client Profile (Client-authenticated route)
export const getClientProfile = async () => {
  const res = await api.get("/client/profile");
  return res.data;
};

// 4. Logout Client (Client-authenticated route)
export const logoutClient = async () => {
  const res = await api.get("/client/logout");
  return res.data;
};

// 5. Get All Clients (Admin + Auth middleware required)
export const getAllClientsByAdmin = async () => {
  const res = await api.get("/client/all");
  return res.data;
};

// 6. Get Client By ID (Admin only)
export const getClientByIdService = async (id) => {
  const res = await api.get(`/client/${id}`);
  return res.data;
};

// 7. Update Client by Admin
export const updateClientByAdmin = async (id, formData) => {
  const res = await api.put(`/client/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// 8. Forgot Password (Email token sender)
export const resetClientEmailToken = async (data) => {
  const res = await api.post("/client/forgot-password", data);
  return res.data;
};

// 9. Change Password (Old + New - Non-authenticated)
export const changeClientPassword = async (data) => {
  const res = await api.post("/client/password", data);
  return res.data;
};

// 10. Reset Password (Token-based - Client-authenticated)
export const resetClientPassword = async (data) => {
  const res = await api.put("/client/reset-password", data);
  return res.data;
};
