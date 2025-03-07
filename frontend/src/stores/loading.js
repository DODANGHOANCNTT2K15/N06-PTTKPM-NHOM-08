import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);

  function showLoading() {
    if (!isLoading.value) {
      isLoading.value = true;
    }
  }

  function hideLoading() {
    if (isLoading.value) {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    showLoading,
    hideLoading,
  };
});