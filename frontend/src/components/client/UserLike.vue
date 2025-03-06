<template>
  <div class="profile-info-content">
    <h2>Sản phẩm yêu thích</h2>
    <div class="favorite-table-container">
      <table class="favorite-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in paginatedProducts" :key="product.favorite_id">
            <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td>
              <router-link :to="`/product/${product.book_id}`">
                <img
                  :src="product.book && product.book.images && product.book.images[0] ? product.book.images[0].image_path : 'https://via.placeholder.com/50'"
                  alt="Product Image"
                  class="product-image"
                />
              </router-link>
            </td>
            <td>
              <router-link :to="`/product/${product.book_id}`" class="product-name">
                {{ product.book ? product.book.title : 'Không có tiêu đề' }}
              </router-link>
            </td>
            <td>{{ formatPrice(product.book ? product.book.price : 0) }}</td>
            <td>
              <button class="delete-btn" @click="removeProduct(product.favorite_id)">Xóa</button>
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
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { apiGetFavorites, apiDeleteFavorite } from '@/services/client/FavoriteService';

export default {
  name: 'UserLike',
  setup() {
    const router = useRouter();
    const favoriteProducts = ref([]);
    const itemsPerPage = ref(5);
    const currentPage = ref(1);

    // Hàm lấy userId từ token
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token trong localStorage");
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.user_id || payload.id;
      } catch (error) {
        console.log("Lỗi khi giải mã token:", error);
        return null;
      }
    };

    // Lấy danh sách sản phẩm yêu thích từ API
    const fetchFavoriteProducts = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Vui lòng đăng nhập để xem danh sách yêu thích!");
        router.push("/login");
        return;
      }

      try {
        const response = await apiGetFavorites({ user_id: userId });
        console.log("API Response:", response); // Debug dữ liệu trả về
        if (response.status === 200 && response.data.err === 0) {
          favoriteProducts.value = response.data.data;
        } else {
          console.error("Lỗi từ API:", response.data.msg);
          favoriteProducts.value = [];
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu thích:', error);
        favoriteProducts.value = [];
      }
    };

    // Xóa sản phẩm yêu thích
    const removeProduct = async (favoriteId) => {
      const userId = getUserIdFromToken();
      if (!userId) {
        alert("Vui lòng đăng nhập để xóa sản phẩm yêu thích!");
        router.push("/login");
        return;
      }

      try {
        const response = await apiDeleteFavorite({ favorite_id: favoriteId });
        if (response.status === 200 && response.data.err === 0) {
          favoriteProducts.value = favoriteProducts.value.filter(p => p.favorite_id !== favoriteId);
          alert('Đã xóa sản phẩm khỏi danh sách yêu thích!');
          if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
            currentPage.value--;
          }
        } else {
          alert(response.data.msg || 'Lỗi khi xóa sản phẩm');
        }
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    };

    // Format giá tiền
    const formatPrice = (price) => {
      return price ? Math.round(price).toLocaleString("vi-VN") + " VNĐ" : "N/A";
    };

    onMounted(() => {
      fetchFavoriteProducts();
    });

    // Tính tổng số trang
    const totalPages = computed(() =>
      Math.ceil(favoriteProducts.value.length / itemsPerPage.value)
    );

    // Lấy danh sách sản phẩm theo trang hiện tại
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      return favoriteProducts.value.slice(start, start + itemsPerPage.value);
    });

    return {
      favoriteProducts,
      itemsPerPage,
      currentPage,
      totalPages,
      paginatedProducts,
      fetchFavoriteProducts,
      removeProduct,
      formatPrice,
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
  cursor: pointer; /* Thêm con trỏ tay khi hover vào ảnh */
  transition: transform 0.2s; /* Hiệu ứng phóng to khi hover */
}

.product-image:hover {
  transform: scale(1.1); /* Phóng to ảnh khi hover */
}

.product-name {
  color: #2c3e50; /* Đổi màu chữ thành xanh đậm */
  text-decoration: none;
  font-weight: 600; /* Đậm hơn một chút */
  font-family: 'Arial', sans-serif; /* Thay đổi kiểu chữ */
  font-size: 15px; /* Tăng kích thước chữ một chút */
  transition: color 0.3s ease; /* Hiệu ứng chuyển màu mượt mà */
}

.product-name:hover {
  color: #e74c3c; /* Đổi màu khi hover thành đỏ nhạt */
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