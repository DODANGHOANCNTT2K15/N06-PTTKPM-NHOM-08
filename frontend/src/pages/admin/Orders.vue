<template>
    <div class="admin-orders">
      <h1>Quản lý Đơn hàng</h1>
      <div class="order-list">
        <div class="order-item" v-for="order in orders" :key="order.id">
          <h3>Đơn hàng #{{ order.id }}</h3>
          <p>Khách hàng: {{ order.customer }}</p>
          <p>Tổng: {{ order.total }} VNĐ</p>
          <button @click="editOrder(order.id)">Sửa</button>
          <button @click="deleteOrder(order.id)">Xóa</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'OrdersAdmin',
    setup() {
      const orders = ref([
        { id: 1, customer: 'Tina Bình', total: 600000 },
        { id: 2, customer: 'Đỗ Đình Hoàn', total: 500000 },
      ]);
  
      const editOrder = (id) => {
        console.log(`Chỉnh sửa đơn hàng ID: ${id}`);
      };
  
      const deleteOrder = (id) => {
        orders.value = orders.value.filter((order) => order.id !== id);
        console.log(`Xóa đơn hàng ID: ${id}`);
      };
  
      return {
        orders,
        editOrder,
        deleteOrder,
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
  
  .order-list {
    display: grid;
    gap: 20px;
  }
  
  .order-item {
    background-color: #ecf0f1;
    padding: 15px;
    border-radius: 5px;
  }
  
  .order-item h3 {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .order-item p {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .order-item button {
    padding: 5px 10px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .order-item button:first-child {
    background-color: #3498db;
    color: white;
  }
  
  .order-item button:first-child:hover {
    background-color: #2980b9;
  }
  
  .order-item button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  
  .order-item button:last-child:hover {
    background-color: #c0392b;
  }
  </style>