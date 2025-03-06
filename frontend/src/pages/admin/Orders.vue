<template>
  <div class="admin-orders">
    <h1>Quản lý Đơn hàng</h1>
    <div class="order-actions">
      <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo ID hoặc khách hàng..." class="search-input" />
    </div>
    <div class="order-table">
      <table>
        <thead>
          <tr>
            <th @click="sort('id')">ID Đơn hàng <i :class="getSortIcon('id')"></i></th>
            <th @click="sort('customer')">Khách hàng <i :class="getSortIcon('customer')"></i></th>
            <th>Số lượng sách</th>
            <th @click="sort('total')">Tổng tiền <i :class="getSortIcon('total')"></i></th>
            <th @click="sort('status')">Trạng thái <i :class="getSortIcon('status')"></i></th>
            <th>Thông tin giao hàng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredAndSortedOrders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td>
              {{ order.books.length }} sách
              <button @click="showOrderDetails(order)" class="view-details-btn">
                <i class="fas fa-eye"></i> Xem chi tiết
              </button>
            </td>
            <td>{{ order.total }} VNĐ</td>
            <td>
              <select v-model="order.status" @change="updateOrderStatus(order.id, order.status)">
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="rejected">Từ chối</option>
              </select>
            </td>
            <td>
              <p>Địa chỉ: {{ order.shippingAddress }}</p>
              <p>SĐT: {{ order.phone }}</p>
            </td>
            <td>
              <button @click="editOrder(order.id)" class="action-btn edit-btn">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click="deleteOrder(order.id)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="orders.length > 10">
        <span>Hiển thị trang {{ currentPage }} / {{ totalPages }} - {{ filteredAndSortedOrders.length }} kết quả</span>
        <div>
          <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Xem chi tiết Đơn hàng -->
    <div v-if="showOrderDetailPopup" class="modal">
      <div class="modal-content">
        <h2>Chi tiết Đơn hàng #{{ selectedOrder.id }}</h2>
        <div class="order-details">
          <p><strong>Khách hàng:</strong> {{ selectedOrder.customer }}</p>
          <p><strong>Tổng tiền:</strong> {{ selectedOrder.total }} VNĐ</p>
          <p><strong>Trạng thái:</strong> {{ selectedOrder.status }}</p>
          <p><strong>Thông tin giao hàng:</strong></p>
          <p>Địa chỉ: {{ selectedOrder.shippingAddress }}</p>
          <p>SĐT: {{ selectedOrder.phone }}</p>
          <h3>Danh sách Sách</h3>
          <ul class="order-books">
            <li v-for="book in selectedOrder.books" :key="book.id">
              {{ book.title }} (Số lượng: {{ book.quantity }} x {{ book.price }} VNĐ = {{ book.quantity * book.price }} VNĐ)
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
          <div class="form-group">
            <label>ID Đơn hàng:</label>
            <input v-model="editedOrder.id" type="text" disabled />
          </div>
          <div class="form-group">
            <label>Khách hàng:</label>
            <input v-model="editedOrder.customer" type="text" required />
          </div>
          <div class="form-group">
            <label>Sách:</label>
            <ul class="order-books">
              <li v-for="(book, index) in editedOrder.books" :key="book.id">
                {{ book.title }} (Số lượng: {{ book.quantity }} x {{ book.price }} VNĐ)
                <input v-model.number="editedOrder.books[index].quantity" type="number" min="1" required />
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label>Tổng tiền:</label>
            <input v-model.number="editedOrder.total" type="number" required />
          </div>
          <div class="form-group">
            <label>Trạng thái:</label>
            <select v-model="editedOrder.status" required>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div class="form-group">
            <label>Địa chỉ giao hàng:</label>
            <input v-model="editedOrder.shippingAddress" type="text" required />
          </div>
          <div class="form-group">
            <label>Số điện thoại:</label>
            <input v-model="editedOrder.phone" type="tel" required />
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
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'OrdersAdmin',
  setup() {
    const orders = ref([
      {
        id: 1,
        customer: 'Tina Bình',
        books: [
          { id: 1, title: 'Thiền Luận', quantity: 1, price: 600000 },
          { id: 2, title: 'Thiên Tài Bên Trái', quantity: 2, price: 500000 },
        ],
        total: 1600000, // Cập nhật tổng tiền cho nhiều sách
        status: 'pending',
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '0987654321',
      },
      {
        id: 2,
        customer: 'Đỗ Đình Hoàn',
        books: [
          { id: 3, title: 'Sách Kỹ Năng Sống', quantity: 1, price: 400000 },
          { id: 4, title: 'Truyện Ngắn Hay', quantity: 3, price: 200000 },
        ],
        total: 1400000, // Cập nhật tổng tiền cho nhiều sách
        status: 'pending',
        shippingAddress: '456 Đường XYZ, Quận 7, TP.HCM',
        phone: '0912345678',
      },
    ]);

    const searchQuery = ref('');
    const sortKey = ref('');
    const sortOrder = ref('asc');
    const showEditOrderPopup = ref(false);
    const showOrderDetailPopup = ref(false);
    const editedOrder = ref({});
    const selectedOrder = ref({});
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchOrders = () => {
      // Trong thực tế, gọi API để lấy danh sách đơn hàng
      // Ví dụ: await apiGetOrders();
    };

    const editOrder = (id) => {
      const order = orders.value.find(o => o.id === id);
      editedOrder.value = { ...order };
      showEditOrderPopup.value = true;
    };

    const updateOrder = () => {
      const index = orders.value.findIndex(o => o.id === editedOrder.value.id);
      if (index !== -1) {
        orders.value[index] = { ...editedOrder.value };
        console.log('Cập nhật đơn hàng thành công:', editedOrder.value);
      }
      showEditOrderPopup.value = false;
    };

    const deleteOrder = (id) => {
      if (confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
        orders.value = orders.value.filter(o => o.id !== id);
      }
    };

    const updateOrderStatus = (id, status) => {
      const order = orders.value.find(o => o.id === id);
      if (order) {
        order.status = status;
        console.log(`Cập nhật trạng thái đơn hàng ${id} thành: ${status}`);
        // Trong thực tế, gọi API để cập nhật trạng thái: await apiUpdateOrderStatus(id, status);
      }
    };

    const showOrderDetails = (order) => {
      selectedOrder.value = { ...order };
      showOrderDetailPopup.value = true;
    };

    const filteredAndSortedOrders = computed(() => {
      let result = [...orders.value];

      if (searchQuery.value) {
        result = result.filter(order =>
          order.id.toString().includes(searchQuery.value) ||
          order.customer.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }

      if (sortKey.value) {
        result.sort((a, b) => {
          const valueA = a[sortKey.value];
          const valueB = b[sortKey.value];
          if (sortOrder.value === 'asc') {
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
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }
    };

    const getSortIcon = (key) => {
      if (sortKey.value === key) {
        return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      }
      return 'fas fa-sort';
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
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
    };
  },
};
</script>

<style scoped>
.admin-orders {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-orders h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.order-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
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
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

/* Modal Styles */
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
  width: 500px;
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

.form-group {
  margin-bottom: 15px;
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

/* Phân trang */
.pagination {
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
  border-radius: 0 0 5px 5px;
  font-size: 14px;
  color: #495057;
  margin-top: 20px;
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