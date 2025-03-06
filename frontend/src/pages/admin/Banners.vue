<template>
  <div class="dashboard">
    <h1>Quản lý Banner</h1>
    <!-- Nút thêm banner và bảng danh sách -->
    <div class="banner-actions">
      <button @click="showAddBannerPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Banner
      </button>
    </div>
    <div class="banner-table">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(banner, index) in filteredBanners" :key="banner.id">
            <td><input type="checkbox" v-model="selectedBanners" :value="banner.id" /></td>
            <td>{{ index + 1 }}</td>
            <td>
              <img :src="banner.image" alt="Banner Image" class="banner-image" />
            </td>
            <td>{{ banner.name }}</td>
            <td>
              <button @click="editBanner(banner.id)" class="action-btn edit-btn">
                <i class="fas fa-pencil-alt"></i>
              </button>
              <button @click="deleteBanner(banner.id)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Thêm/Sửa Banner -->
    <div v-if="showAddBannerPopup" class="modal">
      <div class="modal-content">
        <h2>{{ editingBanner ? 'Sửa Banner' : 'Thêm Banner' }}</h2>
        <form @submit.prevent="saveBanner" enctype="multipart/form-data">
          <div class="form-group">
            <label>Tên Banner:</label>
            <input v-model="bannerForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Chọn ảnh:</label>
            <input
              type="file"
              @change="handleImageUpload"
              accept="image/*"
              required
              :disabled="editingBanner && !allowImageChange"
            />
            <p v-if="bannerForm.imagePreview" class="image-preview">
              <img :src="bannerForm.imagePreview" alt="Preview" class="preview-image" />
            </p>
          </div>
          <div class="modal-actions">
            <button type="submit">{{ editingBanner ? 'Cập nhật' : 'Lưu' }}</button>
            <button @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Phân trang (nếu cần) -->
    <div class="pagination" v-if="banners.length > 10">
      <span>Hiển thị trang {{ currentPage }} / {{ totalPages }} - {{ filteredBanners.length }} kết quả</span>
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
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
  name: 'BannersAdmin',
  setup() {
    // Dữ liệu mẫu cho danh sách banner
    const banners = ref([
      { id: 1, name: 'Ưu đãi Tết 2025', image: 'https://via.placeholder.com/150', status: 'active' },
      { id: 2, name: 'Sách Mới', image: 'https://via.placeholder.com/150', status: 'active' },
      { id: 3, name: 'Giảm giá 50%', image: 'https://via.placeholder.com/150', status: 'inactive' },
    ]);

    const searchQuery = ref('');
    const showAddBannerPopup = ref(false);
    const editingBanner = ref(null);
    const bannerForm = ref({ name: '', image: null, imagePreview: '' });
    const selectedBanners = ref([]); // Danh sách ID banner được chọn
    const selectAll = ref(false); // Checkbox chọn tất cả
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const allowImageChange = ref(false); // Cho phép thay đổi ảnh khi sửa

    const fetchBanners = () => {
      // Trong thực tế, gọi API để lấy danh sách banner
      // Ví dụ: await apiGetBanners();
    };

    const saveBanner = () => {
      if (editingBanner.value) {
        // Cập nhật banner
        const index = banners.value.findIndex(b => b.id === editingBanner.value.id);
        if (index !== -1) {
          banners.value[index] = {
            ...editingBanner.value,
            name: bannerForm.value.name,
            image: bannerForm.value.image || editingBanner.value.image, // Giữ ảnh cũ nếu không thay đổi
          };
        }
      } else {
        // Thêm mới banner
        const newBanner = {
          id: Date.now(), // ID tạm thời, trong thực tế dùng API để tạo ID
          name: bannerForm.value.name,
          image: bannerForm.value.imagePreview, // Sử dụng URL preview hoặc đường dẫn ảnh tải lên
          status: 'active',
        };
        banners.value.push(newBanner);
      }
      closeModal();
    };

    const editBanner = (id) => {
      const banner = banners.value.find(b => b.id === id);
      editingBanner.value = { ...banner };
      bannerForm.value = { name: banner.name, image: null, imagePreview: banner.image };
      allowImageChange.value = false; // Mặc định không cho phép thay đổi ảnh khi sửa
      showAddBannerPopup.value = true;
    };

    const deleteBanner = (id) => {
      if (confirm('Bạn có chắc muốn xóa banner này?')) {
        banners.value = banners.value.filter(b => b.id !== id);
        selectedBanners.value = selectedBanners.value.filter(sid => sid !== id);
      }
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedBanners.value = banners.value.map(b => b.id);
      } else {
        selectedBanners.value = [];
      }
    };

    const deleteSelectedBanners = () => {
      if (selectedBanners.value.length && confirm('Bạn có chắc muốn xóa các banner đã chọn?')) {
        banners.value = banners.value.filter(b => !selectedBanners.value.includes(b.id));
        selectedBanners.value = [];
        selectAll.value = false;
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        bannerForm.value.image = file; // Lưu file để upload
        const reader = new FileReader();
        reader.onload = (e) => {
          bannerForm.value.imagePreview = e.target.result; // Hiển thị preview
        };
        reader.readAsDataURL(file);
        allowImageChange.value = true; // Cho phép thay đổi ảnh
      }
    };

    const filteredBanners = computed(() => {
      let result = [...banners.value];
      if (searchQuery.value) {
        result = result.filter(banner =>
          banner.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
      }
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return result.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(banners.value.length / itemsPerPage.value);
    });

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const closeModal = () => {
      showAddBannerPopup.value = false;
      editingBanner.value = null;
      bannerForm.value = { name: '', image: null, imagePreview: '' };
      allowImageChange.value = false;
    };

    onMounted(fetchBanners);

    return {
      banners,
      searchQuery,
      showAddBannerPopup,
      editingBanner,
      bannerForm,
      selectedBanners,
      selectAll,
      saveBanner,
      editBanner,
      deleteBanner,
      toggleSelectAll,
      deleteSelectedBanners,
      handleImageUpload,
      filteredBanners,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      closeModal,
    };
  },
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

.banner-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
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

.banner-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.banner-table table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
}

.banner-table th,
.banner-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #495057;
}

.banner-table th {
  background-color: #f8f9fa;
  color: #343a40;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.banner-table td {
  background-color: #ffffff;
}

.banner-table button.action-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
  border-radius: 3px;
  transition: opacity 0.3s ease;
}

.banner-table button.action-btn:hover {
  opacity: 0.8;
}

.banner-table .edit-btn i {
  color: #007bff;
  font-size: 16px;
}

.banner-table .delete-btn i {
  color: #dc3545;
  font-size: 16px;
}

.banner-image {
  width: 100px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
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
.form-group input[type="file"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
}

.image-preview {
  margin-top: 10px;
}

.preview-image {
  max-width: 200px;
  max-height: 100px;
  object-fit: contain;
  border-radius: 5px;
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
  border-radius: 0 0 5px 5px;
  font-size: 14px;
  color: #495057;
  margin-top: 20px;
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