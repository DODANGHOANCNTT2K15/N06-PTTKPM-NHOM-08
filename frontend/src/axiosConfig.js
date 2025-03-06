import axios from "axios";

const instance = axios.create({
  baseURL: process.env.VUE_APP_SERVER_URL || "http://localhost:2025/",
  timeout: 10000, // Giới hạn thời gian chờ request (10s)
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Gắn token từ localStorage vào header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: Xử lý phản hồi và lỗi từ server
instance.interceptors.response.use(
  (response) => {
    return response; // Trả về phản hồi bình thường
  },
  (error) => {
    const { response } = error;
    console.error("Response Error:", response || error.message);

    // Xử lý lỗi cụ thể nếu cần (ví dụ: token hết hạn)
    if (response && response.status === 401) {
      console.log("Token không hợp lệ hoặc hết hạn, cần đăng nhập lại.");
      // Có thể thêm logic như: localStorage.removeItem("token") và chuyển hướng đến trang đăng nhập
      // Ví dụ: window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default instance;