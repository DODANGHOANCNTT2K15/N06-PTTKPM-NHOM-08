import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);

  // Khởi tạo trạng thái từ localStorage
  function initializeAuth() {
    const loginStatus = localStorage.getItem('isLogin');
    isLoggedIn.value = loginStatus === 'true';
  }

  // Hàm đăng nhập
  function login() {
    isLoggedIn.value = true;
    localStorage.setItem('isLogin', 'true');
  }

  // Hàm đăng xuất
  function logout() {
    isLoggedIn.value = false;
    localStorage.setItem('isLogin', 'false');
  }

  return { isLoggedIn, initializeAuth, login, logout };
});