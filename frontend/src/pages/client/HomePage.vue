<template>
  <div>
    <main>
      <div>
        <div id="catagory">
          <div>
            <h1>DANH MỤC</h1>
          </div>
          <div>
            <div>
              <h2>Sách tiếng Anh</h2>
              <ul>
                <li>Art & Photography</li>
                <li>Biographies & Memoirs</li>
                <li>Business & Economics</li>
                <li>How-to - Self Help</li>
                <li>Children's Books</li>
                <li>Dictionary</li>
                <li>Education - Teaching</li>
                <li>Magazines</li>
                <li>Medical Books</li>
              </ul>
            </div>
            <div>
              <h2>Sách tiếng Việt</h2>
              <ul>
                <li>Sách văn học</li>
                <li>Sách kinh tế</li>
                <li>Sách thiếu nhi</li>
                <li>Sách kỹ năng sống</li>
                <li>Nuôi dạy con</li>
                <li>Sách giáo khoa - Giáo trình</li>
                <li>Sách học ngoại ngữ</li>
                <li>Sách tham khảo</li>
                <li>Sách kiến thức tổng hợp</li>
              </ul>
            </div>
          </div>
        </div>
        <div id="content">
          <div id="banner">
            <div
              class="div_banner"
              v-for="(banner, index) in banners"
              :key="index"
              :class="{ active: index === currentBanner }"
            >
              <!-- Sử dụng banner_path từ API thay vì require -->
              <img :src="banner" :alt="`Banner ${index + 1}`" />
            </div>
            <div id="arrow_left" class="arrow_banner" @click="prevBanner">
              <i class="fas fa-chevron-left"></i>
            </div>
            <div id="arrow_right" class="arrow_banner" @click="nextBanner">
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
          <div id="filter">
            <div><h1>Tất cả sản phẩm</h1></div>
            <div>
              <div id="filter_tag_cover">
                <div
                  class="filter_tag"
                  v-for="tag in filterTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="{ active: selectedTags.includes(tag) }"
                >
                  {{ tag }}
                </div>
              </div>
              <div>
                <div id="filter_tag_all" @click="showFilterPopup = true">
                  <div>
                    <i class="fas fa-filter"></i>
                    Tất cả
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <label for="sort-options">Sắp xếp</label>
                <select
                  id="sort-options"
                  v-model="sortOption"
                  @change="sortProducts"
                >
                  <option value="popular">Phổ biến</option>
                  <option value="best-seller">Bán chạy nhất</option>
                  <option value="low-to-high">Giá thấp đến cao</option>
                  <option value="high-to-low">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>
          <div id="products">
            <ProductCard
              v-for="product in paginatedProducts"
              :key="product.id"
              :id="product.id"
              :image="product.image"
              :discountedPrice="product.discountedPrice"
              :originalPrice="product.originalPrice"
              :author="product.author"
              :title="product.title"
              :sold="product.sold"
              :tags="product.tags"
              @click="goToProductDetail(product.id)"
            />
          </div>
          <div id="pagination">
            <button :disabled="currentPage === 1" @click="currentPage--">
              Previous
            </button>
            <span
              v-for="page in totalPages"
              :key="page"
              :class="{ active: currentPage === page }"
            >
              <button @click="currentPage = page">{{ page }}</button>
            </span>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div id="history">
        <div>
          <h1>Sản phẩm đã xem</h1>
        </div>
        <div id="viewed-products">
          <ProductCard
            v-for="product in viewedProducts.slice(0, 4)"
            :key="product.id"
            :id="product.id"
            :image="product.image"
            :discountedPrice="product.discountedPrice"
            :originalPrice="product.originalPrice"
            :author="product.author"
            :title="product.title"
            :sold="product.sold"
            :tags="product.tags"
            @click="goToProductDetail(product.id)"
          />
          <div v-if="viewedProducts.length === 0">
            <p>Chưa có sản phẩm nào được xem.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Popup Login -->
    <div :class="{ hidden: currentRouteName !== 'Login' }" id="login_popup">
      <div>
        <div>
          <h1>Xin chào,</h1>
          <p>Đăng nhập để trải nghiệm tốt nhất từ PlayBook</p>
          <input v-model="loginForm.email" type="text" placeholder="Email hoặc số điện thoại" />
          <input v-model="loginForm.pass_word" type="password" placeholder="Mật khẩu" />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <p id="forget_password">
            <router-link to="/forget-password">Quên mật khẩu?</router-link>
          </p>
          <button @click="login">Đăng nhập</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Chưa có tài khoản?</span>
            <span @click="$router.push('/signup')">Tạo tài khoản</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="" />
          <div>
            <h1>HELLO</h1>
            <p>Trở thành viên của PlayBook</p>
          </div>
        </div>
        <div id="login_popup_close" @click="$router.push('/')">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>

    <!-- Popup Forget Password -->
    <div :class="{ hidden: currentRouteName !== 'ForgetPassword' }" id="Forget_Pass_popup">
      <div>
        <div>
          <h1>Oh,</h1>
          <p>Bạn quên mật khẩu?</p>
          <input v-model="forgetPasswordForm.email" type="text" placeholder="Email hoặc số điện thoại" />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <button @click="forgetPassword">Gửi mã</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span>
            <span @click="$router.push('/login')">Đăng nhập</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="" />
          <div>
            <h1>HELLO</h1>
            <p>Trở thành viên của PlayBook</p>
          </div>
        </div>
        <div id="Fogetpassword_popup_close" @click="$router.push('/')">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>

    <!-- Popup Signup -->
    <div :class="{ hidden: currentRouteName !== 'Signup' }" id="Signup_popup">
      <div>
        <div>
          <h1>Đăng ký</h1>
          <p>Tham gia PlayBook ngay hôm nay!</p>
          <input v-model="signupForm.user_name" type="text" placeholder="Họ và tên" />
          <input v-model="signupForm.email" type="text" placeholder="Email hoặc số điện thoại" />
          <input v-model="signupForm.pass_word" type="password" placeholder="Mật khẩu" />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
          <button @click="signup">Đăng ký</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span>
            <span @click="$router.push('/login')">Đăng nhập</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="" />
          <div>
            <h1>HELLO</h1>
            <p>Trở thành viên của PlayBook</p>
          </div>
        </div>
        <div id="Signup_popup_close" @click="$router.push('/')">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>

    <!-- Popup Filter -->
    <div :class="{ hidden: !showFilterPopup }" id="filter_popup">
      <!-- ... existing filter popup content ... -->
    </div>

    <!-- Thêm component Loading -->
    <Loading />
  </div>
