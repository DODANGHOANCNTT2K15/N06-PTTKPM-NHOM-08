<template>
  <div class="profile-info-content">
    <h2>Đơn hàng của bạn</h2>
    <div class="orders-table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>STT</th>
            <th>Mã đơn hàng</th>
            <th>Tên sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in paginatedOrders" :key="order.order_id">
            <td><input type="checkbox" v-model="order.selected" /></td>
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>{{ order.order_id }}</td>
            <td>
              <router-link :to="`/product/${order.book_id}`" class="product-name">
                {{ order.book_title }}
              </router-link>
            </td>
            <td>{{ formatPrice(order.total_price) }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>{{ getStatusText(order.status) }}</td>
            <td>
              <button class="cancel-btn" @click="cancelOrder(order.order_id)" v-if="order.status === 'pending'">
                Hủy đơn
              </button>
              <span v-else>-</span>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="orders.length === 0" class="no-items">
        Bạn chưa có đơn hàng nào.
      </p>

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
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'UserOrders',
  setup() {
    const orders = ref([]);
    const itemsPerPage = ref(5); // Số đơn hàng mỗi trang
    const currentPage = ref(1); // Trang hiện tại
    const selectAll = ref(false); // Checkbox chọn tất cả

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
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    };

    // Format ngày tháng
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN');
    };

    // Chuyển đổi trạng thái thành văn bản
    const getStatusText = (status) => {
      switch (status) {
        case 'pending':
          return 'Đang xử lý';
        case 'shipping':
          return 'Đang ship';
        case 'delivered':
          return 'Đã nhận';
        default:
          return 'Không xác định';
      }
    };

    // Lấy dữ liệu đơn hàng (giả lập)
    const fetchOrders = () => {
      orders.value = [
        { 
          order_id: 'DH001', 
          book_id: 1, 
          book_title: 'Sách 1', 
          total_price: 150000, 
          order_date: '2023-10-01', 
          status: 'pending', 
          selected: false 
        },
        { 
          order_id: 'DH002', 
          book_id: 2, 
          book_title: 'Sách 2', 
          total_price: 400000, 
          order_date: '2023-10-02', 
          status: 'shipping', 
          selected: false 
        },
        { 
          order_id: 'DH003', 
          book_id: 3, 
          book_title: 'Sách 3', 
          total_price: 120000, 
          order_date: '2023-10-03', 
          status: 'delivered', 
          selected: false 
        },
        { 
          order_id: 'DH004', 
          book_id: 4, 
          book_title: 'Sách 4', 
          total_price: 540000, 
          order_date: '2023-10-04', 
          status: 'pending', 
          selected: false 
        },
      ];
    };

    // Chọn hoặc bỏ chọn tất cả trên trang hiện tại
    const toggleSelectAll = () => {
      paginatedOrders.value.forEach((order) => {
        order.selected = selectAll.value;
      });
    };

    // Hủy đơn hàng
    const cancelOrder = (orderId) => {
      const index = orders.value.findIndex((order) => order.order_id === orderId);
      if (index !== -1) {
        orders.value.splice(index, 1);
        alert('Đã hủy đơn hàng thành công!');
        if (paginatedOrders.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      }
    };

    onMounted(() => {
      fetchOrders();
    });

    return {
      orders,
      itemsPerPage,
      currentPage,
      selectAll,
      totalPages,
      paginatedOrders,
      formatPrice,
      formatDate,
      getStatusText,
      toggleSelectAll,
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

.orders-table-container {
  width: 100%;
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.orders-table th,
.orders-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.orders-table th {
  background-color: #f5f5f5;
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.orders-table td {
  font-size: 14px;
  color: #666;
}

.orders-table tr:hover {
  background-color: #f9f9f9;
}

.product-name {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.product-name:hover {
  text-decoration: underline;
}

.cancel-btn {
  padding: 6px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover {
  background-color: #c0392b;
}

.no-items {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: 20px;
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