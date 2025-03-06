<template>
    <div class="sidebar">
      <div class="sidebar-item" @click="$router.push('/user/info')">
        <i class="fas fa-user"></i> Thông tin tài khoản
      </div>
      <div class="sidebar-item" @click="$router.push('/user/cart')">
        <i class="fas fa-shopping-cart"></i> Giỏ hàng
      </div>
      <div class="sidebar-item" @click="$router.push('/user/address')">
        <i class="fas fa-map-marker-alt"></i> Thông tin giao hàng
      </div>
      <div class="sidebar-item" @click="$router.push('/user/like')">
        <i class="fas fa-heart"></i> Sản phẩm yêu thích
      </div>
      <div class="sidebar-item" @click="$router.push('/user/history')">
        <i class="fas fa-eye"></i> Lịch sử sản phẩm
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SideBar',
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
  
  .sidebar-item i {
    color: #007bff;
  }
  
  .sidebar-item:hover {
    color: #007bff;
  }
  </style>