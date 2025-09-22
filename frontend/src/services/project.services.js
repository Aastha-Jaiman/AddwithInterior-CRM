import api from "./api";

// 1. Add Project (with image upload)
export const addProject = async (formData) => {
  return await api.post("/project/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// 2. Get All Projects (admin or team user)
export const getAllProjects = async () => {
  return await api.get("/project/all");
};

// 3. Search All for Dropdown
export const searchAllForDropdown = async () => {
  return await api.get("/project/search-dropdown");
};

// 4. Get Project By ID (admin or team user)
export const getProjectById = async (id) => {
  return await api.get(`/project/${id}`);
};

// 5. Update Project by ID (admin or team user)
export const updateProject = async (id, projectData) => {
  return await api.put(`/project/update/${id}`, projectData);
};

// 6. Get My Projects (for logged-in user)
export const getMyProjects = async () => {
  return await api.get("/project/my-projects");
};

// 7. Get My Projects for Client
export const getMyProjectsForClient = async () => {
  return await api.get("/project/client/my-projects");
};

// 8. Quotation
export const getMyProjectClients = async () => {
  try {
    const response = await api.get("/project/my-project-clients");
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch project clients:", error);
    throw error;
  }
};
