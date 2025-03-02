<template>
    <div class="dashboard">
      <h1>Dashboard Quản lý</h1>
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Tổng Sách</h3>
          <p>150</p>
        </div>
        <div class="stat-card">
          <h3>Tổng Người dùng</h3>
          <p>500</p>
        </div>
        <div class="stat-card">
          <h3>Tổng Đơn hàng</h3>
          <p>300</p>
        </div>
      </div>
      <div class="recent-activity">
        <h2>Hoạt động Gần đây</h2>
        <ul>
          <li>Người dùng "Tina Bình" đã đặt sách vào 2025-02-27</li>
          <li>Sách "Thiên Tài Bên Trái" đã được cập nhật</li>
          <li>Đơn hàng #12345 đã hoàn thành</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard', // Đổi tên thành AdminDashboard
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
    grid-template-columns: repeat(3, 1fr);
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
  </style>