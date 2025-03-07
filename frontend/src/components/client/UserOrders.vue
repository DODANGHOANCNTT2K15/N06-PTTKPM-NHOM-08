<template>
  <div class="profile-info-content">
    <h2>Đơn hàng của bạn</h2>
    <div class="order-table-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã đơn hàng</th>
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
                @click="showOrderDetails(order)"
                class="view-details-btn"
              >
                <i class="fas fa-eye"></i> Xem chi tiết
              </button>
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
            <td colspan="7" class="no-products">
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
          <i class="fas fa-chevron-left"></i>
        </button>
        <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Popup Xem chi tiết Đơn hàng -->
    <div v-if="showOrderDetailPopup" class="modal">
      <div class="modal-content">
        <h2>Chi tiết Đơn hàng #{{ selectedOrder.order_id }}</h2>
        <div class="order-details">
          <p><strong>Tổng tiền:</strong> {{ formatPrice(selectedOrder.total_price) }}</p>
          <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.order_date) }}</p>
          <p><strong>Ngày giao:</strong> {{ formatDate(selectedOrder.delivery_date) || "Chưa giao" }}</p>
          <p><strong>Trạng thái:</strong> {{ getStatusText(selectedOrder.status) }}</p>
          <p><strong>Phí giao hàng:</strong> {{ formatPrice(selectedOrder.delivery_price || 0) }}</p>
          <p><strong>Thông tin giao hàng:</strong></p>
          <p>Địa chỉ: {{ selectedOrder.customer?.address || "Không có thông tin" }}</p>
          <p>SĐT: {{ selectedOrder.customer?.phone || "Không có thông tin" }}</p>
          <h3>Danh sách Sách</h3>
          <ul class="order-books">
            <li v-for="item in selectedOrder.order_details" :key="item.book_id">
              {{ item.book?.title || "Không xác định" }} (Số lượng: {{ item.quantity }} x
              {{ formatPrice(item.price) }} = {{ formatPrice(item.quantity * item.price) }})
            </li>
          </ul>
        </div>
        <div class="modal-actions">
          <button @click="showOrderDetailPopup = false">Đóng</button>
        </div>
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
import Swal from "sweetalert2";

export default {
  name: "UserOrders",
  setup() {
    const orders = ref([]);
    const itemsPerPage = ref(5);
    const currentPage = ref(1);
    const showOrderDetailPopup = ref(false);
    const selectedOrder = ref({});

    const totalPages = computed(() =>
      Math.ceil(orders.value.length / itemsPerPage.value)
    );

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return orders.value.slice(start, end);
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price || 0);
    };

    const formatDate = (date) => {
      return date ? new Date(date).toLocaleDateString("vi-VN") : null;
    };

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

    const showOrderDetails = (order) => {
      selectedOrder.value = JSON.parse(JSON.stringify(order)); // Deep copy
      showOrderDetailPopup.value = true;
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
      cancelOrder,
      showOrderDetailPopup,
      selectedOrder,
      showOrderDetails,
    };
  },
};
</script>

<style scoped>
.profile-info-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.profile-info-content h2 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.order-table-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.order-table th,
.order-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

.order-table th {
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
}

.order-table td {
  background-color: #ffffff;
}

.order-table tr:hover {
  background-color: #f9f9f9;
}

.view-details-btn {
  padding: 5px 10px;
  margin-right: 10px;
  border: none;
  background-color: #3498db;
  color: white;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.view-details-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  padding: 5px 10px;
  border: none;
  background-color: #e74c3c;
  color: white;
  border-radius: 3px;
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
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  color: #495057;
}

.pagination-btn {
  padding: 6px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.pagination-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

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

.modal {
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
  border-radius: 10px;
  width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.modal-content h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
}

.order-details {
  margin-bottom: 20px;
}

.order-details p,
.order-details h3 {
  font-size: 14px;
  color: #495057;
  margin-bottom: 10px;
}

.order-books {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.order-books li {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  background-color: #3498db;
  color: white;
  transition: background-color 0.3s ease;
}

.modal-actions button:hover {
  background-color: #2980b9;
}
</style>