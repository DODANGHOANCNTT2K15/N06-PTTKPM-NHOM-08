<template>
  <div class="admin-books">
    <h1>Quản lý Sách</h1>
    <div class="book-actions">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo tiêu đề..."
        class="search-input"
      />
      <button @click="showAddBookPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Sách
      </button>
    </div>
    <div class="book-table">
      <table>
        <thead>
          <tr>
            <th @click="sort('book_id')">
              Book ID <i :class="getSortIcon('book_id')"></i>
            </th>
            <th @click="sort('title')">
              Tiêu đề <i :class="getSortIcon('title')"></i>
            </th>
            <th @click="sort('author')">
              Tác giả <i :class="getSortIcon('author')"></i>
            </th>
            <th @click="sort('price')">
              Giá sản phẩm <i :class="getSortIcon('price')"></i>
            </th>
            <th @click="sort('discount_price')">
              Khuyến mãi <i :class="getSortIcon('discount_price')"></i>
            </th>
            <th @click="sort('stock_quantity')">
              Số lượng <i :class="getSortIcon('stock_quantity')"></i>
            </th>
            <th>Ảnh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredAndSortedBooks" :key="book.book_id">
            <td>{{ book.book_id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ formatPrice(book.price) }}</td>
            <td>
              {{ book.discount_price ? `${book.discount_price}%` : "0" }}
            </td>
            <td>{{ book.stock_quantity }}</td>
            <td>
              <div class="book-images">
                <div
                  v-for="image in book.images"
                  :key="image.image_public_id"
                  class="image-container"
                >
                  <img
                    :src="image.image_path"
                    alt="Book Image"
                    class="book-image"
                  />
                  <button
                    @click="deleteImage(book.book_id, image.image_public_id)"
                    class="delete-image-btn"
                  >
                    ×
                  </button>
                </div>
              </div>
            </td>
            <td>
              <button
                @click="editBook(book.book_id)"
                class="action-btn edit-btn"
              >
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button
                @click="addImage(book.book_id)"
                class="action-btn add-image-btn"
              >
                <i class="fas fa-image"></i>
              </button>
              <button
                @click="deleteBook(book.book_id)"
                class="action-btn delete-btn"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <span
          >Hiển thị trang {{ currentPage }} / {{ totalPages }} -
          {{ filteredAndSortedBooks.length }} kết quả</span
        >
        <div>
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Popup Thêm Sách -->
    <div v-if="showAddBookPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Sách</h2>
        <form @submit.prevent="addBook">
          <div class="form-columns">
            <div class="form-column">
              <div class="form-group">
                <label>Tiêu đề:</label>
                <input v-model="newBook.title" type="text" required />
              </div>
              <div class="form-group">
                <label>Tác giả:</label>
                <input v-model="newBook.author" type="text" required />
              </div>
              <div class="form-group">
                <label>Nhà xuất bản:</label>
                <input v-model="newBook.publisher" type="text" required />
              </div>
              <div class="form-group">
                <label>Ngày xuất bản:</label>
                <input v-model="newBook.published_date" type="date" required />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label>Giá:</label>
                <input v-model="newBook.price" type="number" required />
              </div>
              <div class="form-group">
                <label>Khuyến mãi(%) (nếu có):</label>
                <input v-model="newBook.discount_price" type="number" />
              </div>
              <div class="form-group">
                <label>Số lượng tồn kho:</label>
                <input
                  v-model="newBook.stock_quantity"
                  type="number"
                  required
                />
              </div>
              <div class="form-group">
                <label>Loại sách:</label>
                <select v-model="newBook.book_type_id" required>
                  <option value="" disabled>Chọn loại sách</option>
                  <option
                    v-for="type in bookTypes"
                    :key="type.book_type_id"
                    :value="type.book_type_id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Mô tả:</label>
            <textarea v-model="newBook.description" rows="4"></textarea>
          </div>
          <div class="form-group full-width">
            <label>Ảnh:</label>
            <input
              type="file"
              multiple
              @change="handleNewImages"
              accept="image/*"
              ref="fileInput"
            />
            <div class="image-preview" v-if="newBook.imagePreviews.length > 0">
              <img
                v-for="(preview, index) in newBook.imagePreviews"
                :key="index"
                :src="preview"
                alt="Preview"
                class="preview-image"
              />
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="cancelAddBook">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup Sửa Sách -->
    <div v-if="showEditBookPopup" class="modal">
      <div class="modal-content">
        <h2>Sửa Sách</h2>
        <form @submit.prevent="updateBook">
          <div class="form-columns">
            <div class="form-column">
              <div class="form-group">
                <label>Tiêu đề:</label>
                <input v-model="editedBook.title" type="text" required />
              </div>
              <div class="form-group">
                <label>Tác giả:</label>
                <input v-model="editedBook.author" type="text" required />
              </div>
              <div class="form-group">
                <label>Nhà xuất bản:</label>
                <input v-model="editedBook.publisher" type="text" required />
              </div>
              <div class="form-group">
                <label>Ngày xuất bản:</label>
                <input
                  v-model="editedBook.published_date"
                  type="date"
                  required
                />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label>Giá:</label>
                <input v-model="editedBook.price" type="number" required />
              </div>
              <div class="form-group">
                <label>Khuyến mãi(%) (nếu có):</label>
                <input v-model="editedBook.discount_price" type="number" />
              </div>
              <div class="form-group">
                <label>Số lượng tồn kho:</label>
                <input
                  v-model="editedBook.stock_quantity"
                  type="number"
                  required
                />
              </div>
              <div class="form-group">
                <label>Loại sách:</label>
                <select v-model="editedBook.book_type_id" required>
                  <option value="" disabled>Chọn loại sách</option>
                  <option
                    v-for="type in bookTypes"
                    :key="type.book_type_id"
                    :value="type.book_type_id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group full-width">
            <label>Mô tả:</label>
            <textarea v-model="editedBook.description" rows="4"></textarea>
          </div>
          <div class="form-group full-width">
            <label>Ảnh hiện tại:</label>
            <div class="book-images">
              <div
                v-for="image in editedBook.images"
                :key="image.image_public_id"
                class="image-container"
              >
                <img
                  :src="image.image_path"
                  alt="Book Image"
                  class="preview-image"
                />
                <button
                  @click="
                    deleteImage(editedBook.book_id, image.image_public_id)
                  "
                  class="delete-image-btn"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit">Cập nhật</button>
            <button @click="cancelEditBook">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Popup Thêm Ảnh -->
    <div v-if="addImagePopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Ảnh cho Sách</h2>
        <form @submit.prevent="saveNewImages">
          <div class="form-group full-width">
            <label>Chọn ảnh:</label>
            <input
              type="file"
              multiple
              @change="handleAddImages"
              accept="image/*"
              ref="imageInput"
            />
            <div class="image-preview" v-if="newImages.length > 0">
              <img
                v-for="(image, index) in newImages"
                :key="index"
                :src="getImageUrl(image)"
                alt="Preview"
                class="preview-image"
              />
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="cancelAddImage">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, onUnmounted } from "vue";
import {
  apiGetAllBooks,
  apiAddBook,
  apiEditBook,
  apiDeleteBook,
  apiDeleteImageBook,
  apiAddBookImages,
} from "@/services/admin/BookService";
import { apiGetAllBookTypes } from "@/services/admin/TagBooksService";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  name: "BooksAdmin",
  setup() {
    const books = ref([]);
    const bookTypes = ref([]);
    const searchQuery = ref("");
    const sortKey = ref("");
    const sortOrder = ref("asc");
    const showAddBookPopup = ref(false);
    const showEditBookPopup = ref(false);
    const addImagePopup = ref(false);
    const selectedBookId = ref(null);
    const newImages = ref([]);
    const imagePreviews = ref([]);

    const newBook = ref({
      title: "",
      author: "",
      publisher: "",
      published_date: "",
      price: 0,
      discount_price: null,
      stock_quantity: 0,
      description: null,
      book_type_id: "",
      images: [],
      imagePreviews: [],
    });
    const editedBook = ref({});
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const errorMessage = ref("");

    const fetchBookTypes = async () => {
      try {
        const response = await apiGetAllBookTypes();
        if (response.data && response.data.err === 0) {
          bookTypes.value = response.data.data;
        } else {
          console.warn("Dữ liệu không đúng định dạng:", response.data);
          bookTypes.value = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách loại sách:", error);
        bookTypes.value = [];
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await apiGetAllBooks();
        if (response.data && Array.isArray(response.data.data)) {
          books.value = response.data.data;
        } else {
          console.warn("Dữ liệu không phải mảng:", response.data);
          books.value = [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sách:", error);
        books.value = [];
      }
    };

    const handleNewImages = (event) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      newBook.value.images = files.filter((file) => file instanceof File);
      newBook.value.imagePreviews = newBook.value.images
        .map((file) => (file ? URL.createObjectURL(file) : null))
        .filter(Boolean);
    };

    const handleAddImages = (event) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      newImages.value = files.filter((file) => file instanceof File);
      imagePreviews.value = newImages.value
        .map((file) => (file ? URL.createObjectURL(file) : null))
        .filter(Boolean);
    };

    const getImageUrl = (image) => {
      return image instanceof File ? URL.createObjectURL(image) : "";
    };

    const addBook = async () => {
      try {
        const formData = new FormData();
        formData.append("title", newBook.value.title);
        formData.append("author", newBook.value.author);
        formData.append("publisher", newBook.value.publisher);
        formData.append("published_date", newBook.value.published_date);
        formData.append("price", newBook.value.price);
        if (newBook.value.discount_price)
          formData.append("discount_price", newBook.value.discount_price);
        formData.append("stock_quantity", newBook.value.stock_quantity);
        if (newBook.value.description)
          formData.append("description", newBook.value.description);
        formData.append("book_type_id", newBook.value.book_type_id);

        if (newBook.value.images.length > 0) {
          newBook.value.images.forEach((file) => {
            formData.append("images", file);
          });
        }

        const response = await apiAddBook(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.err === 0) {
          await fetchBooks();
          resetNewBook();
          showAddBookPopup.value = false;
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Sách đã được thêm thành công.",
            timer: 2000,
            showConfirmButton: false,
          });
          errorMessage.value = "";
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: response.data.msg || "Lỗi không xác định từ server!",
          });
          errorMessage.value =
            response.data.msg || "Lỗi không xác định từ server!";
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: error.response?.data?.msg || "Đã xảy ra lỗi khi thêm sách!",
        });
        errorMessage.value =
          error.response?.data?.msg || "Đã xảy ra lỗi khi thêm sách!";
        console.error("Lỗi khi thêm sách:", error);
      }
    };

    const editBook = (book_id) => {
      const book = books.value.find((b) => b.book_id === book_id);
      editedBook.value = {
        ...book,
        published_date: book.published_date.split("T")[0],
      };
      showEditBookPopup.value = true;
    };

    const updateBook = async () => {
      try {
        const formData = new FormData();
        formData.append("book_id", editedBook.value.book_id);
        formData.append("title", editedBook.value.title);
        formData.append("author", editedBook.value.author);
        formData.append("publisher", editedBook.value.publisher);
        formData.append("published_date", editedBook.value.published_date);
        formData.append("price", editedBook.value.price);
        if (editedBook.value.discount_price)
          formData.append("discount_price", editedBook.value.discount_price);
        formData.append("stock_quantity", editedBook.value.stock_quantity);
        if (editedBook.value.description)
          formData.append("description", editedBook.value.description);
        formData.append("book_type_id", editedBook.value.book_type_id);

        const response = await apiEditBook(formData);
        if (response.data && response.data.err === 0) {
          await fetchBooks();
          showEditBookPopup.value = false;
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Sách đã được cập nhật thành công.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi cập nhật sách!",
        });
        console.error("Lỗi khi cập nhật sách:", error);
      }
    };

    const deleteBook = async (book_id) => {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn sẽ không thể khôi phục lại sách này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const payload = { book_id };
            const response = await apiDeleteBook(payload);
            if (response.data && response.data.err === 0) {
              await fetchBooks();
              Swal.fire("Đã xóa!", "Sách đã được xóa thành công.", "success");
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Lỗi!",
              text: "Đã xảy ra lỗi khi xóa sách!",
            });
            console.error("Lỗi khi xóa sách:", error);
          }
        }
      });
    };

    const deleteImage = async (bookId, imageId) => {
      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn có muốn xóa ảnh này không?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await apiDeleteImageBook({
              book_id: bookId,
              image_public_id: imageId,
            });
            if (response.data && response.data.err === 0) {
              await fetchBooks();
              if (showEditBookPopup.value) {
                editedBook.value.images = editedBook.value.images.filter(
                  (img) => img.image_public_id !== imageId
                );
              }
              Swal.fire("Đã xóa!", "Ảnh đã được xóa thành công.", "success");
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Lỗi!",
              text: "Đã xảy ra lỗi khi xóa ảnh!",
            });
            console.error("Lỗi khi xóa ảnh:", error);
          }
        }
      });
    };

    const addImage = (bookId) => {
      selectedBookId.value = bookId;
      newImages.value = [];
      imagePreviews.value = [];
      addImagePopup.value = true;
    };

    const saveNewImages = async () => {
      try {
        const formData = new FormData();
        formData.append("book_id", selectedBookId.value);
        newImages.value.forEach((file) => {
          if (file instanceof File) {
            formData.append("images", file);
          }
        });

        const response = await apiAddBookImages(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.err === 0) {
          await fetchBooks();
          addImagePopup.value = false;
          newImages.value = [];
          imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
          imagePreviews.value = [];
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Ảnh đã được thêm thành công.",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi thêm ảnh!",
        });
        console.error("Lỗi khi thêm ảnh:", error);
      }
    };

    const resetNewBook = () => {
      newBook.value.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      newBook.value = {
        title: "",
        author: "",
        publisher: "",
        published_date: "",
        price: 0,
        discount_price: null,
        stock_quantity: 0,
        description: null,
        book_type_id: "",
        images: [],
        imagePreviews: [],
      };
    };

    const cancelAddBook = () => {
      resetNewBook();
      showAddBookPopup.value = false;
      errorMessage.value = "";
    };

    const cancelEditBook = () => {
      editedBook.value = {};
      showEditBookPopup.value = false;
    };

    const cancelAddImage = () => {
      imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
      newImages.value = [];
      imagePreviews.value = [];
      addImagePopup.value = false;
    };

    const filteredAndSortedBooks = computed(() => {
      let result = [...books.value];
      if (searchQuery.value) {
        result = result.filter((book) =>
          book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      if (sortKey.value) {
        result.sort((a, b) => {
          const valueA = a[sortKey.value] || 0;
          const valueB = b[sortKey.value] || 0;
          if (sortOrder.value === "asc") {
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
      return Math.ceil(books.value.length / itemsPerPage.value);
    });

    const sort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortKey.value = key;
        sortOrder.value = "asc";
      }
    };

    const getSortIcon = (key) => {
      if (sortKey.value === key) {
        return sortOrder.value === "asc"
          ? "fas fa-sort-up"
          : "fas fa-sort-down";
      }
      return "fas fa-sort";
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

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    onMounted(() => {
      fetchBooks();
      fetchBookTypes();
    });

    onUnmounted(() => {
      newBook.value.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
    });

    return {
      books,
      bookTypes,
      searchQuery,
      showAddBookPopup,
      showEditBookPopup,
      addImagePopup,
      newBook,
      editedBook,
      newImages,
      editBook,
      deleteBook,
      addBook,
      updateBook,
      handleNewImages,
      handleAddImages,
      addImage,
      deleteImage,
      saveNewImages,
      filteredAndSortedBooks,
      sort,
      getSortIcon,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      formatPrice,
      cancelAddBook,
      cancelEditBook,
      cancelAddImage,
      getImageUrl,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.admin-books {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-books h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.book-actions {
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

.book-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.book-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.book-table th,
.book-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

.book-table th {
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.book-table th i {
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
}

.book-table td {
  background-color: #ffffff;
}

.book-table button.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
}

.book-table button.action-btn:hover {
  opacity: 0.8;
}

.book-table .edit-btn i {
  color: #007bff;
  font-size: 16px;
}

.book-table .delete-btn i {
  color: #dc3545;
  font-size: 16px;
}

.book-table .add-image-btn i {
  color: #28a745;
  font-size: 16px;
}

.book-images,
.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.book-image,
.preview-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.delete-image-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  line-height: 16px;
  padding: 0;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.delete-image-btn:hover {
  opacity: 1;
}

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
  width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
}

.modal-content h2 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: center;
}

.form-columns {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-column {
  flex: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-group.full-width {
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.form-group textarea {
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
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