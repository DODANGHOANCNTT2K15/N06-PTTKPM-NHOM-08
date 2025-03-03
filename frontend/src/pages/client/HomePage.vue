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
                    <div id="filter_tag_all" @click="goToFilter">
                        <div>
                        <i class="fas fa-filter"></i>
                        Tất cả
                        </div>
                    </div>
                    </div>
                </div>
                <div>
                    <div>
                    <label for="sort-options" style="font-size: 0.9em; opacity: 0.8;margin-right: 10px;">Sắp xếp</label>
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
                    image="Product_00.png"
                    :discountedPrice="600000"
                    :originalPrice="1600000"
                    author="DAISETZ TEITARO SUZUKI"
                    title="Thiền luận"
                    :sold="96"
                    :tags="['khoahoc', '4Sao']"
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
                image="Product_00.png"
                :discountedPrice="600000"
                :originalPrice="1600000"
                author="DAISETZ TEITARO SUZUKI"
                title="Thiền luận"
                :sold="96"
                :tags="['khoahoc', '4Sao']"
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
        <div :class="{ 'hidden': currentRouteName !== 'Filter' }" id="filter_popup">
            <div>
            <div>
                <h1>Tất cả bộ lọc</h1>
            </div>
            <div>
                <div class="filter_group_cover" style="border: none;">
                <h1>Dịch vụ</h1>
                <div>
                    <div>
                    <input type="checkbox" name="" id="">
                    <label for="">Giao hàng miễn phí</label>
                    </div>
                </div>
                </div>
                <div class="filter_group_cover">
                <h1>Đánh giá</h1>
                <div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">⭐</label> <label for=""> 1 Sao</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">⭐⭐</label><label for=""> 2 Sao</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">⭐⭐⭐</label><label for=""> 3 Sao</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">⭐⭐⭐⭐</label><label for=""> 4 Sao</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">⭐⭐⭐⭐⭐</label><label for=""> 5 Sao</label>
                    </div>
                </div>
                </div>
                <div class="filter_group_cover">
                <h1>Giá</h1>
                <div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">Dưới 100.000₫</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">100.000₫ - 200.000₫</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">200.000₫ - 500.000₫</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">500.000₫ - 1.000.000₫</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">1.000.000₫ - 2.000.000₫</label>
                    </div>
                    <div class="checkbox_cover">
                    <input type="checkbox" name="" id="">
                    <label for="">Trên 2.000.000₫</label>
                    </div>
                </div>
                <h1>Tự nhập khoảng giá</h1>
                <div>
                    <div id="about_price">
                    <input type="text" name="" id="" placeholder="Từ">
                    <span>_</span>
                    <input type="text" name="" id="" placeholder="Đến">
                    <button type="">Xóa</button>
                    </div>
                </div>
                </div>
            </div>
            <div id="filter_popup_button">
                <button>Xóa tất cả</button>
                <button>Xem kết quả</button>
            </div>
            <div>
                <i class="fas fa-times" @click="$router.push('/')"></i>
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: "HomePage",
  components: { ProductCard },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const currentRouteName = computed(() => route.name);

    const goToFilter = () => {
      router.push('/filter');
    };

    return {
      currentRouteName,
      goToFilter, // Sửa tên hàm cho đồng nhất
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