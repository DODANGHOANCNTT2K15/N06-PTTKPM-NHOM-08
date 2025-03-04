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
            <div class="div_banner">
              <img src="@/assets/images/Banner_00.png" alt="">
            </div>
            <div class="div_banner">
              <img src="@/assets/images/Banner_00.png" alt="">
            </div>
            <div class="div_banner">
              <img src="@/assets/images/Banner_00.png" alt="">
            </div>
            <div id="arrow_left" class="arrow_banner"><i class="fas fa-chevron-left"></i></div>
            <div id="arrow_right" class="arrow_banner"><i class="fas fa-chevron-right"></i></div>
          </div>
          <div id="filter">
            <div><h1>Tất cả sản phẩm</h1></div>
            <div>
              <div id="filter_tag_cover">
                <div class="filter_tag">Truyện</div>
                <div class="filter_tag">Tiểu thuyết</div>
                <div class="filter_tag">Trinh thám</div>
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
                <label for="sort-options" style="font-size: 0.9em; opacity: 0.8; margin-right: 10px;">Sắp xếp</label>
                <select id="sort-options">
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
              :id="1"
              image="Product_00.png"
              :discountedPrice="600000"
              :originalPrice="1600000"
              author="DAISETZ TEITARO SUZUKI"
              title="Thiền luận"
              :sold="96"
              :tags="['khoahoc', '4Sao']"
              @click="goToProductDetail(1)"
            />
            <ProductCard
              :id="2"
              image="Product_00.png"
              :discountedPrice="350000"
              :originalPrice="800000"
              author="NGUYEN DU"
              title="Truyện Kiều"
              :sold="150"
              :tags="['van hoc', '5Sao']"
              @click="goToProductDetail(2)"
            />
            <ProductCard
              :id="3"
              image="Product_00.png"
              :discountedPrice="250000"
              :originalPrice="500000"
              author="STEPHEN HAWKING"
              title="Lược sử thời gian"
              :sold="200"
              :tags="['khoa hoc', '4Sao']"
              @click="goToProductDetail(3)"
            />
          </div>
          <div id="load_more">
            <button>XEM THÊM</button>
          </div>
        </div>
      </div>
      <div id="history">
        <div>
          <h1>Sản phẩm đã xem</h1>
        </div>
        <div>
          <ProductCard
              :id="1"
              image="Product_00.png"
              :discountedPrice="600000"
              :originalPrice="1600000"
              author="DAISETZ TEITARO SUZUKI"
              title="Thiền luận"
              :sold="96"
              :tags="['khoahoc', '4Sao']"
              @click="goToProductDetail(1)"
            />
        </div>
      </div>
    </main>

    <!-- Popup Login -->
    <div :class="{ 'hidden': currentRouteName !== 'Login' }" id="login_popup">
      <div>
        <div>
          <h1>Xin chào,</h1>
          <p>Đăng nhập để trải nghiệm tốt nhất từ PlayBook</p>
          <input type="text" placeholder="Email hoặc số điện thoại">
          <input type="text" placeholder="Mật khẩu">
          <p id="forget_password"><router-link to="/forget-password">Quên mật khẩu?</router-link></p>
          <button>Đăng nhập</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="">
          </div>
          <div id="login_popup_footer">
            <span>Chưa có tài khoản?</span><span @click="$router.push('/signup')">Tạo tài khoản</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="">
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
    <div :class="{ 'hidden': currentRouteName !== 'ForgetPassword' }" id="Forget_Pass_popup">
      <div>
        <div>
          <h1>Oh,</h1>
          <p>Bạn quên mật khẩu?</p>
          <input type="text" placeholder="Email hoặc số điện thoại">
          <button>Gửi mã</button>
          <input type="text" placeholder="Mã xác minh">
          <button>Đổi mật khẩu</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="">
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span><span @click="$router.push('/login')">Đăng nhập</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="">
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
    <div :class="{ 'hidden': currentRouteName !== 'Signup' }" id="Signup_popup">
      <div>
        <div>
          <h1>Đăng ký</h1>
          <p>Tham gia PlayBook ngay hôm nay!</p>
          <input type="text" placeholder="Họ và tên">
          <input type="text" placeholder="Email hoặc số điện thoại">
          <input type="password" placeholder="Mật khẩu">
          <button>Đăng ký</button>
          <div id="social_login">
            <img src="@/assets/images/Social_00.png" alt="">
          </div>
          <div id="login_popup_footer">
            <span>Bạn đã có tài khoản?</span><span @click="$router.push('/login')">Đăng nhập</span>
          </div>
        </div>
        <div>
          <img src="@/assets/images/image_00.png" alt="">
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
    <div :class="{ 'hidden': !showFilterPopup }" id="filter_popup">
      <div>
        <div>
          <h1>Tất cả bộ lọc</h1>
        </div>
        <div>
          <div class="filter_group_cover" style="border: none;">
            <h1>Dịch vụ</h1>
            <div>
              <div>
                <input type="checkbox" v-model="filters.freeShipping" id="freeShipping">
                <label for="freeShipping">Giao hàng miễn phí</label>
              </div>
            </div>
          </div>
          <div class="filter_group_cover">
            <h1>Đánh giá</h1>
            <div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.ratings['1']" id="rating1">
                <label for="rating1">⭐ 1 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.ratings['2']" id="rating2">
                <label for="rating2">⭐⭐ 2 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.ratings['3']" id="rating3">
                <label for="rating3">⭐⭐⭐ 3 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.ratings['4']" id="rating4">
                <label for="rating4">⭐⭐⭐⭐ 4 Sao</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.ratings['5']" id="rating5">
                <label for="rating5">⭐⭐⭐⭐⭐ 5 Sao</label>
              </div>
            </div>
          </div>
          <div class="filter_group_cover">
            <h1>Giá</h1>
            <div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['under100k']" id="under100k">
                <label for="under100k">Dưới 100.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['100k-200k']" id="100k-200k">
                <label for="100k-200k">100.000₫ - 200.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['200k-500k']" id="200k-500k">
                <label for="200k-500k">200.000₫ - 500.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['500k-1m']" id="500k-1m">
                <label for="500k-1m">500.000₫ - 1.000.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['1m-2m']" id="1m-2m">
                <label for="1m-2m">1.000.000₫ - 2.000.000₫</label>
              </div>
              <div class="checkbox_cover">
                <input type="checkbox" v-model="filters.priceRanges['over2m']" id="over2m">
                <label for="over2m">Trên 2.000.000₫</label>
              </div>
            </div>
            <!-- Hiển thị "Tự nhập khoảng giá" chỉ khi không có checkbox "Giá" nào được tích -->
            <div v-if="!hasPriceRangeSelected">
              <h1>Tự nhập khoảng giá</h1>
              <div>
                <div id="about_price">
                  <input type="text" v-model="customPriceRange.from" placeholder="Từ">
                  <span>_</span>
                  <input type="text" v-model="customPriceRange.to" placeholder="Đến">
                  <button type="button" @click="clearCustomPriceRange">Xóa</button>
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

    <!-- Popup Address -->
    <div :class="{ 'hidden': currentRouteName !== 'Address' }" id="address_popup">
      <div>
        <div>
          <div>
            <h1>Địa chỉ giao hàng</h1>
          </div>
          <div>
            <div>
              <p>Hãy chọn địa chỉ để nhân hàng để được dự báo thời gian giao hàng cùng chi phí đống gói, vận chuyển một cách chính xác nhất.</p>
              <button @click="$router.push('/login')">
                Đăng nhập để lưu địa chỉ giao hàng
              </button>
              <span>Hoặc</span>
            </div>
            <div>
              <div>
                <div class="input_address">
                  <span>Tỉnh/Thành phố</span>
                  <input type="text" placeholder="Vui lòng nhập tỉnh/thành phố">
                </div>
                <div class="input_address">
                  <span>Quận/Huyện</span>
                  <input type="text" placeholder="Vui lòng nhập quận/huyện">
                </div>
                <div class="input_address">
                  <span>Phường/Xã</span>
                  <input type="text" placeholder="Vui lòng nhập phường/xã">
                </div>
                <div class="input_address">
                  <span>Chi tiết</span>
                  <input type="text" placeholder="Vui lòng nhập chi tiết địa chỉ">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="address_popup_button">
          <button>
            Giao đến địa chỉ này
          </button>
        </div>
        <div id="address_popup_close" @click="$router.push('/')">
          <i class="fas fa-times"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: "HomePage",
  components: { ProductCard },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const currentRouteName = computed(() => route.name);
    const showFilterPopup = ref(false);

    const goToFilter = () => {
      router.push('/filter');
    };

    // Khởi tạo trạng thái cho các bộ lọc
    const filters = ref({
      freeShipping: false,
      ratings: { '1': false, '2': false, '3': false, '4': false, '5': false },
      priceRanges: {
        under100k: false,
        '100k-200k': false,
        '200k-500k': false,
        '500k-1m': false,
        '1m-2m': false,
        over2m: false,
      },
    });

    const customPriceRange = ref({ from: '', to: '' });

    // Kiểm tra xem có checkbox "Giá" nào được tích không
    const hasPriceRangeSelected = computed(() => {
      return Object.values(filters.value.priceRanges).some(value => value === true);
    });

    // Xóa nội dung trong "Tự nhập khoảng giá"
    const clearCustomPriceRange = () => {
      customPriceRange.value = { from: '', to: '' };
    };

    // Xóa tất cả bộ lọc (checkbox và nội dung khoảng giá)
    const clearAllFilters = () => {
      filters.value.freeShipping = false;
      Object.keys(filters.value.ratings).forEach(key => filters.value.ratings[key] = false);
      Object.keys(filters.value.priceRanges).forEach(key => filters.value.priceRanges[key] = false);
      customPriceRange.value = { from: '', to: '' };
    };

    // Hiển thị kết quả sau 2 giây (giả lập xử lý, không tác động gì)
    const showResults = () => {
      console.log('Applying filters:', filters.value, customPriceRange.value);
      setTimeout(() => {
        router.push('/filter-results'); // Chuyển hướng đến trang kết quả sau 2 giây
      }, 2000);
    };

    // Chuyển hướng đến trang chi tiết sản phẩm
    const goToProductDetail = (id) => {
      router.push(`/product/${id}`);
    };

    return {
      currentRouteName,
      goToFilter,
      showFilterPopup,
      filters,
      customPriceRange,
      hasPriceRangeSelected,
      clearCustomPriceRange,
      clearAllFilters,
      showResults,
      goToProductDetail,
    };
  },
};
</script>

<style>
/* Bỏ scoped để áp dụng CSS global, nhưng giữ import các file CSS */
@import "@/assets/css/Address_popup.css";
@import "@/assets/css/AppHome.css";
@import "@/assets/css/Filter_popup.css";
@import "@/assets/css/Login_popup.css";
@import "@/assets/css/General.css";
@import "@/assets/css/Forget_Pass_popup.css";
@import "@/assets/css/Signup_popup.css";
</style>