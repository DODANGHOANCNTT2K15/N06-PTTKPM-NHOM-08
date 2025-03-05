<template>
  <header>
    <div>
      <p>PLAYBOOK TỦ SÁCH CHO MỌI NHÀ</p>
    </div>
    <div>
      <div @click="goToHome">
        <img src="@/assets/images/Logo_00.png" alt="PlayBook Logo" />
      </div>
      <div>
        <div>
          <div>
            <form action="" class="search-container">
              <i class="fa fa-search"></i>
              <input type="text" placeholder="Tìm kiếm" />
              <button type="submit">Tìm kiếm</button>
            </form>
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
                  <button
                    @click="
                      authStore.logout();
                      $router.push('/');
                    "
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
              <div id="div_cart">
                <button @click="$router.push('/cart')">
                  <i class="fas fa-shopping-basket"></i>
                </button>
                <div>0</div>
              </div>
            </div>
          </div>
          <div class="location-section">
            <div class="tag-search-container">
              <div class="tag_search">Truyện</div>
              <div class="tag_search">Tiểu thuyết</div>
            </div>
            <div>
              <i class="fas fa-map-marker-alt"></i>
              <a id="location_text"
                >Thị trấn Hương Sơn, Phú Bình, Thái Nguyên</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "HeaderComponent",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // Khởi tạo trạng thái từ localStorage khi component được mount
    onMounted(() => {
      authStore.initializeAuth();
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

    return {
      authStore,
      goToHome,
      gotoLogin,
      goToUserInfo,
      goToOrders,
      goToLikes,
      goToHistory,
    };
  },
};
</script>

<style scoped>
header {
  font-family: Arial, sans-serif;
}

header > div:nth-child(1) {
  background-color: black;
  color: white;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
}

header > div:nth-child(2) {
  background-color: white;
  height: 110px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10%;
}

header > div:nth-child(2) > div:nth-child(2) {
  width: 80%;
}

header > div:nth-child(2) > div:nth-child(2) > div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search-container {
  position: relative;
  width: 34vw;
}

.search-container > input {
  width: 34vw;
  height: 40px;
  border-radius: 20px;
  position: absolute;
  padding-left: 35px;
  padding-right: 30px;
  box-sizing: border-box;
  border: 1px solid rgba(74, 141, 176, 1);
  font-size: 0.9em;
}

.search-container > button {
  position: absolute;
  right: 0;
  background-color: white;
  color: rgba(74, 141, 176, 1);
  font-size: 1em;
  font-weight: bold;
  border: none;
  height: 38px;
  width: 100px;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid rgba(74, 141, 176, 1);
  transform: translateY(1px);
}

.search-container > i {
  position: absolute;
  left: 12px;
  top: 12px;
  color: rgba(74, 141, 176, 1);
  z-index: 1000;
}

.header-actions {
  display: flex;
  align-items: center;
  margin-left: 43.5vw;
}

.login-button button {
  color: black;
  border: none;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 0.9em;
  background-color: white;
  cursor: pointer;
}

.login-button button > i {
  margin-right: 5px;
}

.login-button button:hover {
  background-color: #f0f0f0;
}

.account-dropdown {
  position: relative;
  display: inline-block;
}

.account-button {
  color: black;
  border: none;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  font-size: 0.9em;
  background-color: white;
  cursor: pointer;
}

.account-button > i {
  margin-right: 5px;
}

.account-button:hover {
  background-color: #f0f0f0;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 4px;
  top: 100%;
  left: 0;
}

.dropdown-content button {
  color: black;
  padding: 10px 16px;
  text-decoration: none;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9em;
  cursor: pointer;
}

.dropdown-content button:hover {
  background-color: #f0f0f0;
}

.account-dropdown:hover .dropdown-content {
  display: block;
}

#div_cart {
  position: relative;
  padding-left: 20px;
  margin-left: 10px;
  border-left: 1px solid rgba(74, 141, 176, 1);
}

#div_cart > button {
  height: 40px;
  width: 40px;
  background-color: #dbdbdb;
  border: none;
  border-radius: 10px;
  color: rgba(74, 141, 176, 1);
  font-size: 1em;
  cursor: pointer;
}

#div_cart > div {
  position: absolute;
  background-color: #f50000;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -5px;
  right: -5px;
  font-size: 0.8em;
}

.location-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 5%;
}

.tag-search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag_search {
  padding: 5px 20px;
  background-color: #dedede;
  color: rgba(74, 141, 176, 1);
  margin-right: 10px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 600;
  cursor: pointer;
}

.tag_search:hover {
  background-color: #cccccc;
}

#location_text {
  text-decoration: underline;
  font-style: italic;
  color: rgba(74, 141, 176, 1);
  cursor: pointer;
}

#location_text:hover {
  color: #4a8db0;
}
</style>