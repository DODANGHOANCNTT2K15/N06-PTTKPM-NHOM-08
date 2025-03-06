<template>
  <div class="dashboard">
    <h1>Dashboard Quản lý</h1>

    <!-- Thống kê nhanh -->
    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>Tổng Sách</h3>
        <p>{{ totalBooks }}</p>
      </div>
      <div class="stat-card">
        <h3>Tổng Người dùng</h3>
        <p>{{ totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Tổng Đơn hàng</h3>
        <p>{{ totalOrders }}</p>
      </div>
      <div class="stat-card">
        <h3>Banner Hoạt động</h3>
        <p>{{ activeBanners }}</p>
      </div>
      <div class="stat-card">
        <h3>Tổng Khuyến mại</h3>
        <p>{{ totalPromotions }}</p>
      </div>
    </div>

    <!-- Biểu đồ tổng quan -->
    <div class="charts">
      <div class="chart-card">
        <h2>Thống kê Số lượng</h2>
        <canvas ref="barChart" class="chart"></canvas>
      </div>
      <div class="chart-card">
        <h2>Tỷ lệ Banner & Khuyến mại</h2>
        <canvas ref="pieChart" class="chart"></canvas>
      </div>
    </div>

    <!-- Hoạt động gần đây với phân trang -->
    <div class="recent-activity">
      <h2>Hoạt động Gần đây</h2>
      <ul>
        <li v-for="activity in paginatedActivities" :key="activity.id">
          {{ activity.text }}
        </li>
      </ul>
      <div class="pagination" v-if="activities.length > 10">
        <span>Hiển thị trang {{ currentActivityPage }} / {{ totalActivityPages }} - {{ paginatedActivities.length }} kết quả</span>
        <div>
          <button @click="prevActivityPage" :disabled="currentActivityPage === 1" class="pagination-btn">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button @click="nextActivityPage" :disabled="currentActivityPage === totalActivityPages" class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboard',
  setup() {
    // Dữ liệu mẫu (trong thực tế, lấy từ API)
    const totalBooks = ref(150);
    const totalUsers = ref(500);
    const totalOrders = ref(300);
    const banners = ref([
      { id: 1, name: 'Ưu đãi Tết 2025', status: 'active' },
      { id: 2, name: 'Sách Mới', status: 'active' },
      { id: 3, name: 'Giảm giá 50%', status: 'inactive' },
    ]);
    const promotions = ref([
      { id: 1, name: 'Khuyến mãi Tết', discount: 20 },
      { id: 2, name: 'Giảm giá hè', discount: 15 },
      { id: 3, name: 'Black Friday', discount: 30 },
    ]);

    // Dữ liệu mẫu cho hoạt động gần đây
    const activities = ref([
      { id: 1, text: 'Người dùng "Tina Bình" đã đặt sách vào 2025-02-27' },
      { id: 2, text: 'Sách "Thiên Tài Bên Trái" đã được cập nhật' },
      { id: 3, text: 'Đơn hàng #12345 đã hoàn thành' },
      { id: 4, text: 'Banner "Ưu đãi Tết 2025" đã được thêm vào 2025-03-01' },
      { id: 5, text: 'Khuyến mại "Black Friday" đã được chỉnh sửa' },
      { id: 6, text: 'Người dùng "Nam Anh" đã đăng ký tài khoản' },
      { id: 7, text: 'Đơn hàng #12346 đã bị hủy' },
      { id: 8, text: 'Sách "Thiền Luận" đã được thêm vào danh mục' },
      { id: 9, text: 'Banner "Sách Mới" đã được kích hoạt' },
      { id: 10, text: 'Khuyến mại "Giảm giá hè" đã hết hạn' },
      { id: 11, text: 'Người dùng "Lan Nhi" đã đặt đơn hàng mới' },
      { id: 12, text: 'Đơn hàng #12347 đã được giao thành công' },
    ]);

    // Tính toán tổng
    const activeBanners = computed(() => banners.value.filter(b => b.status === 'active').length);
    const totalPromotions = computed(() => promotions.value.length);

    // Phân trang cho hoạt động gần đây
    const currentActivityPage = ref(1);
    const itemsPerPage = ref(10);

    const paginatedActivities = computed(() => {
      const start = (currentActivityPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return activities.value.slice(start, end);
    });

    const totalActivityPages = computed(() => {
      return Math.ceil(activities.value.length / itemsPerPage.value);
    });

    const prevActivityPage = () => {
      if (currentActivityPage.value > 1) currentActivityPage.value--;
    };

    const nextActivityPage = () => {
      if (currentActivityPage.value < totalActivityPages.value) currentActivityPage.value++;
    };

    // Tham chiếu đến canvas cho biểu đồ
    const barChart = ref(null);
    const pieChart = ref(null);
    let barChartInstance = null;
    let pieChartInstance = null;

    // Tạo biểu đồ cột (Bar Chart) cho số lượng sách, người dùng, đơn hàng
    const createBarChart = () => {
      if (barChartInstance) barChartInstance.destroy();
      barChartInstance = new Chart(barChart.value, {
        type: 'bar',
        data: {
          labels: ['Sách', 'Người dùng', 'Đơn hàng'],
          datasets: [{
            label: 'Số lượng',
            data: [totalBooks.value, totalUsers.value, totalOrders.value],
            backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
            borderColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Số lượng' },
            },
            x: {
              title: { display: true, text: 'Danh mục' },
            },
          },
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Thống kê Số lượng' },
          },
        },
      });
    };

    // Tạo biểu đồ tròn (Pie Chart) cho banner và khuyến mại
    const createPieChart = () => {
      if (pieChartInstance) pieChartInstance.destroy();
      pieChartInstance = new Chart(pieChart.value, {
        type: 'pie',
        data: {
          labels: ['Banner Hoạt động', 'Banner Tắt', 'Khuyến mại'],
          datasets: [{
            data: [activeBanners.value, banners.value.length - activeBanners.value, totalPromotions.value],
            backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Tỷ lệ Banner & Khuyến mại' },
          },
        },
      });
    };

    onMounted(() => {
      fetchStats(); // Trong thực tế, gọi API để lấy dữ liệu
      createBarChart();
      createPieChart();
    });

    // Hàm giả lập lấy dữ liệu (thay bằng API)
    const fetchStats = () => {
      // Ví dụ: await apiGetStats();
    };

    return {
      totalBooks,
      totalUsers,
      totalOrders,
      activeBanners,
      totalPromotions,
      activities,
      paginatedActivities,
      currentActivityPage,
      totalActivityPages,
      prevActivityPage,
      nextActivityPage,
      barChart,
      pieChart,
    };
  },
};
</script>

<style scoped>
.dashboard {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.dashboard h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Mở rộng thành 5 cột */
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.stat-card h3 {
  font-size: 16px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
  font-weight: bold;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr; /* Hai cột cho hai biểu đồ */
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.chart-card h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.chart {
  max-height: 300px; /* Giới hạn chiều cao biểu đồ */
}

.recent-activity {
  margin-top: 20px;
}

.recent-activity h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.recent-activity ul {
  list-style-type: none;
  padding: 0;
}

.recent-activity li {
  font-size: 14px;
  color: #666;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.recent-activity li:last-child {
  border-bottom: none;
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
  margin-top: 10px;
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