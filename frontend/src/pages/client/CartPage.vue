<script>
import { ref } from 'vue';

export default {
  name: 'CartPage', // Cập nhật tên component (tùy chọn)
  setup() {
    const cartItems = ref([
      {
        id: 1,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
      },
      {
        id: 2,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
      },
      {
        id: 3,
        name: 'Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)',
        image: 'Product_00.png',
        price: 111023,
        quantity: 1,
      },
    ]);

    const decreaseQuantity = (item) => {
      if (item.quantity > 1) {
        item.quantity--;
        updateTotal();
      }
    };

    const increaseQuantity = (item) => {
      item.quantity++;
      updateTotal();
    };

    const updateQuantity = (item) => {
      if (item.quantity < 1) item.quantity = 1;
      updateTotal();
    };

    const updateTotal = () => {
      const total = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
      console.log('Tổng tiền:', total);
    };

    return {
      cartItems,
      decreaseQuantity,
      increaseQuantity,
      updateQuantity,
    };
  },
};
</script>

<template>
  <div class="cart-container">
    <h1>Giỏ hàng</h1>
    <div class="cart-content">
      <div class="cart-items">
        <div class="cart-item" v-for="item in cartItems" :key="item.id">
          <img :src="require(`@/assets/images/${item.image}`)" alt="Product" class="item-image" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>Đã Đóng Hồin</p>
            <p class="item-price">111,023 VNĐ</p>
            <p>Khuyến mãi: Giảm giá hàng mới</p>
          </div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)">-</button>
            <input type="number" v-model="item.quantity" min="1" @change="updateQuantity(item)" />
            <button @click="increaseQuantity(item)">+</button>
          </div>
          <p class="item-total">111,023 VNĐ</p>
          <button class="remove-btn">🗑️</button>
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
          <select>
            <option>Chọn khuyến mãi</option>
          </select>
        </div>
        <div class="payment-amounts">
          <p>Tạm tính: <span>0 VNĐ</span></p>
          <p>Giảm giá: <span>0 VNĐ</span></p>
          <p>Tổng tiền thanh toán: <span>0 VNĐ</span></p>
        </div>
        <button class="checkout-btn">THANH TOÁN</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Giữ nguyên CSS từ phiên bản trước */
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

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.cart-header input {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 200px;
  font-size: 14px;
}

.cart-actions button {
  padding: 5px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f0f8ff;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  margin-left: 5px;
}

.cart-actions button:hover {
  background-color: #e0efff;
}

.cart-content {
  display: flex;
  gap: 20px;
}

.cart-items {
  flex: 2;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px 100px 50px;
  align-items: center;
  gap: 10px;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.item-image {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 5px;
}

.item-details p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.item-price, .item-total {
  font-size: 16px;
  color: red;
  font-weight: bold;
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

.summary-details {
  margin-bottom: 20px;
}

.summary-details p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.payment-options {
  margin-bottom: 20px;
}

.payment-options h3 {
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
  margin-bottom: 10px;
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
</style>