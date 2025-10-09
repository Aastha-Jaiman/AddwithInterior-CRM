import api from "../api";

// Get Admin Dashboard
export const getAdminDashboard = async () => {
  try {
    const response = await api.get("/dashboard/admin");
    return response.data; 
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};
