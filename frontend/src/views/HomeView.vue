<!-- src/views/Home.vue -->
<template>
  <AppHeader />
  <div>
    <h2>Sách đề xuất</h2>
  </div>
  <AppFooter />
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue';

export default {
  name: 'HomeView',
  components: {
    AppHeader,
    AppFooter,
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
