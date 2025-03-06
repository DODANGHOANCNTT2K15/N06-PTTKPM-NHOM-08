import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useAvatarStore = defineStore('avatar', () => {
  const avatar = ref(null); // Thêm ref để lưu avatar

  function initializeAvatar() {
    if(!localStorage.getItem('avatar')) {
        localStorage.setItem('avatar', '');
    } else {
        const storedAvatar = localStorage.getItem('avatar');
        avatar.value = storedAvatar ? storedAvatar : null;
    }
  }

  // Thêm hàm để cập nhật avatar
  function updateAvatar(newAvatar) {
    avatar.value = newAvatar;
  }

  // Lắng nghe thay đổi và lưu avatar vào localStorage
  watch(avatar, (newAvatar) => {
    if (newAvatar) {
      localStorage.setItem('avatar', newAvatar);
    } else {
      localStorage.removeItem('avatar');
    }
  });

  return { 
    avatar, 
    updateAvatar,
    initializeAvatar 
  };
});