import { createRouter, createWebHistory } from 'vue-router';
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

const routes = [
    {
      path: '/',
      component: ClientLayout,
      children: [
        {
          path: '',
          name: 'HomePage',
          component: HomePage 
        },
        {
          path: 'product/1',
          name: 'ProductPage',
          component: ProductDetail
        },
        {
          path: 'cart',
          name: 'CartPage',
          component: CartPage,
        },
        {
          path: 'user',
          component: UserPage, // Component chính cho trang user
          children: [
            {
              path: '',
              name: 'UserInfo',
              component: UserPage, // Sử dụng cùng UserPage nhưng với default content (info)
            },
            {
              path: 'info',
              name: 'UserInfo',
              component: UserPage, // Thông tin tài khoản (default)
            },
            {
              path: 'cart',
              name: 'UserCart',
              component: UserPage, // Giỏ hàng của user
            },
            {
              path: 'address',
              name: 'UserAddress',
              component: UserPage, // Địa chỉ của user
            },
            {
              path: 'like',
              name: 'UserLike',
              component: UserPage, // Sản phẩm yêu thích
            },
            {
              path: 'history',
              name: 'UserHistory',
              component: UserPage, // Lịch sử sản phẩm đã xem
            },
          ],
        },
        {
        path: '/login',
        name: 'Login',
        component: HomePage, // Sử dụng cùng HomePage.vue
      },
      {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: HomePage, // Sử dụng cùng HomePage.vue
      },
      {
        path: '/signup',
        name: 'Signup',
        component: HomePage, // Sử dụng cùng HomePage.vue
      },
      {
        path: '/address',
        name: 'Address',
        component: HomePage,
      },
      {
        path: '/filter',
        name: 'Filter',
        component: HomePage,
      },
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      children: [
        {
          path: 'dashboard',
          name: 'AdminDashboard',
          component: Dashboard,
        },
        {
          path: 'books',
          name: 'BooksAdmin',
          component: Books,
        },
        {
          path: 'users',
          name: 'AdminUsers',
          component: Users,
        },
        {
          path: 'orders',
          name: 'AdminOrders',
          component: Orders,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound,
    },
  ];
  

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
