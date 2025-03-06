<template>
  <div class="admin-orders">
    <h1>Quản lý Đơn hàng</h1>
    <div class="order-actions">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo ID hoặc khách hàng..."
        class="search-input"
      />
    </div>
    <div class="order-table">
      <table>
        <thead>
          <tr>
            <th @click="sort('order_id')">
              ID Đơn hàng <i :class="getSortIcon('order_id')"></i>
            </th>
            <th @click="sort('customer')">
              Khách hàng <i :class="getSortIcon('customer')"></i>
            </th>
            <th>Số lượng sách</th>
            <th @click="sort('total_price')">
              Tổng tiền <i :class="getSortIcon('total_price')"></i>
            </th>
            <th @click="sort('status')">
              Trạng thái <i :class="getSortIcon('status')"></i>
            </th>
            <th>Thông tin giao hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredAndSortedOrders" :key="order.order_id">
            <td>{{ order.order_id }}</td>
            <td>{{ order.customer.full_name }}</td>
            <td>
              {{ order.order_details.length }} sách
              <button @click="showOrderDetails(order)" class="view-details-btn">
                <i class="fas fa-eye"></i> Xem chi tiết
              </button>
            </td>
            <td>{{ formatPrice(order.total_price) }}</td>
            <td>
              <select
                v-model="order.status"
                @change="updateOrderStatus(order.order_id, order.status)"
              >
                <option :value="0">Chờ xác nhận</option>
                <option :value="1">Đã xác nhận</option>
                <option :value="2">Từ chối</option>
              </select>
            </td>
            <td>
              <p>Địa chỉ: {{ order.customer.address }}</p>
              <p>SĐT: {{ order.customer.phone }}</p>
            </td>
            <td>
              <button
                @click="editOrder(order.order_id)"
                class="action-btn edit-btn"
              >
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button
                @click="deleteOrder(order.order_id)"
                class="action-btn delete-btn"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span
          >Hiển thị trang {{ currentPage }} / {{ totalPages }} -
          {{ filteredAndSortedOrders.length }} kết quả</span
        >
        <div>
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Xem chi tiết Đơn hàng -->
    <div v-if="showOrderDetailPopup" class="modal">
      <div class="modal-content">
        <h2>Chi tiết Đơn hàng #{{ selectedOrder.order_id }}</h2>
        <div class="order-details">
          <p>
            <strong>Khách hàng:</strong> {{ selectedOrder.customer.full_name }}
          </p>
          <p>
            <strong>Tổng tiền:</strong>
            {{ formatPrice(selectedOrder.total_price) }}
          </p>
          <p>
            <strong>Trạng thái:</strong> {{ statusText(selectedOrder.status) }}
          </p>
          <p>
            <strong>Phí giao hàng:</strong>
            {{ formatPrice(selectedOrder.delivery_price) }}
          </p>
          <p><strong>Thông tin giao hàng:</strong></p>
          <p>Địa chỉ: {{ selectedOrder.customer.address }}</p>
          <p>SĐT: {{ selectedOrder.customer.phone }}</p>
          <h3>Danh sách Sách</h3>
          <ul class="order-books">
            <li v-for="item in selectedOrder.order_details" :key="item.book_id">
              {{ item.book.title }} (Số lượng: {{ item.quantity }} x
              {{ formatPrice(item.price) }} =
              {{ formatPrice(item.quantity * item.price) }})
            </li>
          </ul>
        </div>
        <div class="modal-actions">
          <button @click="showOrderDetailPopup = false">Đóng</button>
        </div>
      </div>
    </div>

    <!-- Popup Sửa Đơn hàng -->
    <div v-if="showEditOrderPopup" class="modal">
      <div class="modal-content">
        <h2>Sửa Đơn hàng</h2>
        <form @submit.prevent="updateOrder">
          <div class="form-columns">
            <div class="form-column">
              <div class="form-group">
                <label>ID Đơn hàng:</label>
                <input v-model="editedOrder.order_id" type="text" disabled />
              </div>
              <div class="form-group">
                <label>Khách hàng:</label>
                <input
                  v-model="editedOrder.customer.full_name"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label>Tổng tiền:</label>
                <input
                  v-model.number="editedOrder.total_price"
                  type="number"
                  required
                />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label>Trạng thái:</label>
                <select v-model="editedOrder.status" required>
                  <option :value="0">Chờ xác nhận</option>
                  <option :value="1">Đã xác nhận</option>
                  <option :value="2">Từ chối</option>
                </select>
              </div>
              <div class="form-group">
                <label>Địa chỉ giao hàng:</label>
                <input
                  v-model="editedOrder.customer.address"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label>Số điện thoại:</label>
                <input
                  v-model="editedOrder.customer.phone"
                  type="tel"
                  required
                />
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Sách:</label>
            <ul class="order-books">
              <li
                v-for="(item, index) in editedOrder.order_details"
                :key="item.book_id"
              >
                {{ item.book.title }} (Giá: {{ formatPrice(item.price) }})
                <input
                  v-model.number="editedOrder.order_details[index].quantity"
                  type="number"
                  min="1"
                  required
                />
              </li>
            </ul>
          </div>
          <div class="modal-actions">
            <button type="submit">Cập nhật</button>
            <button @click="showEditOrderPopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import {
  apiGetAllOrderService,
  apiUpdateStatusOrderService,
  apiUpdateOrderService,
  apiDeleteOrderService,
} from "@/services/admin/OrderService";

