// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api/v1/",
//   // baseURL: "https://addwithinterior-crm.onrender.com/api/v1/",
//   withCredentials: true,
// });


// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("error", error);

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from 'axios';
import store from '../store/store';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api/v1/',
  baseURL: 'https://addwithinterior-crm.onrender.com/api/v1/',
  withCredentials: true,
});

// Attach token from Redux user
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.user?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API error:', error);
    return Promise.reject(error);
  }
);

export default api;
