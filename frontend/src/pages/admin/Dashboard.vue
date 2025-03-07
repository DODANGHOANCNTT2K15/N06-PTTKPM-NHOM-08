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
import { apiGetAllUsers } from '@/services/admin/UserService';
import { apiGetAllBooks } from '@/services/admin/BookService';
import { apiGetAllDiscounts } from '@/services/admin/DiscountService';
import { apiGetAllBanners } from '@/services/admin/BannerService';
import { apiGetAllOrderService } from '@/services/admin/OrderService'; // Thêm import mới

export default {
  name: 'AdminDashboard',
  setup() {
    // Dữ liệu sẽ được cập nhật từ API
    const totalBooks = ref(0);
    const totalUsers = ref(0);
    const totalOrders = ref(0); // Khởi tạo là 0 thay vì giá trị giả định
    const banners = ref([]);
    const promotions = ref([]);

    // Activities và các computed properties khác giữ nguyên
    const activities = ref([
      // Danh sách activities mẫu giữ nguyên
    ]);

    const activeBanners = computed(() => {
      return banners.value.length;
    });
    const totalPromotions = computed(() => promotions.value.length);

    // Phân trang giữ nguyên
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

    // Hàm tạo biểu đồ giữ nguyên
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
            y: { beginAtZero: true, title: { display: true, text: 'Số lượng' } },
            x: { title: { display: true, text: 'Danh mục' } },
          },
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Thống kê Số lượng' },
          },
        },
      });
    };

    const createPieChart = () => {
      if (pieChartInstance) pieChartInstance.destroy();
      pieChartInstance = new Chart(pieChart.value, {
        type: 'pie',
        data: {
          labels: ['Banner Hoạt động', 'Khuyến mại'],
          datasets: [{
            data: [activeBanners.value, totalPromotions.value],
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

    // Hàm lấy dữ liệu từ API đã được cập nhật
    const fetchStats = async () => {
      try {
        // Lấy tổng người dùng
        const usersResponse = await apiGetAllUsers();
        if (usersResponse.data.err === 0) {
          totalUsers.value = usersResponse.data.data.length;
        } else {
          console.error('Lỗi khi lấy danh sách người dùng:', usersResponse.data.msg);
          totalUsers.value = 0;
        }

        // Lấy tổng sách
        const booksResponse = await apiGetAllBooks();
        if (booksResponse.data.err === 0) {
          totalBooks.value = booksResponse.data.data.length;
        } else {
          console.error('Lỗi khi lấy danh sách sách:', booksResponse.data.msg);
          totalBooks.value = 0;
        }

        // Lấy tổng khuyến mãi
        const discountsResponse = await apiGetAllDiscounts();
        if (discountsResponse.data.err === 0) {
          promotions.value = discountsResponse.data.data;
        } else {
          console.error('Lỗi khi lấy danh sách khuyến mãi:', discountsResponse.data.msg);
          promotions.value = [];
        }

        // Lấy danh sách banner
        const bannersResponse = await apiGetAllBanners();
        if (bannersResponse.data.err === 0) {
          banners.value = bannersResponse.data.data;
        } else {
          console.error('Lỗi khi lấy danh sách banner:', bannersResponse.data.msg);
          banners.value = [];
        }

        // Lấy tổng đơn hàng - Thêm mới
        const ordersResponse = await apiGetAllOrderService();
        if (ordersResponse.data.err === 0) {
          totalOrders.value = ordersResponse.data.data.length;
        } else {
          console.error('Lỗi khi lấy danh sách đơn hàng:', ordersResponse.data.msg);
          totalOrders.value = 0;
        }

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        totalUsers.value = 0;
        totalBooks.value = 0;
        totalOrders.value = 0; // Thêm vào xử lý lỗi
        promotions.value = [];
        banners.value = [];
      }
    };

    onMounted(async () => {
      await fetchStats();
      createBarChart();
      createPieChart();
    });

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
/* Style giữ nguyên */
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
  grid-template-columns: repeat(5, 1fr);
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
  grid-template-columns: 1fr 1fr;
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
  max-height: 300px;
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