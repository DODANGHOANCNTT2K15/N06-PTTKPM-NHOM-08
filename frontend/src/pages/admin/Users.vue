<template>
  <div class="admin-users">
    <h1>Quản lý Người dùng</h1>
    <div class="user-actions">
      <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên..." class="search-input" />
      <button @click="showAddUserPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Người dùng
      </button>
    </div>
    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th @click="sort('user_id')">User ID <i :class="getSortIcon('user_id')"></i></th>
            <th @click="sort('user_name')">Tên người dùng <i :class="getSortIcon('user_name')"></i></th>
            <th @click="sort('email')">Email <i :class="getSortIcon('email')"></i></th>
            <th @click="sort('role')">Loại tài khoản <i :class="getSortIcon('role')"></i></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredAndSortedUsers" :key="user.id">
            <td>{{ user.user_id }}</td>
            <td>{{ user.user_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role === 1 ? "Admin" : "Khách hàng" }}</td>
            <td>
              <button @click="editUser(user.id)" class="action-btn edit-btn">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click="changePopup(user.id)" class="action-btn password-btn">
                <i class="fas fa-key"></i>
              </button>
              <button @click="deleteUser(user.email)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span>Hiển thị trang {{ currentPage }} / {{ totalPages }} - {{ filteredAndSortedUsers.length }} kết quả</span>
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

    <!-- Popup Thêm Người dùng -->
    <div v-if="showAddUserPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Người dùng</h2>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>Tên:</label>
            <input v-model="newUser.user_name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="newUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Mật khẩu:</label>
            <input v-model="newUser.pass_word" type="password" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="newUser.role" required>
              <option value="0">Người dùng</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="newUser.status" required>
              <option value="0">Hoạt động</option>
              <option value="1">Dừng hoạt động</option>
            </select>
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
            <input v-model="editedUser.user_name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="editedUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="editedUser.role" required>
              <option value="0">Người dùng</option>
              <option value="1">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="editedUser.status" required>
              <option value="0">Hoạt động</option>
              <option value="1">Dừng hoạt động</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="submit">Cập nhật</button>
            <button @click="showEditUserPopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup Đổi Mật Khẩu -->
    <div v-if="showChangePasswordPopup" class="modal">
      <div class="modal-content">
        <h2>Đổi Mật Khẩu</h2>
        <form @submit.prevent="changePassword">
          <div class="form-group">
            <label>User ID:</label>
            <input v-model="passwordChange.user_id" type="text" required disabled />
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input v-model="passwordChange.email" type="email" required disabled />
          </div>
          <div class="form-group">
            <label>Mật khẩu mới:</label>
            <input v-model="passwordChange.new_pass_word" type="password" required />
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="showChangePasswordPopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { apiGetAllUsers, apiAddUser, apiEditUser, apiDeleteUser, apiChangePassword } from '@/services/admin/UserService';

export default {
  name: 'UsersAdmin',
  setup() {
    const users = ref([]);
    const searchQuery = ref('');
    const sortKey = ref('');
    const sortOrder = ref('asc');
    const showAddUserPopup = ref(false);
    const showEditUserPopup = ref(false);
    const showChangePasswordPopup = ref(false);
    const newUser = ref({ user_name: '', email: '', pass_word: '', role: '0', status: '0' });
    const editedUser = ref({});
    const passwordChange = ref({ user_id: '', email: '', new_pass_word: '' });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchUsers = async () => {
      try {
        const response = await apiGetAllUsers();
        users.value = response.data.data;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };

    const addUser = async () => {
      try {
        const payload = { ...newUser.value };
        const response = await apiAddUser(payload);
        if (response.data) {
          await fetchUsers();
          newUser.value = { user_name: '', email: '', pass_word: '', role: '0', status: '0' };
          showAddUserPopup.value = false;
          console.log('Thêm người dùng thành công:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi thêm người dùng:', error);
      }
    };

    const editUser = (id) => {
      const user = users.value.find((u) => u.id === id);
      editedUser.value = { ...user };
      showEditUserPopup.value = true;
    };

    const updateUser = async () => {
      try {
        const payload = { ...editedUser.value };
        const response = await apiEditUser(payload);
        if (response.data) {
          await fetchUsers();
          showEditUserPopup.value = false;
          console.log('Cập nhật người dùng thành công:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật người dùng:', error);
      }
    };

    const deleteUser = async (email) => {
      try {
        const payload = { email };
        const response = await apiDeleteUser(payload);
        if (response.data) {
          await fetchUsers();
          console.log(`Xóa người dùng : ${email} thành công`);
        }
      } catch (error) {
        console.error('Lỗi khi xóa người dùng:', error);
      }
    };

    const changePopup = (id) => { // Đổi tên thành changePopup (theo chuẩn camelCase)
      const user = users.value.find((u) => u.id === id);
      passwordChange.value = {
        user_id: user.user_id,
        email: user.email,
        new_pass_word: ''
      };
      showChangePasswordPopup.value = true;
    };

    const changePassword = async () => {
      try {
        const payload = { ...passwordChange.value };
        const response = await apiChangePassword(payload);
        if (response.data) {
          showChangePasswordPopup.value = false;
          console.log('Đổi mật khẩu thành công:', response.data);
          await fetchUsers();
        }
      } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
      }
    };

    const filteredAndSortedUsers = computed(() => {
      let result = [...users.value];

      if (searchQuery.value) {
        result = result.filter(user =>
          user.user_name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
      return Math.ceil(users.value.length / itemsPerPage.value);
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
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    onMounted(fetchUsers);

    return {
      users,
      searchQuery,
      showAddUserPopup,
      showEditUserPopup,
      showChangePasswordPopup,
      newUser,
      editedUser,
      passwordChange,
      editUser,
      deleteUser,
      addUser,
      updateUser,
      changePassword,
      changePopup, // Thêm changePopup vào đây
      filteredAndSortedUsers,
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
.admin-users {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-users h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.user-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
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

.add-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2);
}

.add-button:hover {
  background-color: #0056b3;
}

.add-button i {
  margin-right: 5px;
}

.user-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.user-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.user-table th,
.user-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

.user-table th {
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.user-table th i {
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
}

.user-table td {
  background-color: #ffffff;
}

.user-table button.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
}

.user-table button.action-btn:hover {
  opacity: 0.8;
}

.user-table .edit-btn i {
  color: #007bff;
  font-size: 16px;
}

.user-table .delete-btn i {
  color: #dc3545;
  font-size: 16px;
}

.user-table .password-btn i {
  color: #ffc107;
  /* Màu vàng cho icon khóa */
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
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.modal-content h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
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
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  color: #495057;
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