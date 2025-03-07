import router from '@/router';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// Hàm parse JWT token
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    // Kiểm tra thời gian hết hạn (nếu có)
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null; // Token hết hạn
    }
    return decoded;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const userRole = ref(null); // Lưu vai trò: 0 (khách), 1 (admin)

  // Khởi tạo trạng thái từ localStorage
  function initializeAuth() {
    const loginStatus = localStorage.getItem('isLogin');
    const token = localStorage.getItem('token');
    isLoggedIn.value = loginStatus === 'true' && !!token;

    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.role !== undefined) {
        userRole.value = decoded.role;
      } else {
        userRole.value = null;
        isLoggedIn.value = false; // Token không hợp lệ hoặc hết hạn
      }
    } else {
      userRole.value = null;
    }
  }

  // Hàm đăng nhập
  function login(token) {
    localStorage.setItem('token', token);
    const decoded = parseJwt(token);
    console.log(decoded.role);
    if (decoded && decoded.role !== undefined) {
      isLoggedIn.value = true;
      if(decoded.role === 1) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
      userRole.value = decoded.role;
      localStorage.setItem('isLogin', 'true');
    } else {
      throw new Error('Invalid token');
    }
  }

  // Hàm đăng xuất
  function logout() {
    isLoggedIn.value = false;
    userRole.value = null;
    localStorage.clear();
    localStorage.setItem('isLogin', 'false');
    history.go(0); // Làm mới trang
  }

  // Hàm kiểm tra admin
  function isAdmin() {
    return isLoggedIn.value && userRole.value === 1;
  }

  return { isLoggedIn, userRole, initializeAuth, login, logout, isAdmin };
});