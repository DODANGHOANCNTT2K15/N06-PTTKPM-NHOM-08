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
            @input="handleInput"
          />
          <button type="submit">Tìm kiếm</button>
        </form>
        <div v-if="showOverlay" class="search-suggestions">
          <!-- Trạng thái đang tải -->
          <div v-if="isLoading" class="suggestion-item">
            Đang tìm kiếm "{{ searchQuery }}"
          </div>

          <!-- Hiển thị kết quả tìm kiếm -->
          <template v-else>
            <!-- Tiêu đề kết quả khi có query và suggestions -->
            <div
              v-if="searchQuery && suggestions.length"
              class="suggestion-item suggestion-header"
            >
              Kết quả cho "{{ searchQuery }}"
            </div>

            <!-- Danh sách gợi ý -->
            <div
              v-for="suggestion in suggestions"
              :key="suggestion.book_id"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
            >
              {{ suggestion.title }} - {{ suggestion.author }}
            </div>

            <!-- Hiển thị không có kết quả -->
            <div
              v-if="searchQuery && !suggestions.length"
              class="suggestion-item no-results"
            >
              Không có kết quả cho "{{ searchQuery }}"
            </div>

            <!-- Gợi ý mặc định khi không có query và suggestions -->
            <template v-if="!searchQuery && !suggestions.length">
              <div
                class="suggestion-item"
                @click="searchQuery = 'Truyện tranh nổi bật'"
              >
                Truyện tranh nổi bật
              </div>
              <div
                class="suggestion-item"
                @click="searchQuery = 'Tiểu thuyết lãng mạn'"
              >
                Tiểu thuyết lãng mạn
              </div>
              <div
                class="suggestion-item"
                @click="searchQuery = 'Sách kỹ năng sống'"
              >
                Sách kỹ năng sống
              </div>
            </template>
          </template>
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
            <template v-if="avatarStore.avatar">
              <img
                :src="avatarStore.avatar"
                alt="Avatar"
                class="avatar"
                @error="avatarStore.updateAvatar(null)"
              />
            </template>
            <template v-else>
              <i class="fa fa-user avatar-icon"></i>
            </template>
            <span>{{
              authStore.user?.user_name || authStore.user?.email || "Người dùng"
            }}</span>
          </button>
          <div class="dropdown-content">
            <button @click="goToUserInfo">Thông tin tài khoản</button>
            <button @click="goToOrders">Đơn hàng</button>
            <button @click="goToLikes">Yêu thích</button>
            <button @click="goToAddresss">Địa chỉ giao hàng</button>
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
    <div v-if="showOverlay" class="overlay" @click="showOverlay = false"></div>
  </header>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { useAvatarStore } from "@/stores/avatar";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { apiGetCountProductOfCart } from "@/services/client/CartService";
import { apiSearchBookSuggestions } from "@/services/client/SearchService";

export default {
  name: "HeaderComponent",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const avatarStore = useAvatarStore();
    const showOverlay = ref(false);
    const searchQuery = ref("");
    const suggestions = ref([]);
    const isLoading = ref(false);
    let searchTimeout = null;

    // Khởi tạo thông tin người dùng
    const initializeUserInfo = () => {
      const token = localStorage.getItem("token");
      if (token && authStore.isLoggedIn) {
        const userInfo = getUserInfoFromToken(token);
        authStore.user = userInfo || {};
        if (userInfo?.avatar) {
          avatarStore.updateAvatar(userInfo.avatar);
        }
      } else {
        authStore.user = {};
      }
    };

    onMounted(() => {
      authStore.initializeAuth();
      cartStore.initializeCart();
      avatarStore.initializeAvatar();
      initializeUserInfo();
      fetchCountOfCart();
    });

    // Điều hướng
    const goToHome = () => router.push("/");
    const gotoLogin = () => router.push("/login");
    const goToUserInfo = () => router.push("/user/info");
    const goToOrders = () => router.push("/user/orders");
    const goToLikes = () => router.push("/user/like");
    const goToAddresss = () => router.push("/user/address");

    const hideOverlayWithDelay = () => {
      setTimeout(() => {
        showOverlay.value = false;
      }, 200);
    };

    const handleSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: "/search-results",
          query: { q: searchQuery.value.trim() },
        });
        showOverlay.value = false;
        clearTimeout(searchTimeout);
      } else {
        router.push('/');
      }
    };

    // Xử lý khi nhập
    const handleInput = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      suggestions.value = [];
      if (searchQuery.value.trim()) {
        isLoading.value = true;
        searchTimeout = setTimeout(() => {
          fetchSearchSuggestions();
        }, 2000);
      } else {
        isLoading.value = false;
      }
    };

    // Gọi API tìm kiếm gợi ý
    const fetchSearchSuggestions = async () => {
      try {
        isLoading.value = true;
        const response = await apiSearchBookSuggestions({
          key: searchQuery.value,
        });
        const data = response.data;

        if (data.err === 0) {
          suggestions.value = data.data || [];
        } else {
          console.error("Lỗi từ API:", data.msg);
          suggestions.value = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
        suggestions.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const selectSuggestion = (suggestion) => {
      router.push(`/product/${suggestion.book_id}`);
      showOverlay.value = false;
    };

    const getUserInfoFromToken = (token) => {
      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
          user_id: payload.user_id || payload.id,
          email: payload.email,
          user_name: payload.user_name,
          avatar: payload.avatar,
        };
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        return null;
      }
    };

    const fetchCountOfCart = async () => {
      try {
        const userId =
          authStore.user?.user_id ||
          getUserInfoFromToken(localStorage.getItem("token"))?.user_id;
        if (userId) {
          const response = await apiGetCountProductOfCart({ user_id: userId });
          if (response.data.err === 0) {
            cartStore.updatetotal_product_type(
              response.data.total_product_types || 0
            );
          } else {
            cartStore.updatetotal_product_type(0);
          }
        } else {
          cartStore.updatetotal_product_type(0);
        }
      } catch (error) {
        console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
        cartStore.updatetotal_product_type(0);
      }
    };

    const handleLogout = () => {
      authStore.logout();
      cartStore.updatetotal_product_type(0);
      avatarStore.updateAvatar(null);
      authStore.user = {};
      alert("Đăng xuất thành công!");
      router.push("/");
    };

    authStore.$subscribe((mutation, state) => {
      if (state.isLoggedIn) {
        initializeUserInfo();
        fetchCountOfCart();
      } else {
        cartStore.updatetotal_product_type(0);
        avatarStore.updateAvatar(null);
        authStore.user = {};
      }
    });

    return {
      authStore,
      cartStore,
      avatarStore,
      goToHome,
      gotoLogin,
      goToUserInfo,
      goToOrders,
      goToLikes,
      goToAddresss,
      showOverlay,
      searchQuery,
      suggestions,
      isLoading,
      hideOverlayWithDelay,
      handleSearch,
      handleInput,
      selectSuggestion,
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
  max-height: 300px;
  overflow-y: auto;
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

.no-results {
  cursor: default;
  color: #666;
}

.no-results:hover {
  background-color: transparent;
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
  display: flex;
  align-items: center;
  color: #2c3e50;
  border: 1px solid #e0e0e0;
  height: 40px;
  padding: 0 10px;
  font-weight: 600;
  font-size: 0.9em;
  background-color: #fff;
  border-radius: 20px;
  cursor: pointer;
  width: 100%;
  min-width: 180px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.account-button .avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  object-fit: cover;
}

.account-button .avatar-icon {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 1.2em;
  color: #007bff;
  margin-right: 8px;
}

.account-button span {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  right: 0;
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