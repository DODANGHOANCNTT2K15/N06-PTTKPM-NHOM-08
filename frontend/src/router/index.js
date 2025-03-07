import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Điều chỉnh đường dẫn nếu cần

// Layouts
import ClientLayout from '@/layouts/ClientLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Client Pages
import HomePage from '@/pages/client/HomePage.vue'; 
import ProductDetail from '@/pages/client/ProductDetail.vue';
import CartPage from '@/pages/client/CartPage.vue';
import UserPage from '@/pages/client/UserPage.vue';
import NotFound from '@/pages/client/NotFound.vue';
import SearchResults from '@/pages/client/SearchResults.vue';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard.vue';
import Books from '@/pages/admin/Books.vue';
import Users from '@/pages/admin/Users.vue';
import Orders from '@/pages/admin/Orders.vue';
import Banners from '@/pages/admin/Banners.vue';
import Tags from '@/pages/admin/Tags.vue';
import Promotions from '@/pages/admin/Promotions.vue';

// Định nghĩa routes
const routes = [
  {
    path: '/',
    component: ClientLayout,
    children: [
      { path: '', name: 'HomePage', component: HomePage, meta: { title: 'Trang chủ' } },
      { path: 'product/:id', name: 'ProductPage', component: ProductDetail, meta: { title: 'Chi tiết sản phẩm' } },
      { path: 'cart', name: 'CartPage', component: CartPage, meta: { requiresAuth: true, title: 'Giỏ hàng' } },
      { path: 'search-results', name: 'SearchResults', component: SearchResults, meta: { title: 'Kết quả tìm kiếm' } },

      {
        path: 'user',
        component: UserPage,
        meta: { requiresAuth: true },
        children: [
          { path: '', name: 'UserDashboard', component: UserPage, meta: { title: 'Trang cá nhân' } },
          { path: 'info', name: 'UserInfo', component: UserPage, meta: { title: 'Thông tin cá nhân' } },
          { path: 'orders', name: 'UserOrders', component: UserPage, meta: { title: 'Đơn hàng' } },
          { path: 'address', name: 'UserAddress', component: UserPage, meta: { title: 'Địa chỉ' } },
          { path: 'like', name: 'UserLike', component: UserPage, meta: { title: 'Yêu thích' } },
          { path: 'history', name: 'UserHistory', component: UserPage, meta: { title: 'Lịch sử' } },
        ],
      },

      { path: '/login', name: 'Login', component: HomePage, meta: { title: 'Đăng nhập' } },
      { path: '/signup', name: 'Signup', component: HomePage, meta: { title: 'Đăng ký' } },
      { path: '/forget-password', name: 'ForgetPassword', component: HomePage, meta: { title: 'Quên mật khẩu' } },
      { path: '/filter', name: 'Filter', component: HomePage, meta: { title: 'Bộ lọc' } },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard, meta: { title: 'Bảng điều khiển' } },
      { path: 'books', name: 'BooksAdmin', component: Books, meta: { title: 'Quản lý Sách' } },
      { path: 'users', name: 'AdminUsers', component: Users, meta: { title: 'Quản lý Người dùng' } },
      { path: 'orders', name: 'AdminOrders', component: Orders, meta: { title: 'Quản lý Đơn hàng' } },
      { path: 'banners', name: 'AdminBanners', component: Banners, meta: { title: 'Quản lý Banner' } },
      { path: 'tags', name: 'AdminTags', component: Tags, meta: { title: 'Quản lý Tags' } },
      { path: 'promotions', name: 'AdminPromotions', component: Promotions, meta: { title: 'Quản lý Khuyến mãi' } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '404 - Không tìm thấy trang' },
  },
];

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Cập nhật tiêu đề trang động
router.afterEach((to) => {
  document.title = to.meta.title || 'Website';
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initializeAuth(); // Khởi tạo trạng thái từ localStorage

  // Nếu route yêu cầu đăng nhập mà chưa đăng nhập -> Chuyển hướng đến login
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return next('/login');
  }

  // Nếu route yêu cầu quyền admin mà không phải admin -> Chuyển hướng về trang chủ
  if (to.meta.requiresAdmin && !authStore.isAdmin()) {
    return next('/');
  }

  next();
});

export default router;
