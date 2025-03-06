<template>
  <div class="user-page-container">
    <div class="user-header">
      <nav class="nav-tabs">
        <a href="#">Trang chủ</a> > <a href="#">Truyện tranh</a>
      </nav>
    </div>

    <div class="user-content">
      <Sidebar />
      <div class="user-profile">
        <UserInfo v-if="currentRouteName === 'UserInfo'" />
        <UserCart v-if="currentRouteName === 'UserOrders'" />
        <UserAddress v-if="currentRouteName === 'UserAddress'" />
        <UserLike v-if="currentRouteName === 'UserLike'" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from '@/components/client/Sidebar.vue';
import UserInfo from '@/components/client/UserInfo.vue';
import UserCart from '@/components/client/UserOrders.vue';
import UserAddress from '@/components/client/UserAddress.vue';
import UserLike from '@/components/client/UserLike.vue';

export default {
  name: 'UserPage',
  components: {
    Sidebar,
    UserInfo,
    UserCart,
    UserAddress,
    UserLike,
  },
  setup() {
    const route = useRoute();
    const currentRouteName = computed(() => route.name);

    return {
      currentRouteName,
    };
  },
};
</script>

<style scoped>
.user-page-container {
  background-color: #f0f8ff;
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.user-header {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.nav-tabs a {
  color: #666;
  text-decoration: none;
}

.nav-tabs a:hover {
  text-decoration: underline;
}

.user-content {
  display: flex;
  gap: 20px;
}

.user-profile {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>