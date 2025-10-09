import api from "../api";

export const getDashboardData = async () => {
  try {
    const res = await api.get("/dashboard/");
    return res.data;
  } catch (error) {
    console.error("Error fetching carpenter dashboard:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};

