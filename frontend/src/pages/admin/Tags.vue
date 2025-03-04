<template>
  <div class="admin-book-types">
    <h1>Quản lý Loại Sách</h1>
    <div class="book-type-actions">
      <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên..." class="search-input" />
      <button @click="showAddBookTypePopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Loại Sách
      </button>
    </div>
    <div class="book-type-table">
      <table>
        <thead>
          <tr>
            <th @click="sort('book_type_id')">ID Loại Sách <i :class="getSortIcon('book_type_id')"></i></th>
            <th @click="sort('name')">Tên Loại Sách <i :class="getSortIcon('name')"></i></th>
            <th @click="sort('description')">Mô tả <i :class="getSortIcon('description')"></i></th>
            <th @click="sort('createdAt')">Ngày Tạo <i :class="getSortIcon('createdAt')"></i></th>
            <th @click="sort('updatedAt')">Ngày Cập Nhật <i :class="getSortIcon('updatedAt')"></i></th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bookType in filteredAndSortedBookTypes" :key="bookType.book_type_id">
            <td>{{ bookType.book_type_id }}</td>
            <td>{{ bookType.name }}</td>
            <td>{{ bookType.description }}</td>
            <td>{{ new Date(bookType.createdAt).toLocaleString() }}</td>
            <td>{{ new Date(bookType.updatedAt).toLocaleString() }}</td>
            <td>
              <button @click="editBookType(bookType.book_type_id)" class="action-btn edit-btn">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click="deleteBookType(bookType.book_type_id)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span>Hiển thị trang {{ currentPage }} / {{ totalPages }} - {{ filteredAndSortedBookTypes.length }} kết quả</span>
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

    <!-- Popup Thêm Loại Sách -->
    <div v-if="showAddBookTypePopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Loại Sách</h2>
        <form @submit.prevent="addBookType">
          <div class="form-group">
            <label>Tên Loại Sách:</label>
            <input v-model="newBookType.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Mô tả:</label>
            <textarea v-model="newBookType.description" required></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="showAddBookTypePopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup Sửa Loại Sách -->
    <div v-if="showEditBookTypePopup" class="modal">
      <div class="modal-content">
        <h2>Sửa Loại Sách</h2>
        <form @submit.prevent="updateBookType">
          <div class="form-group">
            <label>ID Loại Sách:</label>
            <input v-model="editedBookType.book_type_id" type="text" required disabled />
          </div>
          <div class="form-group">
            <label>Tên Loại Sách:</label>
            <input v-model="editedBookType.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Mô tả:</label>
            <textarea v-model="editedBookType.description" required></textarea>
          </div>
          <div class="modal-actions">
            <button type="submit">Cập nhật</button>
            <button @click="showEditBookTypePopup = false">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { apiGetAllBookTypes, apiAddBookType, apiEditBookType, apiDeleteBookType } from '@/services/admin/TagBooksService';

export default {
  name: 'BookTypesAdmin',
  setup() {
    const bookTypes = ref([]);
    const searchQuery = ref('');
    const sortKey = ref('');
    const sortOrder = ref('asc');
    const showAddBookTypePopup = ref(false);
    const showEditBookTypePopup = ref(false);
    const newBookType = ref({ name: '', description: '' });
    const editedBookType = ref({});
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchBookTypes = async () => {
      try {
        const response = await apiGetAllBookTypes();
        bookTypes.value = response.data.data; // Dựa trên cấu trúc JSON bạn cung cấp
      } catch (error) {
        console.error('Lỗi khi lấy danh sách loại sách:', error);
      }
    };

    const addBookType = async () => {
      try {
        const payload = { ...newBookType.value };
        const response = await apiAddBookType(payload);
        if (response.data) {
          await fetchBookTypes();
          newBookType.value = { name: '', description: '' };
          showAddBookTypePopup.value = false;
          console.log('Thêm loại sách thành công:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi thêm loại sách:', error);
      }
    };

    const editBookType = (id) => {
      const bookType = bookTypes.value.find((bt) => bt.book_type_id === id);
      editedBookType.value = { ...bookType };
      showEditBookTypePopup.value = true;
    };

    const updateBookType = async () => {
      try {
        const payload = { ...editedBookType.value };
        const response = await apiEditBookType(payload);
        if (response.data) {
          await fetchBookTypes();
          showEditBookTypePopup.value = false;
          console.log('Cập nhật loại sách thành công:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật loại sách:', error);
      }
    };

    const deleteBookType = async (id) => {
      try {
        const payload = { book_type_id: id };
        const response = await apiDeleteBookType(payload);
        if (response.data) {
          await fetchBookTypes();
          console.log(`Xóa loại sách ID: ${id} thành công`);
        }
      } catch (error) {
        console.error('Lỗi khi xóa loại sách:', error);
      }
    };

    const filteredAndSortedBookTypes = computed(() => {
      let result = [...bookTypes.value];

      if (searchQuery.value) {
        result = result.filter(bookType =>
          bookType.name.toLowerCase().includes(searchQuery.value.toLowerCase())
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
      return Math.ceil(bookTypes.value.length / itemsPerPage.value);
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

    onMounted(fetchBookTypes);

    return {
      bookTypes,
      searchQuery,
      showAddBookTypePopup,
      showEditBookTypePopup,
      newBookType,
      editedBookType,
      editBookType,
      deleteBookType,
      addBookType,
      updateBookType,
      filteredAndSortedBookTypes,
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
.admin-book-types {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-book-types h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.book-type-actions {
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

.book-type-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.book-type-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.book-type-table th,
.book-type-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

.book-type-table th {
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.book-type-table th i {
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
}

.book-type-table td {
  background-color: #ffffff;
}

.book-type-table button.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
}

.book-type-table button.action-btn:hover {
  opacity: 0.8;
}

.book-type-table .edit-btn i {
  color: #007bff;
  font-size: 16px;
}

.book-type-table .delete-btn i {
  color: #dc3545;
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
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
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