<template>
  <div class="admin-banner">
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
            <th @click="sort('id')">
              ID Banner <i :class="getSortIcon('id')"></i>
            </th>
            <th>Hình ảnh</th>
            <th @click="sort('name')">
              Tên Banner <i :class="getSortIcon('name')"></i>
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(banner, index) in filteredBanners"
            :key="banner.banner_id"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <img
                :src="banner.banner_path"
                alt="Banner Image"
                class="banner-image"
              />
            </td>
            <td>{{ banner.banner_name }}</td>
            <td>
              <button
                @click="deleteBanner(banner.banner_id, banner.banner_public_id)"
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
          {{ filteredBanners.length }} kết quả</span
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
              <img
                :src="bannerForm.imagePreview"
                alt="Preview"
                class="preview-image"
              />
            </p>
          </div>
          <div class="modal-actions">
            <button type="submit">Lưu</button>
            <button @click="closeModal">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2"; // Import SweetAlert2
import {
  apiGetAllBanners,
  apiAddBanner,
  apiDeleteBanner,
} from "@/services/admin/BannerService";

export default {
  name: "BannersAdmin",
  setup() {
    const banners = ref([]);
    const searchQuery = ref("");
    const showAddBannerPopup = ref(false);
    const bannerForm = ref({ name: "", image: null, imagePreview: "" });
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const sortKey = ref("");
    const sortOrder = ref("asc");

    const fetchBanners = async () => {
      try {
        const response = await apiGetAllBanners();
        if (response.data.err === 0) {
          banners.value = response.data.data || [];
        } else {
          console.error("Lỗi khi lấy danh sách banner:", response.data.msg);
          banners.value = [];
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể tải danh sách banner: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Lỗi khi gọi API lấy banner:", error);
        banners.value = [];
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi tải danh sách banner!",
        });
      }
    };

    const saveBanner = async () => {
      try {
        const formData = new FormData();
        formData.append("banner_name", bannerForm.value.name);
        if (bannerForm.value.image) {
          formData.append("banner", bannerForm.value.image);
        }

        const response = await apiAddBanner(formData);
        if (response.data.err === 0) {
          const newBanner = {
            banner_id: response.data.data.banner_id,
            banner_name:
              response.data.data.banner_name || bannerForm.value.name,
            banner_path:
              response.data.data.banner_path || bannerForm.value.imagePreview,
            banner_public_id: response.data.data.banner_public_id,
          };
          banners.value.push(newBanner);
          closeModal();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thêm banner thành công!",
            timer: 2000,
            showConfirmButton: false,
          });
          await fetchBanners();
        } else {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: "Thêm banner thất bại: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Lỗi khi thêm banner:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi thêm banner!",
        });
      }
    };

    const deleteBanner = async (banner_id, banner_public_id) => {
      if (!banner_id || !banner_public_id) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể xóa banner do thiếu thông tin banner_id hoặc banner_public_id!",
        });
        return;
      }

      Swal.fire({
        title: "Bạn có chắc không?",
        text: "Bạn có chắc muốn xóa banner này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Có, xóa nó!",
        cancelButtonText: "Hủy",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const payload = {
              banner_id: banner_id,
              banner_public_id: banner_public_id,
            };
            const response = await apiDeleteBanner(payload);
            if (response.data.err === 0) {
              banners.value = banners.value.filter(
                (b) => b.banner_id !== banner_id
              );
              Swal.fire({
                icon: "success",
                title: "Đã xóa",
                text: "Xóa banner thành công!",
                timer: 2000,
                showConfirmButton: false,
              });
              await fetchBanners();
            } else {
              Swal.fire({
                icon: "error",
                title: "Thất bại",
                text: "Xóa banner thất bại: " + response.data.msg,
              });
            }
          } catch (error) {
            console.error("Lỗi khi xóa banner:", error);
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: "Có lỗi xảy ra khi xóa banner!",
            });
          }
        }
      });
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

    const sort = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortKey.value = key;
        sortOrder.value = "asc";
      }
    };

    const getSortIcon = (key) => {
      if (sortKey.value !== key) return "fas fa-sort";
      return sortOrder.value === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
    };

    const filteredBanners = computed(() => {
      let result = [...banners.value];

      // Lọc theo tìm kiếm
      if (searchQuery.value) {
        result = result.filter((banner) =>
          banner.banner_name
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase())
        );
      }

      // Sắp xếp
      if (sortKey.value) {
        result.sort((a, b) => {
          if (sortKey.value === "id") {
            const comparison = a.banner_id - b.banner_id;
            return sortOrder.value === "asc" ? comparison : -comparison;
          } else if (sortKey.value === "name") {
            const nameA = a.banner_name.toLowerCase();
            const nameB = b.banner_name.toLowerCase();
            return sortOrder.value === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          }
          return 0;
        });
      }

      // Phân trang
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return result.slice(start, end);
    });

    const totalPages = computed(() => {
      const filteredCount = banners.value.filter((banner) =>
        banner.banner_name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      ).length;
      return Math.max(1, Math.ceil(filteredCount / itemsPerPage.value));
    });

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const closeModal = () => {
      showAddBannerPopup.value = false;
      bannerForm.value = { name: "", image: null, imagePreview: "" };
    };

    onMounted(fetchBanners);

    return {
      banners,
      searchQuery,
      showAddBannerPopup,
      bannerForm,
      saveBanner,
      deleteBanner,
      handleImageUpload,
      filteredBanners,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      closeModal,
      itemsPerPage,
      sort,
      getSortIcon,
    };
  },
};
</script>

<style scoped>
/* General Dashboard Styling */
.admin-banner {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.admin-banner h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* Banner Actions (Search and Add Button) */
.banner-actions {
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

/* Banner Table Styling */
.banner-table {
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.banner-table th i {
  margin-left: 5px;
  color: #6c757d;
  cursor: pointer;
}

.banner-table td {
  background-color: #ffffff;
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