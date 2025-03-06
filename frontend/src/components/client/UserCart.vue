<template>
    <div class="profile-info-content">
      <h2>Giỏ hàng của bạn</h2>
      <div class="cart-table-container">
        <table class="cart-table">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá tiền</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedCartItems" :key="item.id">
              <td><input type="checkbox" v-model="item.selected" /></td>
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>
                <img :src="item.image" alt="Product Image" class="product-image" />
              </td>
              <td>
                <router-link :to="`/product/${item.id}`" class="product-name">
                  {{ item.name }}
                </router-link>
              </td>
              <td>{{ formatPrice(item.price) }}</td>
              <td>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="quantity-input"
                  @change="updateCartItem(item)"
                />
              </td>
              <td>{{ formatPrice(item.price * item.quantity) }}</td>
              <td>
                <button class="delete-btn" @click="removeCartItem(item.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="cartItems.length === 0" class="no-items">
          Giỏ hàng của bạn đang trống.
        </p>
  
        <!-- Tổng tiền và nút thanh toán -->
        <div class="cart-summary" v-if="cartItems.length > 0">
          <p>Tổng tiền: <strong>{{ formatPrice(totalCartPrice) }}</strong></p>
          <button class="checkout-btn" @click="proceedToCheckout">Thanh toán</button>
        </div>
  
        <!-- Phân trang -->
        <div class="pagination" v-if="cartItems.length > itemsPerPage">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-btn"
          >
            Trước
          </button>
          <span>Trang {{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="pagination-btn"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'UserCart',
    setup() {
      const cartItems = ref([]);
      const itemsPerPage = ref(5); // Số sản phẩm mỗi trang
      const currentPage = ref(1); // Trang hiện tại
      const selectAll = ref(false); // Checkbox chọn tất cả
      const router = useRouter();
  
      // Tính tổng số trang
      const totalPages = computed(() =>
        Math.ceil(cartItems.value.length / itemsPerPage.value)
      );
  
      // Lấy danh sách sản phẩm cho trang hiện tại
      const paginatedCartItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return cartItems.value.slice(start, end);
      });
  
      // Tính tổng tiền giỏ hàng
      const totalCartPrice = computed(() =>
        cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
      );
  
      // Format giá tiền
      const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price);
      };
  
      // Lấy dữ liệu giỏ hàng (giả lập)
      const fetchCartItems = () => {
        cartItems.value = [
          { id: 1, name: 'Sách 1', price: 150000, quantity: 1, image: require('@/assets/images/Product_00.png'), selected: false },
          { id: 2, name: 'Sách 2', price: 200000, quantity: 2, image: require('@/assets/images/Product_00.png'), selected: false },
          { id: 3, name: 'Sách 3', price: 120000, quantity: 1, image: require('@/assets/images/Product_00.png'), selected: false },
          { id: 4, name: 'Sách 4', price: 180000, quantity: 3, image: require('@/assets/images/Product_00.png'), selected: false },
        ];
      };
  
      // Chọn hoặc bỏ chọn tất cả trên trang hiện tại
      const toggleSelectAll = () => {
        paginatedCartItems.value.forEach((item) => {
          item.selected = selectAll.value;
        });
      };
  
      // Cập nhật số lượng sản phẩm
      const updateCartItem = (item) => {
        console.log('Đã cập nhật số lượng:', item);
        // Gọi API thực tế để cập nhật giỏ hàng nếu cần
      };
  
      // Xóa sản phẩm khỏi giỏ hàng
      const removeCartItem = (id) => {
        const index = cartItems.value.findIndex((item) => item.id === id);
        if (index !== -1) {
          cartItems.value.splice(index, 1);
          alert('Đã xóa sản phẩm khỏi giỏ hàng!');
          if (paginatedCartItems.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
          }
        }
      };
  
      // Chuyển hướng đến trang thanh toán
      const proceedToCheckout = () => {
        router.push('/checkout');
      };
  
      onMounted(() => {
        fetchCartItems();
      });
  
      return {
        cartItems,
        itemsPerPage,
        currentPage,
        selectAll,
        totalPages,
        paginatedCartItems,
        totalCartPrice,
        formatPrice,
        toggleSelectAll,
        updateCartItem,
        removeCartItem,
        proceedToCheckout,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-info-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .cart-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .cart-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  .cart-table th,
  .cart-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .cart-table th {
    background-color: #f5f5f5;
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }
  
  .cart-table td {
    font-size: 14px;
    color: #666;
  }
  
  .cart-table tr:hover {
    background-color: #f9f9f9;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .product-name {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .product-name:hover {
    text-decoration: underline;
  }
  
  .quantity-input {
    width: 60px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
  }
  
  .delete-btn {
    padding: 6px 12px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.3s ease;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
  }
  
  .no-items {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-top: 20px;
  }
  
  .cart-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }
  
  .cart-summary p {
    font-size: 16px;
    color: #333;
    margin: 0;
  }
  
  .cart-summary strong {
    color: #e74c3c;
  }
  
  .checkout-btn {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s ease;
  }
  
  .checkout-btn:hover {
    background-color: #218838;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .pagination-btn {
    padding: 6px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .pagination-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .pagination span {
    font-size: 14px;
    color: #333;
  }
  </style>