export default {
  name: "OrdersAdmin",
  setup() {
    const orders = ref([]);
    const searchQuery = ref("");
    const sortKey = ref("");
    const sortOrder = ref("asc");
    const showEditOrderPopup = ref(false);
    const showOrderDetailPopup = ref(false);
    const editedOrder = ref({});
    const selectedOrder = ref({});
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Lấy danh sách đơn hàng từ API
    const fetchOrders = async () => {
      try {
        const response = await apiGetAllOrderService();
        if (response.status === 200 && response.data.err !== 2) {
          orders.value = response.data.data;
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        alert("Lỗi khi tải dữ liệu!");
      }
    };

    // Sửa đơn hàng
    const editOrder = (orderId) => {
      const order = orders.value.find((o) => o.order_id === orderId);
      editedOrder.value = JSON.parse(JSON.stringify(order)); // Deep copy để tránh thay đổi trực tiếp
      showEditOrderPopup.value = true;
    };

    // Cập nhật đơn hàng qua API
    const updateOrder = async () => {
      try {
        const updatedOrder = { ...editedOrder.value };
        const response = await apiUpdateOrderService(updatedOrder);
        if (response.status === 200 && response.data.err !== 2) {
          const index = orders.value.findIndex(
            (o) => o.order_id === updatedOrder.order_id
          );
          if (index !== -1) {
            orders.value[index] = updatedOrder;
          }
          console.log("Cập nhật đơn hàng thành công:", updatedOrder);
          alert("Cập nhật đơn hàng thành công@!!");
          showEditOrderPopup.value = false;
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật đơn hàng:", error);
      }
    };

    // Xóa đơn hàng qua API
    const deleteOrder = async (orderId) => {
      if (confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
        try {
          const response = await apiDeleteOrderService({ order_id: orderId });
          if(response.status === 200 && response.data.err !== 2) {
            orders.value = orders.value.filter((o) => o.order_id !== orderId);
            console.log(`Đã xóa đơn hàng ${orderId}`);
          }
        } catch (error) {
          console.error("Lỗi khi xóa đơn hàng:", error);
        }
      }
    };

    // Cập nhật trạng thái đơn hàng qua API
    const updateOrderStatus = async (orderId, status) => {
      try {
        const response = await apiUpdateStatusOrderService({
          order_id: orderId,
          status: status,
        });
        if (response.status === 200 && response.data.err !== 2) {
          await fetchOrders();
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
      }
    };

    // Hiển thị chi tiết đơn hàng
    const showOrderDetails = (order) => {
      selectedOrder.value = JSON.parse(JSON.stringify(order)); // Deep copy
      showOrderDetailPopup.value = true;
    };

    // Chuyển đổi trạng thái thành text
    const statusText = (status) => {
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

    // Lọc và sắp xếp đơn hàng
    const filteredAndSortedOrders = computed(() => {
      let result = [...orders.value];

      if (searchQuery.value) {
        result = result.filter(
          (order) =>
            order.order_id.toString().includes(searchQuery.value) ||
            order.customer.full_name
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortKey.value) {
        result.sort((a, b) => {
          let valueA =
            sortKey.value === "customer"
              ? a.customer.full_name
              : a[sortKey.value];
          let valueB =
            sortKey.value === "customer"
              ? b.customer.full_name
              : b[sortKey.value];
          if (sortOrder.value === "asc") {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
          } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
          }
        });
      }

      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return result.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(orders.value.length / itemsPerPage.value);
    });

    const sort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortKey.value = key;
        sortOrder.value = "asc";
      }
    };

    const getSortIcon = (key) => {
      if (sortKey.value === key) {
        return sortOrder.value === "asc"
          ? "fas fa-sort-up"
          : "fas fa-sort-down";
      }
      return "fas fa-sort";
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    onMounted(fetchOrders);

    return {
      orders,
      searchQuery,
      showEditOrderPopup,
      showOrderDetailPopup,
      editedOrder,
      selectedOrder,
      editOrder,
      deleteOrder,
      updateOrder,
      updateOrderStatus,
      showOrderDetails,
      filteredAndSortedOrders,
      sort,
      getSortIcon,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      formatPrice,
      statusText,
    };
  },
};
</script>

<style scoped>
.admin-orders {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-orders h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.order-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 14px;
  width: 250px;
  background-color: #f8f9fa;
  color: #495057;
  transition: border-color 0.3s ease;
}

.search-input::placeholder {
  color: #6c757d;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.order-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.order-table table {
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
  position: sticky;
  top: 0;
  z-index: 1;
}

.order-table th i {
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
}

.order-table td {
  background-color: #ffffff;
}

.order-table select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}

.view-details-btn {
  padding: 5px 10px;
  margin-left: 10px;
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

.order-table button.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
}

.order-table button.action-btn:hover {
  opacity: 0.8;
}

.order-table .edit-btn i {
  color: #007bff;
  font-size: 16px;
}

.order-table .delete-btn i {
  color: #dc3545;
  font-size: 16px;
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

.form-columns {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-column {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3498db;
  outline: none;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.modal-actions button:first-child {
  background-color: #27ae60;
  color: white;
}

.modal-actions button:first-child:hover {
  background-color: #219653;
}

.modal-actions button:last-child {
  background-color: #e74c3c;
  color: white;
}

.modal-actions button:last-child:hover {
  background-color: #c0392b;
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
  margin-left: 10px;
  transition: background-color 0.3s ease;
}

.pagination-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>