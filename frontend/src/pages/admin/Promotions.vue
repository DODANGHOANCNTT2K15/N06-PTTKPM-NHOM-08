<template>
    <div class="promotions-page">
      <h1>Quản lý Khuyến mại</h1>
      <div class="promotion-actions">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên khuyến mại..."
          class="search-input"
        />
        <button @click="showAddPromotionPopup = true" class="add-button">
          <i class="fas fa-plus"></i> Thêm Khuyến mại
        </button>
      </div>
      <div class="promotion-table">
        <table>
          <thead>
            <tr>
              <th @click="sort('id')">
                ID Khuyến mãi <i :class="getSortIcon('id')"></i>
              </th>
              <th @click="sort('name')">
                Tên Khuyến mại <i :class="getSortIcon('name')"></i>
              </th>
              <th @click="sort('discount')">
                Phần trăm giảm <i :class="getSortIcon('discount')"></i>
              </th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="promotion in filteredAndSortedPromotions"
              :key="promotion.discount_id"
            >
              <td>{{ promotion.discount_id }}</td>
              <td>{{ promotion.discount_name }}</td>
              <td>{{ promotion.percent_discount }}%</td>
              <td>
                <button
                  @click="editPromotion(promotion.discount_id)"
                  class="action-btn edit-btn"
                >
                  <i class="fas fa-pencil-alt"></i>
                </button>
                <button
                  @click="deletePromotion(promotion.discount_id)"
                  class="action-btn delete-btn"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <!-- <tr v-if="filteredAndSortedPromotions.length === 0">
              <td colspan="4" style="text-align: center;">
                Không có khuyến mại nào.
              </td>
            </tr> -->
          </tbody>
        </table>
        <div class="pagination">
          <span
            >Hiển thị trang {{ currentPage }} / {{ totalPages }} -
            {{ filteredAndSortedPromotions.length }} kết quả</span
          >
          <div>
            <button
              @click="prevPage"
              :disabled="currentPage === 1 || totalPages === 0"
              class="pagination-btn"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="pagination-btn"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Popup Thêm Khuyến mại -->
      <div v-if="showAddPromotionPopup" class="modal">
        <div class="modal-content">
          <h2>{{ editingPromotion ? "Sửa Khuyến mại" : "Thêm Khuyến mại" }}</h2>
          <form @submit.prevent="savePromotion">
            <div class="form-group">
              <label>Tên Khuyến mại:</label>
              <input v-model="promotionForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Phần trăm giảm (%):</label>
              <input
                v-model.number="promotionForm.discount"
                type="number"
                min="1"
                max="100"
                required
              />
            </div>
            <div class="modal-actions">
              <button type="submit">
                {{ editingPromotion ? "Cập nhật" : "Lưu" }}
              </button>
              <button @click="showAddPromotionPopup = false">Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed, watch } from "vue";
  import {
    apiAddDiscount,
    apiEditDiscount,
    apiGetAllDiscounts,
    apiDeleteDiscount,
  } from "@/services/admin/DiscountService";
  
  export default {
    name: "PromotionsPage",
    setup() {
      const promotions = ref([]);
      const searchQuery = ref("");
      const sortKey = ref("");
      const sortOrder = ref("asc");
      const showAddPromotionPopup = ref(false);
      const editingPromotion = ref(null);
      const promotionForm = ref({ name: "", discount: 0 });
      const currentPage = ref(1);
      const itemsPerPage = ref(10);
      const errorMessage = ref(""); // Để hiển thị lỗi nếu có
  
      // Hàm gọi API để lấy danh sách khuyến mại
      const fetchPromotions = async () => {
        try {
          const response = await apiGetAllDiscounts(); // Gọi endpoint getAllDiscountsController
          if (response.status === 200 && response.data.err === 0) {
            promotions.value = response.data.data.map((item) => ({
              discount_id: item.discount_id,
              discount_name: item.discount_name,
              percent_discount: item.percent_discount,
            }));
            // Nếu không có dữ liệu, đặt lại currentPage về 1
            if (promotions.value.length === 0) {
              currentPage.value = 1;
            }
          } else {
            errorMessage.value = response.data.msg;
            promotions.value = []; // Đặt lại danh sách nếu có lỗi
            currentPage.value = 1;
          }
        } catch (error) {
          errorMessage.value = "Lỗi khi lấy danh sách khuyến mại!";
          console.error(error);
          promotions.value = []; // Đặt lại danh sách nếu có lỗi
          currentPage.value = 1;
        }
      };
  
      // Lưu hoặc cập nhật khuyến mại
      const savePromotion = async () => {
        const payload = {
          discount_name: promotionForm.value.name,
          percent_discount: promotionForm.value.discount,
        };
  
        try {
          let response;
          if (editingPromotion.value) {
            // Cập nhật
            response = await apiEditDiscount({
              ...payload,
              discount_id: editingPromotion.value.discount_id,
            }); // Gọi updateDiscountController
          } else {
            // Thêm mới
            response = await apiAddDiscount(payload); // Gọi addDiscountController
          }
  
          if (response.data.err === 0) {
            await fetchPromotions(); // Cập nhật lại danh sách
            showAddPromotionPopup.value = false;
            promotionForm.value = { name: "", discount: 0 };
            editingPromotion.value = null;
          } else {
            errorMessage.value = response.data.msg;
          }
        } catch (error) {
          errorMessage.value = "Lỗi khi lưu khuyến mại!";
          console.error(error);
        }
      };
  
      // Chỉnh sửa khuyến mại
      const editPromotion = (id) => {
        const promotion = promotions.value.find((p) => p.discount_id === id);
        editingPromotion.value = { ...promotion };
        promotionForm.value = {
          name: promotion.discount_name,
          discount: promotion.percent_discount,
        };
        showAddPromotionPopup.value = true;
      };
  
      // Xóa khuyến mại
      const deletePromotion = async (id) => {
        if (confirm("Bạn có chắc muốn xóa khuyến mại này?")) {
          try {
            const response = await apiDeleteDiscount({ discount_id: id }); // Gọi deleteDiscountController
            if (response.data.err === 0) {
              await fetchPromotions();
              // Kiểm tra nếu không còn dữ liệu trên trang hiện tại, giảm currentPage
              if (filteredAndSortedPromotions.value.length === 0 && currentPage.value > 1) {
                currentPage.value--;
              }
            } else {
              errorMessage.value = response.data.msg;
            }
          } catch (error) {
            errorMessage.value = "Lỗi khi xóa khuyến mại!";
            console.error(error);
          }
        }
      };
  
      // Lọc và sắp xếp
      const filteredAndSortedPromotions = computed(() => {
        let result = [...promotions.value];
  
        if (searchQuery.value) {
          result = result.filter((promotion) =>
            promotion.discount_name
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
          );
        }
  
        if (sortKey.value) {
          result.sort((a, b) => {
            const valueA =
              a[sortKey.value === "discount" ? "percent_discount" : sortKey.value];
            const valueB =
              b[sortKey.value === "discount" ? "percent_discount" : sortKey.value];
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
        const total = Math.ceil(promotions.value.length / itemsPerPage.value);
        return total > 0 ? total : 1; // Đảm bảo totalPages không bao giờ là 0
      });
  
      // Theo dõi promotions để điều chỉnh currentPage nếu cần
      watch(promotions, () => {
        if (promotions.value.length === 0) {
          currentPage.value = 1;
        } else if (currentPage.value > totalPages.value) {
          currentPage.value = totalPages.value;
        }
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
          return sortOrder.value === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
        }
        return "fas fa-sort";
      };
  
      const prevPage = () => {
        if (currentPage.value > 1) currentPage.value--;
      };
  
      const nextPage = () => {
        if (currentPage.value < totalPages.value) currentPage.value++;
      };
  
      onMounted(fetchPromotions);
  
      return {
        promotions,
        searchQuery,
        showAddPromotionPopup,
        editingPromotion,
        promotionForm,
        savePromotion,
        editPromotion,
        deletePromotion,
        filteredAndSortedPromotions,
        sort,
        getSortIcon,
        currentPage,
        totalPages,
        prevPage,
        nextPage,
        errorMessage,
      };
    },
  };
  </script>
  
  <style scoped>
  .promotions-page {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .promotions-page h1 {
    font-size: 24px;
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .promotion-actions {
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
  
  .promotion-table {
    overflow-x: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .promotion-table table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  
  .promotion-table th,
  .promotion-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
    font-size: 14px;
    color: #495057;
  }
  
  .promotion-table th {
    background-color: #f8f9fa;
    color: #343a40;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  
  .promotion-table th i {
    margin-left: 5px;
    color: #6c757d;
    cursor: pointer;
  }
  
  .promotion-table td {
    background-color: #ffffff;
  }
  
  .promotion-table button.action-btn {
    border: none;
    background: none;
    cursor: pointer;
    padding: 5px;
    margin-right: 5px;
    border-radius: 3px;
    transition: opacity 0.3s ease;
  }
  
  .promotion-table button.action-btn:hover {
    opacity: 0.8;
  }
  
  .promotion-table .edit-btn i {
    color: #007bff;
    font-size: 16px;
  }
  
  .promotion-table .delete-btn i {
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
  
  .form-group input {
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