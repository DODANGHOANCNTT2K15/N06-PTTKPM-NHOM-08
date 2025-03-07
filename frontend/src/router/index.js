import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Điều chỉnh đường dẫn nếu cần
import ClientLayout from '@/layouts/ClientLayout.vue';
import HomePage from '@/pages/client/HomePage.vue'; 
import ProductDetail from '@/pages/client/ProductDetail.vue';
import CartPage from '@/pages/client/CartPage.vue';
import UserPage from '@/pages/client/UserPage.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';
import Dashboard from '@/pages/admin/Dashboard.vue';
import Books from '@/pages/admin/Books.vue';
import Users from '@/pages/admin/Users.vue';
import Orders from '@/pages/admin/Orders.vue';
import NotFound from '@/pages/client/NotFound.vue';
import Banners from '@/pages/admin/Banners.vue';
import Tags from '@/pages/admin/Tags.vue';
import Promotions from '@/pages/admin/Promotions.vue';
import SearchResults from '@/pages/client/SearchResults.vue';

// Định nghĩa routes
const routes = [
  {
    path: '/',
    component: ClientLayout,
    children: [
      { path: '', name: 'HomePage', component: HomePage },
      { path: 'product/:id', name: 'ProductPage', component: ProductDetail },
      { 
        path: 'cart', 
        name: 'CartPage', 
        component: CartPage, 
        meta: { requiresAuth: true },
      },
      {
        path: 'user',
        component: UserPage,
        meta: { requiresAuth: true },
        children: [
          { path: '', name: 'UserInfo', component: UserPage },
          { path: 'info', name: 'UserInfo', component: UserPage },
          { path: 'orders', name: 'UserOrders', component: UserPage },
          { path: 'address', name: 'UserAddress', component: UserPage },
          { path: 'like', name: 'UserLike', component: UserPage },
          { path: 'history', name: 'UserHistory', component: UserPage },
        ],
      },
      { path: '/login', name: 'Login', component: HomePage },
      { path: '/forget-password', name: 'ForgetPassword', component: HomePage },
      { path: '/signup', name: 'Signup', component: HomePage },
      { path: '/address', name: 'Address', component: HomePage },
      { path: '/search-results', name: 'SearchResults', component: SearchResults },
      { path: '/filter', name: 'Filter', component: HomePage },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: Dashboard },
      { path: 'books', name: 'BooksAdmin', component: Books },
      { path: 'users', name: 'AdminUsers', component: Users },
      { path: 'orders', name: 'AdminOrders', component: Orders },
      { path: 'banners', name: 'AdminBanners', component: Banners },
      { path: 'tags', name: 'AdminTags', component: Tags },
      { path: 'promotions', name: 'AdminPromotions', component: Promotions },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

// Tạo router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.initializeAuth(); // Khởi tạo trạng thái từ localStorage

  // Kiểm tra nếu route yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login'); // Chuyển hướng đến login nếu chưa đăng nhập
  }
  // Kiểm tra nếu route yêu cầu quyền admin
  else if (to.meta.requiresAdmin && !authStore.isAdmin()) {
    next('/'); // Chuyển hướng về trang chủ nếu không phải admin
  }
  // Cho phép điều hướng nếu không có hạn chế
  else {
    next();
  }
});

export default router;