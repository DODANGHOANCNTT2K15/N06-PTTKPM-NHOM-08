<template>
    <div class="admin-users">
      <h1>Quản lý Người dùng</h1>
      <div class="user-list">
        <div class="user-item" v-for="user in users" :key="user.id">
          <h3>{{ user.name }}</h3>
          <p>Email: {{ user.email }}</p>
          <button @click="editUser(user.id)">Sửa</button>
          <button @click="deleteUser(user.id)">Xóa</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'UsersAdmin',
    setup() {
      const users = ref([
        { id: 1, name: 'Tina Bình', email: 'tina@gmail.com' },
        { id: 2, name: 'Đỗ Đình Hoàn', email: 'hoan@gmail.com' },
      ]);
  
      const editUser = (id) => {
        console.log(`Chỉnh sửa người dùng ID: ${id}`);
      };
  
      const deleteUser = (id) => {
        users.value = users.value.filter((user) => user.id !== id);
        console.log(`Xóa người dùng ID: ${id}`);
      };
  
      return {
        users,
        editUser,
        deleteUser,
      };
    },
  };
  </script>
  
  <style scoped>
  .admin-users {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .admin-users h1 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .user-list {
    display: grid;
    gap: 20px;
  }
  
  .user-item {
    background-color: #ecf0f1;
    padding: 15px;
    border-radius: 5px;
  }
  
  .user-item h3 {
    font-size: 16px;
    color: #2c3e50;
    margin-bottom: 10px;
  }
  
  .user-item p {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }
  
  .user-item button {
    padding: 5px 10px;
    margin-right: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  
  .user-item button:first-child {
    background-color: #3498db;
    color: white;
  }
  
  .user-item button:first-child:hover {
    background-color: #2980b9;
  }
  
  .user-item button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  
  .user-item button:last-child:hover {
    background-color: #c0392b;
  }
  </style>