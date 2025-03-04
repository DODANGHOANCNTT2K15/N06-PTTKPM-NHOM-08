<template>
  <div class="admin-books">
    <h1>Quản lý Sách</h1>
    <div class="book-actions">
      <button @click="showAddBookPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Sách
      </button>
    </div>
    <div class="book-table">
      <table>
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Tác giả</th>
            <th>Giá giảm</th>
            <th>Giá gốc</th>
            <th>Số lượng đã bán</th>
            <th>Đánh giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.discountedPrice }}₫</td>
            <td>{{ book.originalPrice }}₫</td>
            <td>{{ book.sold }}</td>
            <td>{{ book.rating }}</td>
            <td class="actions">
              <button @click="editBook(book.id)">Sửa</button>
              <button @click="deleteBook(book.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Thêm Sách -->
    <div v-if="showAddBookPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Sách Mới</h2>
        <div class="form-group">
          <label>Hình ảnh</label>
          <input type="file" multiple @change="handleImageUpload" accept="image/*" />
        </div>
        <div class="form-group">
          <label>Giá giảm</label>
          <input type="number" v-model.number="newBook.discountedPrice" placeholder="Nhập giá giảm (VNĐ)" />
        </div>
        <div class="form-group">
          <label>Giá gốc</label>
          <input type="number" v-model.number="newBook.originalPrice" placeholder="Nhập giá gốc (VNĐ)" />
        </div>
        <div class="form-group">
          <label>Tác giả</label>
          <input type="text" v-model="newBook.author" placeholder="Nhập tên tác giả" />
        </div>
        <div class="form-group">
          <label>Tiêu đề</label>
          <input type="text" v-model="newBook.title" placeholder="Nhập tiêu đề sách" />
        </div>
        <div class="modal-actions">
          <button @click="addBook">Lưu</button>
          <button @click="showAddBookPopup = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Popup Sửa Sách -->
    <div v-if="showEditBookPopup" class="modal">
      <div class="modal-content">
        <h2>Sửa Sách</h2>
        <div class="form-group">
          <label>Hình ảnh</label>
          <input type="file" multiple @change="handleImageUpload" accept="image/*" />
        </div>
        <div class="form-group">
          <label>Giá giảm</label>
          <input type="number" v-model.number="editedBook.discountedPrice" placeholder="Nhập giá giảm (VNĐ)" />
        </div>
        <div class="form-group">
          <label>Giá gốc</label>
          <input type="number" v-model.number="editedBook.originalPrice" placeholder="Nhập giá gốc (VNĐ)" />
        </div>
        <div class="form-group">
          <label>Tác giả</label>
          <input type="text" v-model="editedBook.author" placeholder="Nhập tên tác giả" />
        </div>
        <div class="form-group">
          <label>Tiêu đề</label>
          <input type="text" v-model="editedBook.title" placeholder="Nhập tiêu đề sách" />
        </div>
        <div class="modal-actions">
          <button @click="updateBook">Cập nhật</button>
          <button @click="showEditBookPopup = false">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'BooksAdmin',
  setup() {
    const books = ref([
      { id: 1, image: [], discountedPrice: 600000, originalPrice: 1600000, author: 'DAISETZ TEITARO SUZUKI', title: 'Thiền luận', sold: 96, rating: 4 },
      { id: 2, image: [], discountedPrice: 350000, originalPrice: 800000, author: 'NGUYEN DU', title: 'Truyện Kiều', sold: 150, rating: 5 },
    ]);

    const showAddBookPopup = ref(false);
    const showEditBookPopup = ref(false);
    const newBook = ref({
      id: null,
      image: [],
      discountedPrice: 0,
      originalPrice: 0,
      author: '',
      title: '',
      sold: 0, // Không cho phép sửa
      rating: 1, // Không cho phép sửa
    });

    const editedBook = ref({
      id: null,
      image: [],
      discountedPrice: 0,
      originalPrice: 0,
      author: '',
      title: '',
      sold: 0, // Không cho phép sửa
      rating: 1, // Không cho phép sửa
    });

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      const imagePaths = files.map(file => file.name); // Lưu tên file (hoặc bạn có thể xử lý file thực tế)
      if (showAddBookPopup.value) {
        newBook.value.image = imagePaths;
      } else if (showEditBookPopup.value) {
        editedBook.value.image = imagePaths;
      }
      console.log('Hình ảnh đã chọn:', imagePaths);
    };

    const addBook = () => {
      const newId = books.value.length + 1;
      books.value.push({
        id: newId,
        image: newBook.value.image,
        discountedPrice: newBook.value.discountedPrice,
        originalPrice: newBook.value.originalPrice,
        author: newBook.value.author,
        title: newBook.value.title,
        sold: newBook.value.sold, // Giá trị mặc định, không cho phép chỉnh sửa
        rating: newBook.value.rating, // Giá trị mặc định, không cho phép chỉnh sửa
      });
      showAddBookPopup.value = false;
      newBook.value = { id: null, image: [], discountedPrice: 0, originalPrice: 0, author: '', title: '', sold: 0, rating: 1 };
      console.log('Sách mới đã được thêm:', books.value);
    };

    const editBook = (id) => {
      const book = books.value.find((b) => b.id === id);
      editedBook.value = { ...book };
      showEditBookPopup.value = true;
    };

    const updateBook = () => {
      const index = books.value.findIndex((b) => b.id === editedBook.value.id);
      if (index !== -1) {
        books.value[index] = {
          ...editedBook.value,
          sold: books.value[index].sold, // Giữ nguyên sold
          rating: books.value[index].rating, // Giữ nguyên rating
        };
      }
      showEditBookPopup.value = false;
      editedBook.value = { id: null, image: [], discountedPrice: 0, originalPrice: 0, author: '', title: '', sold: 0, rating: 1 };
      console.log('Sách đã được cập nhật:', books.value);
    };

    const deleteBook = (id) => {
      books.value = books.value.filter((book) => book.id !== id);
      console.log(`Xóa sách ID: ${id}`);
    };

    return {
      books,
      showAddBookPopup,
      showEditBookPopup,
      newBook,
      editedBook,
      handleImageUpload,
      addBook,
      editBook,
      updateBook,
      deleteBook,
    };
  },
};
</script>

<style scoped>
.admin-books {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.admin-books h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.book-actions {
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

.book-table {
  margin-top: 20px;
}

.book-table table {
  width: 100%;
  border-collapse: collapse;
}

.book-table th, .book-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.book-table th {
  background-color: #2c3e50;
  color: white;
  font-size: 16px;
}

.book-table td {
  font-size: 14px;
  color: #666;
}

.book-table .actions {
  display: flex;
  gap: 10px;
}

.book-table button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.book-table button:first-child {
  background-color: #3498db;
  color: white;
}

.book-table button:first-child:hover {
  background-color: #2980b9;
}

.book-table button:last-child {
  background-color: #e74c3c;
  color: white;
}

.book-table button:last-child:hover {
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

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input[type="file"] {
  width: 100%;
  padding: 8px 0;
  border: none;
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