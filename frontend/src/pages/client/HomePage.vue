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
              <img
                :src="require(`@/assets/images/${banner}`)"
                :alt="`Banner ${index + 1}`"
              />
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
                <label
                  for="sort-options"
                  style="font-size: 0.9em; opacity: 0.8; margin-right: 10px"
                  >Sắp xếp</label
                >
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
          <!-- Hiển thị tối đa 4 sản phẩm, cuộn ngang nếu nhiều hơn -->
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
          <!-- Hiển thị thông báo nếu chưa có sản phẩm đã xem -->
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
          <input
            v-model="loginForm.email"
            type="text"
            placeholder="Email hoặc số điện thoại"
          />
          <input
            v-model="loginForm.pass_word"
            type="password"
            placeholder="Mật khẩu"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <p id="forget_password">
            <router-link to="/forget-password">Quên mật khẩu?</router-link>
          </p>
          <button @click="login">Đăng nhập</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Chưa có tài khoản?</span
            ><span @click="$router.push('/signup')">Tạo tài khoản</span>
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
    <div
      :class="{ hidden: currentRouteName !== 'ForgetPassword' }"
      id="Forget_Pass_popup"
    >
      <div>
        <div>
          <h1>Oh,</h1>
          <p>Bạn quên mật khẩu?</p>
          <input
            v-model="forgetPasswordForm.email"
            type="text"
            placeholder="Email hoặc số điện thoại"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <button @click="forgetPassword">Gửi mã</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span
            ><span @click="$router.push('/login')">Đăng nhập</span>
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
          <input
            v-model="signupForm.user_name"
            type="text"
            placeholder="Họ và tên"
          />
          <input
            v-model="signupForm.email"
            type="text"
            placeholder="Email hoặc số điện thoại"
          />
          <input
            v-model="signupForm.pass_word"
            type="password"
            placeholder="Mật khẩu"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <p v-if="successMessage" class="success-message">
            {{ successMessage }}
          </p>
          <button @click="signup">Đăng ký</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="" />
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span
            ><span @click="$router.push('/login')">Đăng nhập</span>
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
      <div>
        <div>
          <h1>Tất cả bộ lọc</h1>
        </div>
        <div>
          <div class="filter_group_cover" style="border: none">
            <h1>Dịch vụ</h1>
            <div>
              <div>
                <input
                  type="checkbox"
                  v-model="filters.freeShipping"
                  id="freeShipping"
                />
                <label for="freeShipping">Giao hàng miễn phí</label>
              </div>
            </div>
          </div>
          <div class="filter_group_cover">
            <h1>Đánh giá</h1>
            <div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.ratings['1']"
                  id="rating1"
                />
                <label for="rating1">⭐ 1 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.ratings['2']"
                  id="rating2"
                />
                <label for="rating2">⭐⭐ 2 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.ratings['3']"
                  id="rating3"
                />
                <label for="rating3">⭐⭐⭐ 3 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.ratings['4']"
                  id="rating4"
                />
                <label for="rating4">⭐⭐⭐⭐ 4 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.ratings['5']"
                  id="rating5"
                />
                <label for="rating5">⭐⭐⭐⭐⭐ 5 Sao</label>
              </div>
            </div>
          </div>
          <div class="filter_group_cover">
            <h1>Giá</h1>
            <div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['under100k']"
                  id="under100k"
                />
                <label for="under100k">Dưới 100.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['100k-200k']"
                  id="100k-200k"
                />
                <label for="100k-200k">100.000₫ - 200.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['200k-500k']"
                  id="200k-500k"
                />
                <label for="200k-500k">200.000₫ - 500.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['500k-1m']"
                  id="500k-1m"
                />
                <label for="500k-1m">500.000₫ - 1.000.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['1m-2m']"
                  id="1m-2m"
                />
                <label for="1m-2m">1.000.000₫ - 2.000.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input
                  type="checkbox"
                  v-model="filters.priceRanges['over2m']"
                  id="over2m"
                />
                <label for="over2m">Trên 2.000.000₫</label>
              </div>
            </div>
            <div v-if="!hasPriceRangeSelected">
              <h1>Tự nhập khoảng giá</h1>
              <div>
                <div id="about_price">
                  <input
                    type="text"
                    v-model="customPriceRange.from"
                    placeholder="Từ"
                  />
                  <span>_</span>
                  <input
                    type="text"
                    v-model="customPriceRange.to"
                    placeholder="Đến"
                  />
                  <button type="button" @click="clearCustomPriceRange">
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="filter_popup_button">
          <button @click="clearAllFilters">Xóa tất cả</button>
          <button @click="showResults">Xem kết quả</button>
        </div>
        <div>
          <i class="fas fa-times" @click="showFilterPopup = false"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  apiLogin,
  apiRegister,
  apiForgotPass,
} from "@/services/client/AuthService";
import { apiGetAllBooks } from "@/services/client/BookService";

