<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <div class="book">
        <div class="book-page"></div>
        <div class="book-page"></div>
        <div class="book-page"></div>
      </div>
      <p>Đang tải<span class="dots"></span></p>
    </div>
  </div>
</template>

<script>
import { useLoadingStore } from '@/stores/loading';
import { computed } from 'vue';

export default {
  name: 'LoadingComponent',
  setup() {
    const loadingStore = useLoadingStore();
    const isLoading = computed(() => loadingStore.isLoading);
    return { isLoading };
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.book {
  position: relative;
  width: 60px;
  height: 80px;
  margin: 0 auto 20px;
}

.book-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transform-origin: left center;
  animation: flip 1.5s infinite ease-in-out;
}

.book-page:nth-child(1) {
  animation-delay: 0s;
  background: #f5f5f5;
}

.book-page:nth-child(2) {
  animation-delay: 0.3s;
  background: #e0e0e0;
}

.book-page:nth-child(3) {
  animation-delay: 0.6s;
  background: #d0d0d0;
}

@keyframes flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(-180deg); }
  100% { transform: rotateY(0deg); }
}

p {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots::after {
  content: '...';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
  100% { content: '.'; }
}
</style>