</template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import Loading from "@/components/Loading.vue"; // Import Loading component
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAvatarStore } from "@/stores/avatar";
import { useLoadingStore } from "@/stores/loading"; // Import Loading store
import {
  apiLogin,
  apiRegister,
  apiForgotPass,
} from "@/services/client/AuthService";
import { apiGetAllBooks } from "@/services/client/BookService";
import { apiGetAllBanners } from "@/services/admin/BannerService"; // Import API banner

export default {
  name: "HomePage",
  components: { ProductCard, Loading }, // Đăng ký Loading component
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const avatarStore = useAvatarStore();
    const loadingStore = useLoadingStore(); // Khởi tạo Loading store

    const currentRouteName = computed(() => route.name);
    const showFilterPopup = ref(false);
    const banners = ref([]); // Khởi tạo banners rỗng, sẽ lấy từ API
    const currentBanner = ref(0);
    let autoSlideInterval = null;

    // Form states
    const loginForm = ref({ email: "", pass_word: "" });
    const signupForm = ref({ user_name: "", email: "", pass_word: "" });
    const forgetPasswordForm = ref({ email: "" });
    const errorMessage = ref("");
    const successMessage = ref("");

    // Filter states
    const filterTags = ref(["Truyện", "Tiểu thuyết", "Trinh thám"]);
    const selectedTags = ref([]);
    const filters = ref({
      freeShipping: false,
      ratings: { 1: false, 2: false, 3: false, 4: false, 5: false },
      priceRanges: {
        under100k: false,
        "100k-200k": false,
        "200k-500k": false,
        "500k-1m": false,
        "1m-2m": false,
        over2m: false,
      },
    });
    const customPriceRange = ref({ from: "", to: "" });

    // Product states
    const products = ref([]);
    const viewedProducts = ref(JSON.parse(localStorage.getItem("viewedProducts")) || []);
    const sortOption = ref("newest");
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    // Hàm lấy danh sách banner từ API
    const fetchBanners = async () => {
      try {
        loadingStore.showLoading(); // Bật loading
        const response = await apiGetAllBanners();
        if (response.data.err === 0) {
          // Lấy danh sách banner_path từ response
          banners.value = response.data.data.map(banner => banner.banner_path);
          if (banners.value.length === 0) {
            // Fallback nếu không có banner từ API
            banners.value = ["Banner_00.png", "Banner_01.jpg"];
          }
        } else {
          console.error("Lỗi từ API banner:", response.data.msg);
          banners.value = ["Banner_00.png", "Banner_01.jpg"]; // Fallback
        }
      } catch (error) {
        console.error("Không thể lấy danh sách banner:", error);
        banners.value = ["Banner_00.png", "Banner_01.jpg"]; // Fallback
      } finally {
        loadingStore.hideLoading(); // Tắt loading
      }
    };

    // Authentication functions
    const login = async () => {
      try {
        loadingStore.showLoading(); // Bật loading
        const response = await apiLogin({
          email: loginForm.value.email,
          pass_word: loginForm.value.pass_word,
        });
        if (response.status === 200 && response.data.err !== 2) {
          localStorage.setItem("token", response.data.token);
          authStore.login();
          console.log(response.data?.avatar);
          const avatarUrl = response.data?.avatar || response.data?.avata;
          avatarStore.updateAvatar(avatarUrl || null);
          successMessage.value = "Đăng nhập thành công!";
          errorMessage.value = "";
          loginForm.value = { email: "", pass_word: "" };
          setTimeout(() => router.push("/"), 1000);
        } else {
          errorMessage.value = response.data.msg || "Đăng nhập thất bại";
          successMessage.value = "";
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || "Lỗi server";
        successMessage.value = "";
      } finally {
        loadingStore.hideLoading(); // Tắt loading
      }
    };

    const signup = async () => {
      try {
        loadingStore.showLoading(); // Bật loading
        const response = await apiRegister({
          user_name: signupForm.value.user_name,
          email: signupForm.value.email,
          pass_word: signupForm.value.pass_word,
        });
        if (response.status === 200 && response.data.err === 0) {
          localStorage.setItem("token", response.data.token);
          authStore.login();
          const avatarUrl = response.data.data?.avatar || response.data.data?.avata;
          avatarStore.updateAvatar(avatarUrl || null);
          successMessage.value = "Đăng ký thành công!";
          errorMessage.value = "";
          signupForm.value = { user_name: "", email: "", pass_word: "" };
          setTimeout(() => router.push("/"), 1000);
        } else {
          errorMessage.value = response.data.msg || "Đăng ký thất bại";
          successMessage.value = "";
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || "Lỗi server";
        successMessage.value = "";
      } finally {
        loadingStore.hideLoading(); // Tắt loading
      }
    };

    const forgetPassword = async () => {
      try {
        loadingStore.showLoading(); // Bật loading
        const response = await apiForgotPass({
          email: forgetPasswordForm.value.email,
        });
        if (response.status === 200 && response.data.err === 0) {
          successMessage.value = "Mật khẩu mới đã được gửi tới email!";
          errorMessage.value = "";
          forgetPasswordForm.value = { email: "" };
          setTimeout(() => router.push("/login"), 1000);
        } else {
          errorMessage.value = response.data.msg || "Gửi mã thất bại";
          successMessage.value = "";
        }
      } catch (error) {
        errorMessage.value = error.response?.data?.message || "Lỗi server";
        successMessage.value = "";
      } finally {
        loadingStore.hideLoading(); // Tắt loading
      }
    };

    const logout = () => {
      authStore.logout();
      avatarStore.updateAvatar(null);
      localStorage.removeItem("token");
      localStorage.removeItem("viewedProducts");
      viewedProducts.value = [];
      router.push("/login");
    };

    // Product functions
    const goToProductDetail = (id) => {
      const product = products.value.find((p) => p.id === id);
      if (product) {
        let viewed = [...viewedProducts.value];
        if (!viewed.some((p) => p.id === id)) {
          viewed.push(product);
          if (viewed.length > 5) viewed.shift();
          viewedProducts.value = viewed;
          localStorage.setItem("viewedProducts", JSON.stringify(viewed));
        }
      }
      router.push(`/product/${id}`);
    };

    const fetchBooks = async () => {
      try {
        loadingStore.showLoading(); // Bật loading
        const response = await apiGetAllBooks();
        if (response.data.err === 0) {
          products.value = response.data.data.map((book) => ({
            id: book.book_id,
            image: book.images[0]?.image_path || "Product_00.png",
            discountedPrice: book.price * (1 - (book.discount_price || 0) / 100),
            originalPrice: book.price,
            author: book.author,
            title: book.title,
            sold: book.warehouses[0]?.sold_quantity || 0,
            tags: [`${book.bookType?.tag || ''}`, `${book.rating_avg || 0}Sao`],
            publishedDate: new Date(book.published_date),
            rating: book.rating_avg || 0,
            freeShipping: book.free_shipping || false,
          }));
          sortProducts();
        }
      } catch (error) {
        console.error("Lỗi khi lấy sách:", error);
      } finally {
        loadingStore.hideLoading(); // Tắt loading
      }
    };

    const sortProducts = () => {
      const sorted = [...filteredProducts.value];
      switch (sortOption.value) {
        case "popular":
        case "best-seller":
          sorted.sort((a, b) => b.sold - a.sold);
          break;
        case "low-to-high":
          sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
          break;
        case "high-to-low":
          sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
          break;
        case "newest":
          sorted.sort((a, b) => b.publishedDate - a.publishedDate);
          break;
      }
      products.value = sorted;
    };

    // Filter computed properties
    const hasPriceRangeSelected = computed(() =>
      Object.values(filters.value.priceRanges).some((value) => value)
    );

    const filteredProducts = computed(() => {
      let filtered = [...products.value];
      if (selectedTags.value.length > 0) {
        filtered = filtered.filter((product) =>
          product.tags.some((tag) => selectedTags.value.includes(tag))
        );
      }
      if (filters.value.freeShipping) {
        filtered = filtered.filter((product) => product.freeShipping);
      }
      const selectedRatings = Object.entries(filters.value.ratings)
        .filter(([, selected]) => selected)
        .map(([rating]) => Number(rating));
      if (selectedRatings.length > 0) {
        filtered = filtered.filter((product) =>
          selectedRatings.includes(Math.round(product.rating))
        );
      }
      const selectedPriceRanges = Object.keys(filters.value.priceRanges).filter(
        (key) => filters.value.priceRanges[key]
      );
      if (
        selectedPriceRanges.length > 0 ||
        (customPriceRange.value.from && customPriceRange.value.to)
      ) {
        filtered = filtered.filter((product) => {
          const price = product.discountedPrice;
          if (customPriceRange.value.from && customPriceRange.value.to) {
            const from = Number(customPriceRange.value.from);
            const to = Number(customPriceRange.value.to);
            return price >= from && price <= to;
          }
          return selectedPriceRanges.some((range) => {
            switch (range) {
              case "under100k": return price < 100000;
              case "100k-200k": return price >= 100000 && price <= 200000;
              case "200k-500k": return price >= 200000 && price <= 500000;
              case "500k-1m": return price >= 500000 && price <= 1000000;
              case "1m-2m": return price >= 1000000 && price <= 2000000;
              case "over2m": return price > 2000000;
            }
          });
        });
      }
      return filtered;
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const totalPages = computed(() =>
      Math.ceil(filteredProducts.value.length / itemsPerPage.value)
    );

    // Filter methods
    const clearCustomPriceRange = () => {
      customPriceRange.value = { from: "", to: "" };
    };

    const clearAllFilters = () => {
      filters.value.freeShipping = false;
      Object.keys(filters.value.ratings).forEach(
        (key) => (filters.value.ratings[key] = false)
      );
      Object.keys(filters.value.priceRanges).forEach(
        (key) => (filters.value.priceRanges[key] = false)
      );
      selectedTags.value = [];
      clearCustomPriceRange();
      currentPage.value = 1;
    };

    const showResults = () => {
      showFilterPopup.value = false;
      currentPage.value = 1;
      sortProducts();
    };

    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag);
      if (index === -1) selectedTags.value.push(tag);
      else selectedTags.value.splice(index, 1);
      currentPage.value = 1;
    };

    // Banner methods
    const nextBanner = () => {
      currentBanner.value = (currentBanner.value + 1) % banners.value.length;
    };

    const prevBanner = () => {
      currentBanner.value =
        (currentBanner.value - 1 + banners.value.length) % banners.value.length;
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextBanner, 10000);
    };

    // Lifecycle hooks
    onMounted(() => {
      startAutoSlide();
      authStore.initializeAuth();
      avatarStore.initializeAvatar();
      fetchBooks();
      fetchBanners(); // Gọi API banner khi trang được mount
    });

    onUnmounted(() => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    });

    return {
      authStore,
      avatarStore,
      currentRouteName,
      showFilterPopup,
      banners,
      currentBanner,
      nextBanner,
      prevBanner,
      loginForm,
      signupForm,
      forgetPasswordForm,
      errorMessage,
      successMessage,
      login,
      signup,
      forgetPassword,
      logout,
      goToProductDetail,
      paginatedProducts,
      viewedProducts,
      currentPage,
      totalPages,
      sortOption,
      sortProducts,
      filters,
      customPriceRange,
      hasPriceRangeSelected,
      clearCustomPriceRange,
      clearAllFilters,
      showResults,
      filterTags,
      selectedTags,
      toggleTag,
    };
  },
};
</script>

<style>
@import "@/assets/css/Address_popup.css";
@import "@/assets/css/AppHome.css";
@import "@/assets/css/Filter_popup.css";
@import "@/assets/css/Login_popup.css";
@import "@/assets/css/General.css";
@import "@/assets/css/Forget_Pass_popup.css";
@import "@/assets/css/Signup_popup.css";
@import "@/assets/css/BannerHome.css";
@import "@/assets/css/PaginationHome.css";

.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #007bff;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logout-btn {
  padding: 5px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.error-message {
  color: red;
  margin: 10px 0;
  font-size: 0.9em;
}

.success-message {
  color: green;
  margin: 10px 0;
  font-size: 0.9em;
}

#pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
}

#pagination button {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
}

#pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#pagination .active button {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

#filter_tag_cover {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.filter_tag {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter_tag:hover,
.filter_tag.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

#filter {
  margin-bottom: 20px;
}

#filter_tag_all {
  padding: 8px 15px;
  cursor: pointer;
}
</style>