export default {
  name: "HomePage",
  components: { ProductCard },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();

    const currentRouteName = computed(() => route.name);
    const showFilterPopup = ref(false);
    const banners = ref(["Banner_00.png", "Banner_01.jpg"]);
    const currentBanner = ref(0);
    let autoSlideInterval = null;

    // State cho form
    const loginForm = ref({ email: "", pass_word: "" });
    const signupForm = ref({ user_name: "", email: "", pass_word: "" });
    const forgetPasswordForm = ref({ email: "" });
    const errorMessage = ref("");
    const successMessage = ref("");

    // Thêm filter tags
    const filterTags = ref(["Truyện", "Tiểu thuyết", "Trinh thám"]);
    const selectedTags = ref([]);

    // State cho sản phẩm và sản phẩm đã xem
    const products = ref([]);
    // Khởi tạo viewedProducts với giá trị mặc định từ localStorage
    const viewedProducts = ref(
      JSON.parse(localStorage.getItem("viewedProducts")) || []
    );
    const sortOption = ref("newest");
    const itemsPerPage = ref(10);
    const currentPage = ref(1);

    // Hàm đăng nhập
    const login = async () => {
      try {
        const response = await apiLogin({
          email: loginForm.value.email,
          pass_word: loginForm.value.pass_word,
        });
        if (response.status === 200 && response.data.err === 0) {
          localStorage.setItem("token", response.data.token);
          authStore.login();
          successMessage.value = "Đăng nhập thành công!";
          errorMessage.value = "";
          loginForm.value = { email: "", pass_word: "" };
          setTimeout(() => router.push("/"), 1000);
        } else {
          errorMessage.value = response.data.msg;
        }
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || "Đăng nhập thất bại!";
        successMessage.value = "";
      }
    };

    // Hàm đăng ký
    const signup = async () => {
      try {
        const response = await apiRegister({
          user_name: signupForm.value.user_name,
          email: signupForm.value.email,
          pass_word: signupForm.value.pass_word,
        });
        if (response.status === 200 && response.data.err === 0) {
          localStorage.setItem("token", response.data.token);
          authStore.login();
          successMessage.value = "Đăng ký thành công! Đang chuyển hướng...";
          errorMessage.value = "";
          signupForm.value = { user_name: "", email: "", pass_word: "" };
          setTimeout(() => router.push("/"), 1000);
        } else {
          successMessage.value = "";
          errorMessage.value = response.data.msg;
        }
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || "Đăng ký thất bại!";
        successMessage.value = "";
      }
    };

    // Hàm quên mật khẩu
    const forgetPassword = async () => {
      try {
        const response = await apiForgotPass({
          email: forgetPasswordForm.value.email,
        });
        if (response.status === 200 && response.data.err === 0) {
          successMessage.value = "Mật khẩu mới đã được gửi tới email của bạn!";
          errorMessage.value = "";
          setTimeout(() => router.push("/login"), 1000);
          forgetPasswordForm.value = { email: "" };
        } else {
          successMessage.value = "";
          errorMessage.value = response.data.msg;
        }
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || "Không thể gửi mã!";
        successMessage.value = "";
      }
    };

    // Hàm chuyển hướng đến chi tiết sản phẩm và lưu vào lịch sử xem
    const goToProductDetail = (id) => {
      const product = products.value.find((p) => p.id === id);
      if (product) {
        let viewed = [...viewedProducts.value]; // Lấy danh sách hiện tại
        
        // Kiểm tra xem sản phẩm đã có trong danh sách chưa
        if (!viewed.some((p) => p.id === id)) {
          viewed.push(product);
          // Giới hạn số lượng sản phẩm đã xem (tối đa 5 sản phẩm)
          if (viewed.length > 5) {
            viewed.shift(); // Xóa sản phẩm cũ nhất nếu vượt quá giới hạn
          }
          // Cập nhật và lưu lại vào localStorage
          viewedProducts.value = viewed;
          localStorage.setItem("viewedProducts", JSON.stringify(viewed));
        }
      }
      router.push(`/product/${id}`);
    };

    // Hàm gọi API lấy sách
    const fetchBooks = async () => {
      try {
        const response = await apiGetAllBooks();
        if (response.data.err === 0) {
          const books = response.data.data.map((book) => ({
            id: book.book_id,
            image: book.images[0]?.image_path || "Product_00.png",
            discountedPrice: book.price * (1 - book.discount_price / 100),
            originalPrice: book.price,
            author: book.author,
            title: book.title,
            sold: book.warehouses[0]?.sold_quantity || 0,
            tags: [`${book.bookType.tag}`, `${book.rating_avg}Sao`],
            publishedDate: new Date(book.published_date),
            rating: book.rating_avg || 0,
            freeShipping: book.free_shipping || false,
          }));
          products.value = books;
          sortProducts();
        } else {
          console.error("Lỗi từ API:", response.data.msg);
        }
      } catch (error) {
        console.error("Không thể lấy dữ liệu sách:", error);
      }
    };

    // Hàm sắp xếp sản phẩm
    const sortProducts = () => {
      const sortedProducts = [...filteredProducts.value];
      switch (sortOption.value) {
        case "popular":
        case "best-seller":
          sortedProducts.sort((a, b) => b.sold - a.sold);
          break;
        case "low-to-high":
          sortedProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
          break;
        case "high-to-low":
          sortedProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
          break;
        case "newest":
          sortedProducts.sort((a, b) => b.publishedDate - a.publishedDate);
          break;
      }
      products.value = sortedProducts;
    };

    // Filter logic
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

    const hasPriceRangeSelected = computed(() => {
      return Object.values(filters.value.priceRanges).some((value) => value);
    });

    // Logic lọc sản phẩm
    const filteredProducts = computed(() => {
      let filtered = [...products.value];

      // Tag filter
      if (selectedTags.value.length > 0) {
        filtered = filtered.filter((product) =>
          product.tags.some((tag) => selectedTags.value.includes(tag))
        );
      }

      // Free shipping filter
      if (filters.value.freeShipping) {
        filtered = filtered.filter((product) => product.freeShipping);
      }

      // Rating filter
      const selectedRatings = Object.entries(filters.value.ratings)
        .filter(([, selected]) => selected)
        .map(([rating]) => Number(rating));
      if (selectedRatings.length > 0) {
        filtered = filtered.filter((product) =>
          selectedRatings.includes(Math.round(product.rating))
        );
      }

      // Price range filter
      const selectedPriceRanges = Object.keys(filters.value.priceRanges).filter(
        (key) => filters.value.priceRanges[key]
      );
      if (
        selectedPriceRanges.length > 0 ||
        (customPriceRange.value.from && customPriceRange.value.to)
      ) {
        filtered = filtered.filter((product) => {
          const price = product.discountedPrice;

          // Custom price range
          if (customPriceRange.value.from && customPriceRange.value.to) {
            const from = Number(customPriceRange.value.from);
            const to = Number(customPriceRange.value.to);
            return price >= from && price <= to;
          }

          // Predefined price ranges
          return selectedPriceRanges.some((range) => {
            switch (range) {
              case "under100k":
                return price < 100000;
              case "100k-200k":
                return price >= 100000 && price <= 200000;
              case "200k-500k":
                return price >= 200000 && price <= 500000;
              case "500k-1m":
                return price >= 500000 && price <= 1000000;
              case "1m-2m":
                return price >= 1000000 && price <= 2000000;
              case "over2m":
                return price > 2000000;
            }
          });
        });
      }

      return filtered;
    });

    // Tính toán sản phẩm phân trang dựa trên filteredProducts
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });

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
      if (index === -1) {
        selectedTags.value.push(tag);
      } else {
        selectedTags.value.splice(index, 1);
      }
      currentPage.value = 1;
    };

    // Banner logic
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

    onMounted(() => {
      startAutoSlide();
      authStore.initializeAuth();
      fetchBooks();
    });

    onUnmounted(() => {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
    });

    return {
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
      goToProductDetail,
      paginatedProducts,
      viewedProducts, // Đảm bảo trả về viewedProducts
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

.error-message {
  color: red;
  margin: 10px 0;
}

.success-message {
  color: green;
  margin: 10px 0;
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
  background-color: rgba(74, 141, 176, 1);
  color: white;
  border-color: rgba(74, 141, 176, 1);
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

/* Style cho filter section */
#filter {
  margin-bottom: 20px;
}

#filter_tag_all {
  padding: 8px 15px;
  cursor: pointer;
}
</style>