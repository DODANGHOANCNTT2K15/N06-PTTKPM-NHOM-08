<template>
  <div class="cart-container">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="book">
          <div class="book-page"></div>
          <div class="book-page"></div>
          <div class="book-page"></div>
        </div>
        <p>Đang tải<span class="dots"></span></p>
      </div>
    </div>

    <h1>Giỏ hàng</h1>
    <div class="cart-content">
      <div class="cart-items">
        <table class="cart-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                />
              </th>
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
                <img
                  :src="item.book.images[0].image_path"
                  alt="Product"
                  class="item-image"
                />
              </td>
              <td>{{ item.book.title }}</td>
              <td>{{ formatPrice(item.all_price) }}</td>
              <td>
                <div class="item-quantity">
                  <button @click="decreaseQuantity(item)">-</button>
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    @change="updateQuantity(item)"
                  />
                  <button @click="increaseQuantity(item)">+</button>
                </div>
              </td>
              <td>
                <button class="remove-btn" @click="removeCartItem(item.id)">
                  🗑️
                </button>
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
          <p
            v-if="
              customer &&
              (customer.full_name || customer.phone || customer.address)
            "
          >
            {{ customer.full_name }} | {{ customer.phone }}
          </p>
          <p v-if="customer && customer.address">
            {{ customer.address }}
          </p>
          <p
            v-if="
              !customer ||
              (!customer.full_name && !customer.phone && !customer.address)
            "
          >
            Không có thông tin. Vui lòng cập nhật !!
          </p>
        </div>
        <div class="payment-options">
          <h3>Khuyến mãi</h3>
          <p>Có thể chọn 1</p>
          <select v-model="selectedPromotion">
            <option value="">Chọn khuyến mãi</option>
            <option
              v-for="promo in promotions"
              :key="promo.discount_id"
              :value="promo.discount_id"
            >
              {{ promo.discount_name }} (Giảm {{ promo.percent_discount }}%)
            </option>
          </select>
        </div>
        <div class="payment-methods">
          <h3>Phương thức thanh toán</h3>
          <label>
            <input type="radio" v-model="paymentMethod" value="0" /> MoMo
          </label>
          <label>
            <input type="radio" v-model="paymentMethod" value="1" /> Thẻ ngân
            hàng
          </label>
          <label>
            <input type="radio" v-model="paymentMethod" value="2" /> Thanh toán
            sau khi giao hàng
          </label>
        </div>
        <div class="payment-amounts">
          <p>
            Tạm tính: <span>{{ formatPrice(subtotal) }}</span>
          </p>
          <p>
            Phí vận chuyển: <span>{{ formatPrice(deliveryPrice) }}</span>
          </p>
          <p>
            Giảm giá: <span>{{ formatPrice(discount) }}</span>
          </p>
          <p>
            Tổng tiền thanh toán: <span>{{ formatPrice(totalPayment) }}</span>
          </p>
        </div>
        <button class="checkout-btn" @click="showConfirmationModal">
          THANH TOÁN
        </button>
      </div>

      <!-- Modal xác nhận thông tin -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Xác nhận thông tin đặt hàng</h2>
          <div class="customer-info">
            <p>
              <strong>Họ tên:</strong>
              {{ customer?.full_name || "Chưa có thông tin" }}
            </p>
            <p>
              <strong>Số điện thoại:</strong>
              {{ customer?.phone || "Chưa có thông tin" }}
            </p>
            <p>
              <strong>Địa chỉ:</strong>
              {{ customer?.address || "Chưa có thông tin" }}
            </p>
            <p><strong>Tổng tiền:</strong> {{ formatPrice(totalPayment) }}</p>
            <p>
              <strong>Phương thức thanh toán:</strong>
              {{
                paymentMethod === "0"
                  ? "MoMo"
                  : paymentMethod === "1"
                  ? "Thẻ ngân hàng"
                  : "Thanh toán khi nhận hàng"
              }}
            </p>
          </div>
          <div class="modal-actions">
            <button class="confirm-btn" @click="confirmCheckout">
              Xác nhận
            </button>
            <button class="edit-btn" @click="goToEditInfo">
              Chỉnh sửa thông tin
            </button>
            <button class="cancel-btn" @click="closeModal">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import {
  apiGetCartByUserId,
  apiUpdateCartItem,
  apiDeleteCartItem,
  apiGetCountProductOfCart,
} from "@/services/client/CartService";
import { apiGetCustomerInfor } from "@/services/client/UserAddressService";
import { apiGetAllDiscounts } from "@/services/client/DiscountService";
import { addOrderService } from "@/services/client/OrderService";
import { useCartStore } from "@/stores/cart";
import router from "@/router";
import Swal from "sweetalert2";

