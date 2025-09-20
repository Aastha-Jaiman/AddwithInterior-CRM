import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api/v1/",
  baseURL: "https://addwithinterior-crm.onrender.com/api/v1/",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("error", error);

    return Promise.reject(error);
  }
);

export default api;
