<template>
  <div class="profile-info-content">
    <h2>Đơn hàng của bạn</h2>
    <div class="favorite-table-container">
      <table class="favorite-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <!-- <th>Tên sách</th> -->
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Ngày giao</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in paginatedOrders" :key="order.order_id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ order.order_id }}</td>
            <!-- <td>{{ order.order_details[[]].book.title }}</td> -->
            <td>{{ formatPrice(order.total_price) }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>{{ formatDate(order.delivery_date) || "Chưa giao" }}</td>
            <td>
              <span :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </td>
            <td>
              <button
                class="delete-btn"
                @click="cancelOrder(order.order_id)"
                v-if="order.status === 0"
              >
                Hủy đơn
              </button>
              <span v-else>-</span>
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="8" class="no-products">
              Không có dữ liệu đơn hàng.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Phân trang -->
      <div class="pagination" v-if="orders.length > itemsPerPage">
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
import { ref, computed, onMounted } from "vue";
import {
  apiGetOrderByUserId,
  apiDeleteOrderService,
} from "@/services/client/OrderService";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  name: "UserOrders",
  setup() {
    const orders = ref([]);
    const itemsPerPage = ref(5); // Số đơn hàng mỗi trang
    const currentPage = ref(1); // Trang hiện tại

    // Tính tổng số trang
    const totalPages = computed(() =>
      Math.ceil(orders.value.length / itemsPerPage.value)
    );

    // Lấy danh sách đơn hàng cho trang hiện tại
    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return orders.value.slice(start, end);
    });

    // Format giá tiền
    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price || 0);
    };

    // Format ngày tháng
    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("vi-VN") : null;
    };

    // Chuyển đổi trạng thái thành văn bản
    const getStatusText = (status) => {
      switch (status) {
        case 0:
          return "Chờ xác nhận";
        case 1:
          return "Đã xác nhận";
        case 2:
          return "Từ chối";
        default:
          return "Không xác định";
      }
    };

    // Áp dụng lớp CSS cho trạng thái
    const getStatusClass = (status) => {
      switch (status) {
        case 0:
          return "status-pending";
        case 1:
          return "status-shipping";
        case 2:
          return "status-delivered";
        default:
          return "";
      }
    };

    // Lấy tiêu đề sách từ order_details
    const getBookTitle = (order) => {
      if (order.order_details?.length > 0) {
        return order.order_details[0].book?.title || "Không xác định";
      }
      return "Không xác định";
    };

    // Lấy ảnh sách từ order_details
    const getBookImage = (order) => {
      if (order.order_details?.length > 0) {
        return order.order_details[0].book?.image || "default-image.jpg";
      }
      return "default-image.jpg";
    };

    // Lấy liên kết sách
    const getBookLink = (order) => {
      if (order.order_details?.length > 0) {
        return order.order_details[0].book?.link || "#";
      }
      return "#";
    };

    // Lấy user_id từ token
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

    // Lấy dữ liệu đơn hàng từ API
    const fetchOrders = async () => {
      try {
        const response = await apiGetOrderByUserId({ user_id: getUserIdFromToken() });
        if (response.status === 200 && response.data.err === 0) {
          orders.value = response.data.data || [];
        } else {
          orders.value = [];
          Swal.fire({
            icon: "warning",
            title: "Cảnh báo",
            text: "Không tìm thấy dữ liệu đơn hàng.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        orders.value = [];
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể tải danh sách đơn hàng.",
        });
      }
    };

    // Hủy đơn hàng qua API
    const cancelOrder = async (orderId) => {
      Swal.fire({
        title: "Xác nhận hủy đơn hàng",
        text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có",
        cancelButtonText: "Không",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await apiDeleteOrderService({ order_id: orderId });
            if (response.status === 200 && response.data.err === 0) {
              Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Đã hủy đơn hàng thành công!",
              });
              // Kiểm tra nếu trang hiện tại không còn đơn hàng thì giảm trang
              await fetchOrders();
              if (paginatedOrders.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể hủy đơn hàng. Vui lòng thử lại sau.",
              });
            }
          } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Không thể hủy đơn hàng. Vui lòng thử lại sau.",
            });
          }
        }
      });
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders,
      itemsPerPage,
      currentPage,
      totalPages,
      paginatedOrders,
      formatPrice,
      formatDate,
      getStatusText,
      getStatusClass,
      getBookTitle,
      getBookImage,
      getBookLink,
      cancelOrder,
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

.favorite-table-container {
  width: 100%;
  overflow-x: auto;
}

.favorite-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.favorite-table th,
.favorite-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.favorite-table th {
  background-color: #f5f5f5;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.favorite-table td {
  font-size: 14px;
  color: #666;
}

/* Căn chỉnh cột cụ thể */
.favorite-table td:nth-child(1) { /* Cột STT */
  text-align: center;
}
.favorite-table td:nth-child(4) { /* Cột Tổng tiền */
  text-align: right;
}
.favorite-table td:nth-child(8) { /* Cột Hành động */
  text-align: center;
}

.favorite-table tr:hover {
  background-color: #f9f9f9;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.1);
}

.product-name {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 600;
  font-family: "Arial", sans-serif;
  font-size: 15px;
  transition: color 0.3s ease;
}

.product-name:hover {
  color: #e74c3c;
  text-decoration: underline;
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

.no-products {
  text-align: center;
  font-size: 14px;
  color: #666;
  padding: 20px;
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

/* Các lớp trạng thái */
.status-pending {
  background-color: #fff3cd;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-shipping {
  background-color: #cce5ff;
  color: #004085;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}
</style>