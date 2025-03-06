<template>
  <header>
    <div class="header-top">
      <p>PLAYBOOK TỦ SÁCH CHO MỌI NHÀ</p>
    </div>
    <div class="header-main">
      <div class="logo" @click="goToHome">
        <img src="@/assets/images/Logo_00.png" alt="PlayBook Logo" />
      </div>
      <div class="search-section">
        <form action="" class="search-container" @submit.prevent="handleSearch">
          <i class="fa fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm"
            v-model="searchQuery"
            @focus="showOverlay = true"
            @blur="hideOverlayWithDelay"
          />
          <button type="submit">Tìm kiếm</button>
        </form>
        <div class="tag-search-container">
          <div class="tag_search">Truyện</div>
          <div class="tag_search">Tiểu thuyết</div>
        </div>
        <!-- Gợi ý tìm kiếm -->
        <div v-if="showOverlay" class="search-suggestions">
          <div v-if="searchQuery" class="suggestion-item">
            Kết quả cho "{{ searchQuery }}"
          </div>
          <div class="suggestion-item">Truyện tranh nổi bật</div>
          <div class="suggestion-item">Tiểu thuyết lãng mạn</div>
          <div class="suggestion-item">Sách kỹ năng sống</div>
        </div>
      </div>
      <div class="header-actions">
        <div v-if="!authStore.isLoggedIn" class="login-button">
          <button type="button" @click="gotoLogin">
            <i class="fa fa-user"></i> Đăng nhập
          </button>
        </div>
        <div v-else class="account-dropdown">
          <button type="button" class="account-button">
            <i class="fa fa-user"></i> Tài khoản
          </button>
          <div class="dropdown-content">
            <button @click="goToUserInfo">Thông tin tài khoản</button>
            <button @click="goToOrders">Đơn hàng</button>
            <button @click="goToLikes">Yêu thích</button>
            <button @click="goToHistory">Lịch sử</button>
            <button @click="handleLogout">Đăng xuất</button>
          </div>
        </div>
        <div id="div_cart">
          <button @click="$router.push('/cart')">
            <i class="fas fa-shopping-basket"></i>
          </button>
          <div>{{ cartStore.total_product_type }}</div>
        </div>
      </div>
    </div>
    <!-- Overlay đặt ngoài header-main -->
    <div v-if="showOverlay" class="overlay" @click="showOverlay = false"></div>
  </header>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { apiGetCountProductOfCart } from "@/services/client/CartService";

export default {
  name: "HeaderComponent",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const showOverlay = ref(false);
    const searchQuery = ref("");

    onMounted(() => {
      authStore.initializeAuth();
      cartStore.initializeCart();
      fetchCountOfCart();
    });

    const goToHome = () => {
      router.push("/");
    };

    const gotoLogin = () => {
      router.push("/login");
    };

    const goToUserInfo = () => {
      router.push("/user/info");
    };

    const goToOrders = () => {
      router.push("/user/orders");
    };

    const goToLikes = () => {
      router.push("/user/like");
    };

    const goToHistory = () => {
      router.push("/user/history");
    };

    const hideOverlayWithDelay = () => {
      setTimeout(() => {
        showOverlay.value = false;
      }, 200);
    };

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: "/search",
          query: { q: searchQuery.value.trim() },
        });
        showOverlay.value = false;
      }
    };

    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token trong localStorage");
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload.id;
      } catch (error) {
        console.log("Lỗi khi giải mã token:", error);
        return null;
      }
    };

    const fetchCountOfCart = async () => {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          const response = await apiGetCountProductOfCart({ user_id: userId });
          if (response.data.err === 0) {
            const count = response.data.total_product_types || 0;
            cartStore.updatetotal_product_type(count);
          } else {
            console.error("Lỗi từ API:", response.data.msg);
            cartStore.updatetotal_product_type(0);
          }
        } else {
          cartStore.updatetotal_product_type(0);
        }
      } catch (error) {
        console.error("Không thể lấy dữ liệu count of cart:", error);
        cartStore.updatetotal_product_type(0);
      }
    };

    const handleLogout = () => {
      authStore.logout(); // Gọi hàm logout từ authStore
      cartStore.updatetotal_product_type(0); // Reset số lượng giỏ hàng
      alert("Đăng xuất thành công!"); // Hiển thị thông báo
      router.push("/"); // Chuyển hướng về trang chủ
    };

    authStore.$subscribe((mutation, state) => {
      if (state.isLoggedIn) {
        fetchCountOfCart();
      } else {
        cartStore.updatetotal_product_type(0);
      }
    });

    return {
      authStore,
      cartStore,
      goToHome,
      gotoLogin,
      goToUserInfo,
      goToOrders,
      goToLikes,
      goToHistory,
      showOverlay,
      searchQuery,
      hideOverlayWithDelay,
      handleSearch,
      handleLogout,
    };
  },
};
</script>

<style scoped>
header {
  font-family: "Arial", sans-serif;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
}

.header-top {
  background-color: #2c3e50;
  color: white;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-main {
  height: 120px;
  display: flex;
  align-items: center;
  padding: 0 1%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
}

.logo img {
  height: 80px;
  cursor: pointer;
  margin-right: 100px;
}

.search-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  z-index: 1000;
}

.search-container > input {
  width: 100%;
  height: 42px;
  border-radius: 20px;
  padding-left: 40px;
  padding-right: 120px;
  box-sizing: border-box;
  border: 1px solid #007bff;
  font-size: 0.95em;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-container > input:focus {
  border-color: #9ac2ec;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.search-container > button {
  position: absolute;
  right: 1px;
  top: 1px;
  background-color: #406185;
  color: white;
  font-size: 0.95em;
  font-weight: 600;
  border: none;
  height: 40px;
  width: 100px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-container > button:hover {
  background-color: #0056b3;
}

.search-container > i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #007bff;
  font-size: 1em;
}

.tag-search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag_search {
  padding: 6px 18px;
  background-color: #e9ecef;
  color: #007bff;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tag_search:hover {
  background-color: #007bff;
  color: white;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.search-suggestions {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 999;
  padding: 10px 0;
}

.suggestion-item {
  padding: 10px 20px;
  color: #2c3e50;
  font-size: 0.95em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-button button {
  color: #2c3e50;
  border: 1px solid #e0e0e0;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 0.9em;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.login-button button i {
  margin-right: 8px;
}

.login-button button:hover {
  background-color: #f5f5f5;
  border-color: #007bff;
}

.account-dropdown {
  position: relative;
}

.account-button {
  color: #2c3e50;
  border: 1px solid #e0e0e0;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 0.9em;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.account-button i {
  margin-right: 8px;
}

.account-button:hover {
  background-color: #f5f5f5;
  border-color: #007bff;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  border-radius: 8px;
  top: 100%;
  left: 0;
}

.dropdown-content button {
  color: #2c3e50;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-content button:hover {
  background-color: #007bff;
  color: white;
}

.account-dropdown:hover .dropdown-content {
  display: block;
}

#div_cart {
  position: relative;
}

#div_cart > button {
  height: 40px;
  width: 40px;
  background-color: #e9ecef;
  border: none;
  border-radius: 10px;
  color: #007bff;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#div_cart > button:hover {
  background-color: #007bff;
  color: white;
}

#div_cart > div {
  position: absolute;
  background-color: #e74c3c;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -8px;
  right: -8px;
  font-size: 0.8em;
  font-weight: 600;
}
</style>