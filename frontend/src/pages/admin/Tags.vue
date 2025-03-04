<template>
    <div class="dashboard">
      <h1>Quản lý Tag Book</h1>
      <div class="dashboard-stats">
        <div class="stat-card">
          <h3>Tổng Tag</h3>
          <p>50</p>
        </div>
        <div class="stat-card">
          <h3>Tag Hoạt động</h3>
          <p>45</p>
        </div>
        <div class="stat-card">
          <h3>Tag Ẩn</h3>
          <p>5</p>
        </div>
      </div>
      <div class="recent-activity">
        <h2>Danh sách Tag Gần đây</h2>
        <ul>
          <li>Tag "Khoa học" đã được thêm vào 2025-03-02</li>
          <li>Tag "Văn học" đã được chỉnh sửa</li>
          <li>Tag "Trẻ em" đã bị ẩn</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TagsAdmin',
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