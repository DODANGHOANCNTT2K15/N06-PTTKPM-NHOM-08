<template>
  <div class="dashboard">
    <h1>Quản lý Banner</h1>
    <!-- Nút thêm banner và bảng danh sách -->
    <div class="banner-actions">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm theo tên banner..."
        class="search-input"
      />
      <button @click="showAddBannerPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Banner
      </button>
    </div>
    <div class="banner-table">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>ID Banner <i class="fas fa-sort"></i></th>
            <th>Hình ảnh</th>
            <th>Tên Banner <i class="fas fa-sort"></i></th>
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
              <button @click="deleteBanner(banner.id, banner.public_id)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Popup Thêm Banner -->
    <div v-if="showAddBannerPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm Banner</h2>
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
            />
            <p v-if="bannerForm.imagePreview" class="image-preview">
              <img :src="bannerForm.imagePreview" alt="Preview" class="preview-image" />
            </p>
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="pagination" v-if="banners.length > itemsPerPage">
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
import { apiGetAllBanners, apiAddBanner, apiDeleteBanner } from '@/services/admin/BannerService';

export default {
  name: 'BannersAdmin',
  setup() {
    const banners = ref([]);
    const searchQuery = ref('');
    const showAddBannerPopup = ref(false);
    const bannerForm = ref({ name: '', image: null, imagePreview: '' });
    const selectedBanners = ref([]);
    const selectAll = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchBanners = async () => {
      try {
        const response = await apiGetAllBanners();
        if (response.data.err === 0) {
          banners.value = response.data.data || [];
        } else {
          console.error('Lỗi khi lấy danh sách banner:', response.data.msg);
          banners.value = [];
        }
      } catch (error) {
        console.error('Lỗi khi gọi API lấy banner:', error);
        banners.value = [];
      }
    };

    const saveBanner = async () => {
      try {
        const formData = new FormData();
        formData.append('banner_name', bannerForm.value.name);
        if (bannerForm.value.image) {
          formData.append('banner_image', bannerForm.value.image); // Giả định backend xử lý file với key 'banner_image'
        }

        const response = await apiAddBanner(formData);
        if (response.data.err === 0) {
          const newBanner = {
            id: response.data.data.id,
            name: response.data.data.name || bannerForm.value.name,
            image: response.data.data.image || bannerForm.value.imagePreview,
            public_id: response.data.data.public_id, // Lưu public_id để dùng cho xóa
            status: 'active',
          };
          banners.value.push(newBanner);
          closeModal();
          alert('Thêm banner thành công!');
        } else {
          alert('Thêm banner thất bại: ' + response.data.msg);
        }
      } catch (error) {
        console.error('Lỗi khi thêm banner:', error);
        alert('Có lỗi xảy ra khi thêm banner!');
      }
    };

    const deleteBanner = async (id, public_id) => {
      if (confirm('Bạn có chắc muốn xóa banner này?')) {
        try {
          const response = await apiDeleteBanner({ banner_id: id, banner_public_id: public_id });
          if (response.data.err === 0) {
            banners.value = banners.value.filter(b => b.id !== id);
            selectedBanners.value = selectedBanners.value.filter(sid => sid !== id);
            alert('Xóa banner thành công!');
          } else {
            alert('Xóa banner thất bại: ' + response.data.msg);
          }
        } catch (error) {
          console.error('Lỗi khi xóa banner:', error);
          alert('Có lỗi xảy ra khi xóa banner!');
        }
      }
    };

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedBanners.value = filteredBanners.value.map(b => b.id);
      } else {
        selectedBanners.value = [];
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        bannerForm.value.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          bannerForm.value.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
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
      bannerForm.value = { name: '', image: null, imagePreview: '' };
    };

    onMounted(fetchBanners);

    return {
      banners,
      searchQuery,
      showAddBannerPopup,
      bannerForm,
      selectedBanners,
      selectAll,
      saveBanner,
      deleteBanner,
      toggleSelectAll,
      handleImageUpload,
      filteredBanners,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      closeModal,
      itemsPerPage,
    };
  },
};
</script>

<style scoped>
/* General Dashboard Styling */
.dashboard {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.dashboard h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Banner Actions (Search and Add Button) */
.banner-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  width: 300px;
  background-color: #f5f5f5;
  transition: border-color 0.3s ease;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
}

.add-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.add-button i {
  margin-right: 8px;
}

.add-button:hover {
  background-color: #0056b3;
}

/* Banner Table Styling */
.banner-table {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.banner-table table {
  width: 100%;
  border-collapse: collapse;
}

.banner-table th,
.banner-table td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  color: #333;
}

.banner-table th {
  background-color: #fff;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.banner-table th i.fa-sort {
  margin-left: 5px;
  color: #999;
}

.banner-table td {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.banner-table tbody tr:hover {
  background-color: #f9f9f9;
}

.banner-image {
  width: 100px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

/* Action Buttons */
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

.banner-table .delete-btn i {
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
  color: #333;
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
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group input[type="file"] {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
  background-color: #f5f5f5;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
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

/* Modal Actions */
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

/* Pagination */
.pagination {
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 10px 10px;
  font-size: 14px;
  color: #666;
  margin-top: 0;
}

.pagination span {
  font-size: 14px;
}

.pagination-btn {
  padding: 6px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  margin-left: 10px;
  transition: color 0.3s ease;
}

.pagination-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  color: #007bff;
}

.pagination-btn i {
  font-size: 14px;
}
</style>