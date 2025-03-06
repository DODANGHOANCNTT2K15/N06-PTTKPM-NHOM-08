<template>
  <div class="cart-container">
    <h1>Giỏ hàng</h1>
    <div class="cart-content">
      <div class="cart-items">
        <table class="cart-table">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Tên sách</th>
              <th>Giá tiền</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedCartItems" :key="item.id">
              <td><input type="checkbox" v-model="item.selected" /></td>
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>
                <img :src="require(`@/assets/images/${item.image}`)" alt="Product" class="item-image" />
              </td>
              <td>{{ item.name }}</td>
              <td>{{ formatPrice(item.price) }}</td>
              <td>
                <div class="item-quantity">
                  <button @click="decreaseQuantity(item)">-</button>
                  <input type="number" v-model="item.quantity" min="1" @change="updateQuantity(item)" />
                  <button @click="increaseQuantity(item)">+</button>
                </div>
              </td>
              <td>
                <button class="remove-btn" @click="removeCartItem(item.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>

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

      <div class="cart-summary">
        <h2>Giá tổng</h2>
        <div class="summary-details">
          <p>Đỗ Đình Hoàn | 0335546276</p>
          <p>nhà số 12, ngách 25/24, ngõ 24 đường Ngõ, Phường Văn Phú, quận Hà Đông, Hà Nội</p>
        </div>
        <div class="payment-options">
          <h3>Khuyến mãi</h3>
          <p>Có thể chọn 2</p>
          <select v-model="selectedPromotion">
            <option value="">Chọn khuyến mãi</option>
            <option value="discount10">Giảm 10%</option>
            <option value="discount20">Giảm 20%</option>
          </select>
        </div>
        <div class="payment-methods">
          <h3>Phương thức thanh toán</h3>
          <label>
            <input type="radio" v-model="paymentMethod" value="momo" /> MoMo
          </label>
          <label>
            <input type="radio" v-model="paymentMethod" value="bank" /> Thẻ ngân hàng
          </label>
          <label>
            <input type="radio" v-model="paymentMethod" value="cod" /> Thanh toán sau khi giao hàng
          </label>
        </div>
        <div class="payment-amounts">
          <p>Tạm tính: <span>{{ formatPrice(subtotal) }}</span></p>
          <p>Giảm giá: <span>{{ formatPrice(discount) }}</span></p>
          <p>Tổng tiền thanh toán: <span>{{ formatPrice(totalPayment) }}</span></p>
        </div>
        <button class="checkout-btn" @click="checkout">THANH TOÁN</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'CartPage',
  setup() {
    const cartItems = ref([
      {
        id: 1,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
      {
        id: 2,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
      {
        id: 3,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
      {
        id: 5,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
      {
        id: 6,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
      {
        id: 7,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
        selected: false,
      },
    ]);

    const selectAll = ref(false);
    const itemsPerPage = ref(5); // Tối đa 5 sản phẩm mỗi trang
    const currentPage = ref(1);
    const selectedPromotion = ref(''); // Khuyến mãi được chọn
    const paymentMethod = ref(''); // Phương thức thanh toán

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

    // Format giá tiền
    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    };

    // Tính tạm tính (subtotal)
    const subtotal = computed(() =>
      cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    // Tính giảm giá (discount) dựa trên khuyến mãi
    const discount = computed(() => {
      if (selectedPromotion.value === 'discount10') return subtotal.value * 0.1;
      if (selectedPromotion.value === 'discount20') return subtotal.value * 0.2;
      return 0;
    });

    // Tính tổng tiền thanh toán
    const totalPayment = computed(() => subtotal.value - discount.value);

    // Giảm số lượng
    const decreaseQuantity = (item) => {
      if (item.quantity > 1) {
        item.quantity--;
      }
    };

    // Tăng số lượng
    const increaseQuantity = (item) => {
      item.quantity++;
    };

    // Cập nhật số lượng
    const updateQuantity = (item) => {
      if (item.quantity < 1) item.quantity = 1;
    };

    // Chọn hoặc bỏ chọn tất cả trên trang hiện tại
    const toggleSelectAll = () => {
      paginatedCartItems.value.forEach((item) => {
        item.selected = selectAll.value;
      });
    };

    // Xóa sản phẩm
    const removeCartItem = (id) => {
      const index = cartItems.value.findIndex((item) => item.id === id);
      if (index !== -1) {
        cartItems.value.splice(index, 1);
        if (paginatedCartItems.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      }
    };

    // Thanh toán
    const checkout = () => {
      if (!paymentMethod.value) {
        alert('Vui lòng chọn phương thức thanh toán!');
        return;
      }
      console.log('Thanh toán:', {
        cartItems: cartItems.value,
        subtotal: subtotal.value,
        discount: discount.value,
        total: totalPayment.value,
        paymentMethod: paymentMethod.value,
      });
      alert('Đã gửi yêu cầu thanh toán!');
    };

    return {
      cartItems,
      selectAll,
      itemsPerPage,
      currentPage,
      totalPages,
      paginatedCartItems,
      selectedPromotion,
      paymentMethod,
      subtotal,
      discount,
      totalPayment,
      formatPrice,
      decreaseQuantity,
      increaseQuantity,
      updateQuantity,
      toggleSelectAll,
      removeCartItem,
      checkout,
    };
  },
};
</script>

<style scoped>
.cart-container {
  background-color: #f0f8ff;
  padding: 20px;
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-container h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-items {
  flex: 2;
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

.item-image {
  width: 50px;
  height: 75px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 5px;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
}

.item-quantity input {
  width: 60px;
  height: 30px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 16px;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
}

.remove-btn:hover {
  color: red;
}

.cart-summary {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.cart-summary h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.summary-details p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.payment-options,
.payment-methods {
  margin-bottom: 20px;
}

.payment-options h3,
.payment-methods h3 {
  font-size: 16px;
  color: #333;
  margin: 10px 0 5px;
}

.payment-options p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.payment-options select {
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.payment-methods label {
  display: block;
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.payment-methods input {
  margin-right: 5px;
}

.payment-amounts p {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
}

.payment-amounts span {
  color: red;
  font-weight: bold;
}

.checkout-btn {
  width: 100%;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.checkout-btn:hover {
  background-color: darkred;
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