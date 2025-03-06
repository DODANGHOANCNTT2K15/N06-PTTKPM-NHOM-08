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
        <router-link to="/admin/promotions" class="sidebar-item">
          <i class="fas fa-gift"></i> Quản lý Khuyến mại
        </router-link>
      </nav>
    </div>

    <div class="main-content">
      <header class="header">
        <h3>Admin Dashboard</h3>
        <div class="user-info" @click="toggleDropdown" ref="userInfo">
          <i class="fas fa-user"></i>
          <span>{{ username }}</span>
          <div class="dropdown" v-if="isDropdownOpen">
            <button @click.stop="handleLogout">Logout</button>
          </div>
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
import { useAuthStore } from '@/stores/auth'; // Giả sử store nằm trong thư mục stores
import { ref, onMounted, onUnmounted } from 'vue';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'AdminLayout',
  components: {
    RouterLink,
    RouterView,
  },
  setup() {
    const authStore = useAuthStore();
    const username = ref(''); // Tên người dùng từ JWT
    const isDropdownOpen = ref(false); // Trạng thái dropdown
    const userInfo = ref(null); // Ref để tham chiếu DOM

    // Khởi tạo trạng thái xác thực và lấy thông tin từ JWT
    onMounted(() => {
      authStore.initializeAuth();
      const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
      if (token) {
        try {
          const decoded = jwtDecode(token);
          console.log(decoded);
          username.value = decoded.user_name || 'Admin User'; // Lấy username từ JWT hoặc mặc định
        } catch (error) {
          console.error('Error decoding JWT:', error);
          username.value = 'Admin User'; // Fallback nếu token không hợp lệ
        }
      }
    });

    // Toggle dropdown
    const toggleDropdown = () => {
      isDropdownOpen.value = !isDropdownOpen.value;
    };

    // Đóng dropdown khi nhấp ra ngoài
    const closeDropdown = (event) => {
      if (userInfo.value && !userInfo.value.contains(event.target)) {
        isDropdownOpen.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown);
    });

    // Xử lý đăng xuất
    const handleLogout = () => {
      authStore.logout(); // Gọi hàm logout từ store
      alert('Đã đăng xuất!');
      // Redirect về trang login
      window.location.href = '/login'; // Hoặc dùng router.push nếu bạn dùng Vue Router
    };

    return {
      username,
      isDropdownOpen,
      toggleDropdown,
      handleLogout,
      userInfo,
    };
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
  background-color: #ffffff;
  width: 100%;
  text-decoration: none;
}

.logo {
  max-width: 150px;
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
  width: 20px;
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
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-info i {
  font-size: 16px;
  color: #666;
}

.user-info span {
  font-size: 14px;
  color: #666;
}

.dropdown {
  position: absolute;
  top: 130%;
  right: 10%;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown button {
  display: block;
  width: 130%;
  padding: 8px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  transition: background-color 0.3s ease;
}

.dropdown button:hover {
  background-color: #c0392b;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>