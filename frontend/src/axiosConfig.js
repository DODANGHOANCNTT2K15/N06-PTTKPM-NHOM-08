import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL || "http://localhost:2025/",
  timeout: 10000, // Giới hạn thời gian chờ request (10s)
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Nếu có token, thêm vào request
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.error("Response Error:", error.response || error);
    return Promise.reject(error);
  }
);

export default instance;
