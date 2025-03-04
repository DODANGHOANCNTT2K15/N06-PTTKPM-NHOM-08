<template>
  <div class="admin-layout">
    <div class="sidebar">
      <router-link to="/admin/dashboard" class="logo-link">
        <img src="@\assets\images\Logo_00.png" alt="Admin Logo" class="logo" />
      </router-link>
      <nav>
        <router-link to="/admin/dashboard" class="sidebar-item">
          <i class="fas fa-tachometer-alt"></i> Dashboard
        </router-link>
        <router-link to="/admin/books" class="sidebar-item">
          <i class="fas fa-book"></i> Quản lý Sách
        </router-link>
        <router-link to="/admin/users" class="sidebar-item">
          <i class="fas fa-users"></i> Quản lý Người dùng
        </router-link>
        <router-link to="/admin/orders" class="sidebar-item">
          <i class="fas fa-shopping-cart"></i> Quản lý Đơn hàng
        </router-link>
        <router-link to="/admin/banners" class="sidebar-item">
          <i class="fas fa-image"></i> Quản lý Banner
        </router-link>
        <router-link to="/admin/tags" class="sidebar-item">
          <i class="fas fa-tags"></i> Quản lý Tag Book
        </router-link>
      </nav>
    </div>

    <div class="main-content">
      <header class="header">
        <h3>Admin Dashboard</h3>
        <div class="user-info">
          <span>Admin User</span>
          <button @click="logout">Logout</button>
        </div>
      </header>
      <div class="content">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router';

export default {
  name: 'AdminLayout',
  setup() {
    const logout = () => {
      console.log('Logged out');
      alert('Đã đăng xuất!');
      // Thêm logic redirect hoặc clear token tại đây (ví dụ: dùng router.push('/login'))
    };

    return {
      logout,
    };
  },
  components: {
    RouterLink,
    RouterView,
  },
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-link {
  display: block;
  padding: 20px;
  text-align: center;
  background-color: #34495e;
  width: 100%;
  text-decoration: none;
}

.logo {
  max-width: 150px; /* Điều chỉnh kích thước logo */
  height: auto;
}

.sidebar nav {
  width: 100%;
  padding: 20px;
  flex-grow: 1;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: white;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.sidebar-item i {
  margin-right: 10px;
  width: 20px; /* Đảm bảo icon căn đều */
  text-align: center;
}

.sidebar-item:hover,
.sidebar-item.router-link-active {
  background-color: #34495e;
  border-radius: 5px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: white;
  padding: 15px 20px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info span {
  font-size: 14px;
  color: #666;
}

.user-info button {
  padding: 5px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.user-info button:hover {
  background-color: #c0392b;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>