export default {
  name: "CartPage",
  setup() {
    const cartItems = ref([]);
    const customer = ref({ customer_id: 0, name: "", phone: "", address: "" });
    const promotions = ref([]);
    const selectAll = ref(false);
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const selectedPromotion = ref("");
    const paymentMethod = ref("");
    const showModal = ref(false);
    const cartStore = useCartStore();
    const isLoading = ref(false); // Thêm trạng thái loading

    // Hàm điều khiển loading
    const showLoading = () => {
      if (!isLoading.value) isLoading.value = true;
    };
    const hideLoading = () => {
      if (isLoading.value) isLoading.value = false;
    };

    onMounted(async () => {
      showLoading();
      try {
        await Promise.all([
          fetchCartItems(),
          fetchCustomer(),
          fetchPromotions(),
        ]);
      } finally {
        hideLoading();
      }
    });

    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token trong localStorage");
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload.id;
      } catch (error) {
        console.log("Lỗi khi giải mã token:", error);
        return null;
      }
    };

    const fetchCartItems = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const response = await apiGetCartByUserId({ user_id: userId });
        if (response.status === 200 && response.data.err !== 2) {
          cartItems.value = response.data.data.map((item) => ({
            ...item,
            selected: false,
          }));
        } else {
          console.error("Lỗi từ server:", response.data.msg);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
      }
    };

    const fetchCustomer = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const response = await apiGetCustomerInfor({ user_id: userId });
        if (response.status === 200 && response.data.err === 0) {
          customer.value = response.data.data;
        } else {
          customer.value = null;
        }
      } catch (error) {
        console.error("Lỗi khi lấy địa chỉ:", error);
      }
    };

    const fetchPromotions = async () => {
      try {
        const response = await apiGetAllDiscounts();
        if (response.status === 200 && response.data.err === 0) {
          promotions.value = response.data.data;
        } else {
          console.error("Lỗi khi lấy thông tin giảm giá:", response.data.msg);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
      }
    };

    const updateAllPrice = (item) => {
      item.all_price = item?.book?.price * item?.quantity;
    };

    const updateCartInDatabase = async (item) => {
      showLoading();
      try {
        const response = await apiUpdateCartItem({
          cart_id: item.cart_id,
          quantity: item.quantity,
          all_price: item.all_price,
        });
        if (response.status === 200 && response.data.err === 0) {
          console.log("Cập nhật giỏ hàng thành công:", response.data);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật giỏ hàng:", error);
      } finally {
        hideLoading();
      }
    };

    const totalPages = computed(() =>
      Math.ceil(cartItems.value.length / itemsPerPage.value)
    );

    const paginatedCartItems = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return cartItems.value.slice(start, end);
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    const subtotal = computed(() =>
      cartItems.value
        .filter((item) => item.selected)
        .reduce((sum, item) => sum + item.all_price, 0)
    );

    const deliveryPrice = computed(() => {
      return subtotal.value > 500000 ? 30000 : 50000;
    });

    const discount = computed(() => {
      if (!selectedPromotion.value) return 0;
      const selectedPromo = promotions.value.find(
        (promo) => promo.discount_id === selectedPromotion.value
      );
      return selectedPromo
        ? subtotal.value * (selectedPromo.percent_discount / 100)
        : 0;
    });

    const totalPayment = computed(() => {
      return subtotal.value + deliveryPrice.value - discount.value;
    });

    const decreaseQuantity = async (item) => {
      if (item.quantity > 1) {
        item.quantity--;
        updateAllPrice(item);
        await updateCartInDatabase(item);
      }
    };

    const increaseQuantity = async (item) => {
      item.quantity++;
      updateAllPrice(item);
      await updateCartInDatabase(item);
    };

    const updateQuantity = async (item) => {
      if (item.quantity < 1) item.quantity = 1;
      updateAllPrice(item);
      await updateCartInDatabase(item);
    };

    const toggleSelectAll = () => {
      paginatedCartItems.value.forEach((item) => {
        item.selected = selectAll.value;
      });
    };

    const removeCartItem = async (id) => {
      const item = cartItems.value.find((item) => item.id === id);
      if (!item) return;

      Swal.fire({
        title: "Xác nhận",
        text: "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          showLoading();
          try {
            const response = await apiDeleteCartItem({ cart_id: item.cart_id });
            if (response.status === 200 && response.data.err === 0) {
              const index = cartItems.value.findIndex((i) => i.id === id);
              if (index !== -1) {
                cartItems.value.splice(index, 1);
                if (
                  paginatedCartItems.value.length === 0 &&
                  currentPage.value > 1
                ) {
                  currentPage.value--;
                }
              }
              const userId = getUserIdFromToken();
              if (userId) {
                const countResponse = await apiGetCountProductOfCart({
                  user_id: userId,
                });
                if (countResponse.data.err === 0) {
                  cartStore.updatetotal_product_type(
                    countResponse.data.total_product_types || 0
                  );
                } else {
                  cartStore.updatetotal_product_type(cartItems.value.length);
                }
              }
              Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Xóa sản phẩm khỏi giỏ hàng thành công!",
                timer: 1500,
                showConfirmButton: false,
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Xóa sản phẩm thất bại: " + response.data.msg,
              });
            }
          } catch (error) {
            console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Có lỗi xảy ra khi xóa sản phẩm!",
            });
          } finally {
            hideLoading();
          }
        }
      });
    };

    const showConfirmationModal = () => {
      const selectedItems = cartItems.value.filter((item) => item.selected);
      if (selectedItems.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Chưa chọn sản phẩm",
          text: "Vui lòng chọn ít nhất một sản phẩm để thanh toán!",
        });
        return;
      }
      if (!paymentMethod.value) {
        Swal.fire({
          icon: "warning",
          title: "Chưa chọn phương thức",
          text: "Vui lòng chọn phương thức thanh toán!",
        });
        return;
      }
      if (!customer.value) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng cập nhật thông tin trước khi thanh toán!",
          showCancelButton: true,
          confirmButtonText: "Cập nhật ngay",
          cancelButtonText: "Để sau",
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/user/address");
          }
        });
        return;
      }
      showModal.value = true;
    };

    const confirmCheckout = async () => {
      const selectedItems = cartItems.value.filter((item) => item.selected);
      const selectedPromo = promotions.value.find(
        (promo) => promo.discount_id === selectedPromotion.value
      );

      const orderData = {
        user_id: getUserIdFromToken(),
        customer_id: customer.value.customer_id,
        order_date: new Date().toISOString().split("T")[0],
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        delivery_price: deliveryPrice.value,
        total_price: totalPayment.value,
        discount_id: selectedPromo ? selectedPromo.discount_id : null,
        payment_method_id: parseInt(paymentMethod.value),
        payment_status: 0,
        order_details: selectedItems.map((item) => ({
          book_id: item.book.book_id || item.book.id,
          quantity: item.quantity,
          price: item.book.price,
        })),
      };

      showLoading();
      try {
        const response = await addOrderService(orderData);
        if (response.status === 200 && response.data.err === 0) {
          cartStore.updatetotal_product_type(response.data.data.count);
          await fetchCartItems();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đặt hàng thành công!",
            timer: 2000,
            showConfirmButton: false,
          });
          selectAll.value = false;
          selectedPromotion.value = "";
          paymentMethod.value = "";
          currentPage.value = 1;
          showModal.value = false;
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Đã xảy ra lỗi khi đặt hàng: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Checkout error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Đã xảy ra lỗi khi xử lý thanh toán!",
        });
      } finally {
        hideLoading();
      }
    };

    const goToEditInfo = () => {
      showModal.value = false;
      router.push("/user/address");
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return {
      cartItems,
      customer,
      promotions,
      selectAll,
      itemsPerPage,
      currentPage,
      totalPages,
      paginatedCartItems,
      selectedPromotion,
      paymentMethod,
      showModal,
      subtotal,
      deliveryPrice,
      discount,
      totalPayment,
      isLoading, // Trả về isLoading để template sử dụng
      formatPrice,
      decreaseQuantity,
      increaseQuantity,
      updateQuantity,
      toggleSelectAll,
      removeCartItem,
      showConfirmationModal,
      confirmCheckout,
      goToEditInfo,
      closeModal,
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
  position: relative; /* Để overlay hoạt động trong container */
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #333;
}

.customer-info p {
  margin: 10px 0;
  color: #666;
}

.customer-info strong {
  color: #333;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.confirm-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-btn:hover {
  background-color: #218838;
}

.edit-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #0069d9;
}

.cancel-btn {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover {
  background-color: #c82333;
}

/* CSS cho Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.book {
  position: relative;
  width: 60px;
  height: 80px;
  margin: 0 auto 20px;
}

.book-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transform-origin: left center;
  animation: flip 1.5s infinite ease-in-out;
}

.book-page:nth-child(1) {
  animation-delay: 0s;
  background: #f5f5f5;
}

.book-page:nth-child(2) {
  animation-delay: 0.3s;
  background: #e0e0e0;
}

.book-page:nth-child(3) {
  animation-delay: 0.6s;
  background: #d0d0d0;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

p {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots::after {
  content: "...";
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
  100% {
    content: ".";
  }
}
</style>