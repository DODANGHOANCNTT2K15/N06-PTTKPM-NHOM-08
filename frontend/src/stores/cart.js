import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const total_product_type = ref(0);

  function initializeCart() {
    const storedCount = localStorage.getItem('total_product_type');
    total_product_type.value = storedCount ? parseInt(storedCount, 10) : 0;
  }

  function updatetotal_product_type(count) {
    total_product_type.value = count;
  }

  // Lắng nghe thay đổi và lưu vào localStorage
  watch(total_product_type, (newCount) => {
    localStorage.setItem('total_product_type', newCount.toString());
  });

  return { total_product_type, initializeCart, updatetotal_product_type };
});
