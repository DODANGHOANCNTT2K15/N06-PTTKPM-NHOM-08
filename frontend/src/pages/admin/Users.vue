<template>
  <div class="admin-users">
    <h1>Quản lý Người dùng</h1>
    <div class="user-actions">
      <button @click="showAddUserPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Người dùng
      </button>
    </div>
    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.user_id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <button @click="editUser(user.id)">Sửa</button>
              <button @click="deleteUser(user.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Thêm Người dùng -->
    <div v-if="showAddUserPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Người dùng</h2>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>Tên:</label>
            <input v-model="newUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Mật khẩu:</label>
            <input v-model="newUser.password" type="password" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <input v-model="newUser.role" type="number" required />
          </div>
          <div class="form-group">
            <label>Status:</label>
            <input v-model="newUser.status" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="showAddUserPopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup Sửa Người dùng -->
    <div v-if="showEditUserPopup" class="modal">
      <div class="modal-content">
        <h2>Sửa Người dùng</h2>
        <form @submit.prevent="updateUser">
          <div class="form-group">
            <label>User ID:</label>
            <input v-model="editedUser.user_id" type="text" required disabled />
          </div>
          <div class="form-group">
            <label>Tên:</label>
            <input v-model="editedUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editedUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Mật khẩu:</label>
            <input v-model="editedUser.password" type="password" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <input v-model="editedUser.role" type="number" required />
          </div>
          <div class="form-group">
            <label>Status:</label>
            <input v-model="editedUser.status" type="number" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Cập nhật</button>
            <button @click="showEditUserPopup = false">Hủy</button>
          </div>
        </form>
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
      { id: 1, user_id: 'user1', name: 'Tina Bình', email: 'tina@gmail.com', password: '123456', role: 1, status: 1 },
      { id: 2, user_id: 'user2', name: 'Đỗ Đình Hoàn', email: 'hoan@gmail.com', password: '123456', role: 1, status: 1 },
    ]);

    const showAddUserPopup = ref(false);
    const showEditUserPopup = ref(false);
    const newUser = ref({ name: '', email: '', password: '', role: 0, status: 0 });
    const editedUser = ref({});

    const editUser = (id) => {
      const user = users.value.find((u) => u.id === id);
      editedUser.value = { ...user };
      showEditUserPopup.value = true;
    };

    const deleteUser = (id) => {
      users.value = users.value.filter((user) => user.id !== id);
      console.log(`Xóa người dùng ID: ${id}`);
    };

    const addUser = () => {
      const newId = users.value.length + 1;
      const newUserId = `user${newId}`; // Tạo user_id tự động (ví dụ)
      users.value.push({
        id: newId,
        user_id: newUserId,
        ...newUser.value,
      });
      newUser.value = { name: '', email: '', password: '', role: 0, status: 0 };
      showAddUserPopup.value = false;
      console.log(`Thêm người dùng:`, users.value);
    };

    const updateUser = () => {
      const index = users.value.findIndex((u) => u.id === editedUser.value.id);
      if (index !== -1) {
        users.value[index] = { ...editedUser.value };
      }
      showEditUserPopup.value = false;
      console.log(`Cập nhật người dùng:`, users.value);
    };

    return {
      users,
      showAddUserPopup,
      showEditUserPopup,
      newUser,
      editedUser,
      editUser,
      deleteUser,
      addUser,
      updateUser,
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

.user-actions {
  margin-bottom: 20px;
}

.add-button {
  padding: 10px 20px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.add-button:hover {
  background-color: #219653;
}

.user-table {
  overflow-x: auto; /* Cho phép cuộn ngang nếu bảng quá rộng */
}

.user-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.user-table th,
.user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-table th {
  background-color: #3498db;
  color: white;
  font-weight: bold;
}

.user-table td {
  background-color: #ecf0f1;
}

.user-table button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.user-table button:first-child {
  background-color: #3498db;
  color: white;
}

.user-table button:first-child:hover {
  background-color: #2980b9;
}

.user-table button:last-child {
  background-color: #e74c3c;
  color: white;
}

.user-table button:last-child:hover {
  background-color: #c0392b;
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
  border-radius: 5px;
  width: 400px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.modal-content h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
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
</style>