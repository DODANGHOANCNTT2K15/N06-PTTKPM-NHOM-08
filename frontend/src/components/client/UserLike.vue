<template>
    <div class="profile-info-content">
      <h2>Sản phẩm yêu thích</h2>
      <div class="favorite-table-container">
        <table class="favorite-table">
          <thead>
            <tr>
              <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
              <th>STT</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá tiền</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in paginatedProducts" :key="product.id">
              <td><input type="checkbox" v-model="product.selected" /></td>
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>
                <img :src="product.image" alt="Product Image" class="product-image" />
              </td>
              <td>
                <router-link :to="`/product/${product.id}`" class="product-name">
                  {{ product.name }}
                </router-link>
              </td>
              <td>{{ formatPrice(product.price) }}</td>
              <td>
                <button class="delete-btn" @click="removeProduct(product.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="favoriteProducts.length === 0" class="no-products">
          Bạn chưa có sản phẩm yêu thích nào.
        </p>
  
        <!-- Phân trang -->
        <div class="pagination" v-if="favoriteProducts.length > itemsPerPage">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-btn"
          >
            Trước
          </button>
          <span>Trang {{ currentPage }} / {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="pagination-btn"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    name: 'UserLike',
    setup() {
      // Danh sách sản phẩm yêu thích giả lập
      const favoriteProducts = ref([
        { id: 1, name: 'Sách 1', price: 150000, image: require('@/assets/images/Product_00.png'), selected: false },
        { id: 2, name: 'Sách 2', price: 200000, image: require('@/assets/images/Product_00.png'), selected: false },
        { id: 3, name: 'Sách 3', price: 120000, image: require('@/assets/images/Product_00.png'), selected: false },
        { id: 4, name: 'Sách 4', price: 180000, image: require('@/assets/images/Product_00.png'), selected: false },
        { id: 5, name: 'Sách 5', price: 250000, image: require('@/assets/images/Product_00.png'), selected: false },
        { id: 5, name: 'Sách 5', price: 250000, image: require('@/assets/images/Product_00.png'), selected: false },
      ]);
  
      const selectAll = ref(false);
      const itemsPerPage = ref(5); // Số sản phẩm mỗi trang
      const currentPage = ref(1); // Trang hiện tại
  
      // Tính tổng số trang
      const totalPages = computed(() =>
        Math.ceil(favoriteProducts.value.length / itemsPerPage.value)
      );
  
      // Lấy danh sách sản phẩm cho trang hiện tại
      const paginatedProducts = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return favoriteProducts.value.slice(start, end);
      });
  
      // Format giá tiền
      const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(price);
      };
  
      // Chọn hoặc bỏ chọn tất cả trên trang hiện tại
      const toggleSelectAll = () => {
        paginatedProducts.value.forEach((product) => {
          product.selected = selectAll.value;
        });
      };
  
      // Xóa sản phẩm theo ID
      const removeProduct = (id) => {
        const index = favoriteProducts.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          favoriteProducts.value.splice(index, 1);
          alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
          // Điều chỉnh trang nếu cần
          if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
          }
        }
      };
  
      return {
        favoriteProducts,
        selectAll,
        itemsPerPage,
        currentPage,
        totalPages,
        paginatedProducts,
        formatPrice,
        toggleSelectAll,
        removeProduct,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-info-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .favorite-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .favorite-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  
  .favorite-table th,
  .favorite-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .favorite-table th {
    background-color: #f5f5f5;
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }
  
  .favorite-table td {
    font-size: 14px;
    color: #666;
  }
  
  .favorite-table tr:hover {
    background-color: #f9f9f9;
  }
  
  .product-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .product-name {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .product-name:hover {
    text-decoration: underline;
  }
  
  .delete-btn {
    padding: 6px 12px;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.3s ease;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
  }
  
  .no-products {
    text-align: center;
    font-size: 14px;
    color: #666;
    margin-top: 20px;
  }
  
  /* Phân trang */
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    margin-top: 20px;
  }
  
  .pagination-btn {
    padding: 6px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .pagination-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background-color: #0056b3;
  }
  
  .pagination span {
    font-size: 14px;
    color: #333;
  }
  </style>