import api from "./api"; // Adjust this import path as per your folder structure

// 1. Add a new project (Admin only)
export const addProjectService = async (projectData) => {
  const response = await api.post("project/add", projectData);
  return response.data;
};

// 2. Get projects for dropdown (Public)
export const getProjectsForDropdownService = async () => {
  const response = await api.get("project/search-dropdown");
  return response.data;
};

// 3. Get all projects (Admin only)
export const getAllProjectsService = async () => {
  const response = await api.get("project/all");
  return response.data;
};

// 4. Update project by ID (Admin only)
export const updateProjectService = async (projectId, updateData) => {
  const response = await api.put(`project/update/${projectId}`, updateData);
  return response.data;
};

// 5. Get my projects (Admin)
export const getMyProjectsAdminService = async () => {
  const response = await api.get("project/my-projects");
  return response.data;
};

// 6. Get my projects (Client)
export const getMyProjectsClientService = async () => {
  const response = await api.get("project/client/my-projects");
  return response.data;
};

// 7. Get project by ID (Admin only)
export const getProjectByIdService = async (projectId) => {
  const response = await api.get(`project/${projectId}`);
  return response.data;
};
