<template>
  <div class="product-detail-container">
    <div class="product-header">
      <nav class="nav-tabs">
        <a href="#">Trang chủ</a> > <a href="#">Sách tiếng Việt</a> > <a href="#">Truyện tranh</a> > 
        <span>{{ product.name }}</span>
      </nav>
    </div>

    <div class="product-content">
      <div class="product-left">
        <div class="product-image">
          <img :src="product.mainImage || require(`@/assets/images/default-product.png`)" alt="Product Image" />
        </div>
        <div class="thumbnail-slider" v-if="product.thumbnails && product.thumbnails.length">
          <button class="arrow-left" @click="prevThumbnail">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="thumbnail-container">
            <img
              v-for="(thumbnail, index) in product.thumbnails"
              :key="index"
              :src="thumbnail || require(`@/assets/images/default-thumbnail.png`)"
              :alt="`Thumbnail ${index + 1}`"
              :class="{ 'active': index === currentThumbnail }"
              @click="selectThumbnail(index)"
            />
          </div>
          <button class="arrow-right" @click="nextThumbnail">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="highlight-section">
          <h3>Đặc điểm nổi bật</h3>
          <ul>
            <li v-for="highlight in product.highlights" :key="highlight">{{ highlight }}</li>
          </ul>
        </div>
      </div>
      
      <div class="product-right">
        <h1>{{ product.name }}</h1>
        <div class="rating">
          <span>★★★★★</span> ({{ product.ratingCount || 0 }}) | Đã bán {{ product.soldCount || 0 }}+
        </div>
        <div class="price">
          <span class="current-price">{{ product.currentPrice || '0 VNĐ' }} VNĐ</span>
          <span class="original-price" v-if="product.originalPrice">~{{ product.originalPrice || '0 VNĐ' }} VNĐ</span>
        </div>

        <div class="quantity">
          <label>Số lượng</label>
          <input type="number" min="1" v-model="quantity" />
        </div>

        <div class="actions">
          <button class="buy-now" @click="buyNow">Mua ngay</button>
          <button class="add-to-cart" @click="addToCart">Thêm vào giỏ</button>
          <button class="favorite-button" @click="toggleFavorite">
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
        </div>

        <div class="shipping-info">
          <p><i class="fas fa-map-marker-alt"></i> {{ product.shippingLocation || 'Hoàn Kiếm, Hà Đông, Hà Nội' }}</p>
          <p><i class="fas fa-truck"></i> {{ product.shippingFee || 'Giao phí chỉ từ 10k cho đơn từ 45k, 25k cho đơn từ 100k' }}</p>
        </div>

        <div class="product-details">
          <h2>Thông tin sản phẩm</h2>
          <table>
            <tbody>
              <tr v-for="[key, value] in Object.entries(product.details || {})" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="description">
          <h2>Mô tả sản phẩm</h2>
          <p>{{ product.description }}</p>
          <button class="read-more" @click="toggleDescription">Xem thêm</button>
        </div>
      </div>
    </div>

    <div class="customer-reviews">
      <h2>Khách hàng đánh giá</h2>
      <div class="review-list">
        <ReviewItem
          v-for="review in paginatedReviews"
          :key="review.id"
          :user-name="review.userName"
          :purchase-time="review.purchaseTime"
          :rating="review.rating"
          :review-text="review.reviewText"
        />
      </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
          <button @click="currentPage = page">{{ page }}</button>
        </span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
      </div>
      <!-- Form đánh giá cho người dùng -->
      <div class="user-review-form">
        <h3>Thêm đánh giá của bạn</h3>
        <div class="rating-input">
          <label>Đánh giá (1-5 sao):</label>
          <select v-model="newReview.rating">
            <option value="1">1 sao</option>
            <option value="2">2 sao</option>
            <option value="3">3 sao</option>
            <option value="4">4 sao</option>
            <option value="5">5 sao</option>
          </select>
        </div>
        <div class="comment-input">
          <label>Bình luận:</label>
          <textarea v-model="newReview.reviewText" placeholder="Viết đánh giá của bạn..." rows="4"></textarea>
        </div>
        <button @click="submitReview" class="submit-review">Gửi đánh giá</button>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewItem from '@/components/client/ReviewItem.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Import Vue Router
import { apiGetProductDetail, apiAddReview } from '@/services/productService'; // Assume this is your API service

export default {
  name: "ProductPage",
  components: { ReviewItem },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const product = ref({});
    const quantity = ref(1);
    const isFavorite = ref(false);
    const currentThumbnail = ref(0);
    const reviews = ref([]);
    const newReview = ref({
      rating: 1,
      reviewText: '',
    });
    const itemsPerPage = ref(2);
    const currentPage = ref(1);
    const isDescriptionExpanded = ref(false);

    const fetchProductDetail = async () => {
      try {
        const productId = route.params.id; // Assuming the product ID is passed as a route parameter
        const response = await apiGetProductDetail(productId);
        product.value = response.data.data || {};
        if (product.value.thumbnails && product.value.thumbnails.length) {
          product.value.mainImage = product.value.thumbnails[0]; // Set default main image
        }
        // Fetch reviews for this product (you might need a separate API call or include reviews in the product detail response)
        reviews.value = product.value.reviews || [];
      } catch (error) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', error);
      }
    };

    const buyNow = () => {
      console.log('Mua ngay:', quantity.value);
      // Thêm logic mua hàng tại đây (e.g., redirect to checkout or call API)
    };

    const addToCart = () => {
      console.log('Thêm vào giỏ:', quantity.value);
      // Thêm logic thêm vào giỏ hàng tại đây (e.g., call API or use store)
    };

    const submitReview = async () => {
      if (newReview.value.reviewText.trim() && newReview.value.rating) {
        try {
          const productId = route.params.id;
          const reviewData = {
            productId,
            rating: newReview.value.rating,
            reviewText: newReview.value.reviewText,
          };
          const response = await apiAddReview(reviewData);
          if (response.data) {
            reviews.value.push({
              id: reviews.value.length + 1,
              userName: 'Người dùng (giả lập)', // Replace with actual user data or API response
              purchaseTime: 'Vừa đánh giá',
              rating: newReview.value.rating,
              reviewText: newReview.value.reviewText,
            });
            newReview.value.reviewText = '';
            newReview.value.rating = 1;
            currentPage.value = Math.ceil(reviews.value.length / itemsPerPage.value);
            console.log('Đánh giá mới đã được gửi:', reviews.value);
          }
        } catch (error) {
          console.error('Lỗi khi gửi đánh giá:', error);
        }
      } else {
        alert('Vui lòng nhập đánh giá và bình luận!');
      }
    };

    const toggleFavorite = () => {
      isFavorite.value = !isFavorite.value;
      console.log('Sản phẩm đã được ' + (isFavorite.value ? 'thêm vào' : 'bỏ khỏi') + ' yêu thích');
      // Thêm logic lưu vào store/API tại đây (e.g., Pinia/Vuex hoặc API call)
    };

    const selectThumbnail = (index) => {
      currentThumbnail.value = index;
      product.value.mainImage = product.value.thumbnails[index];
    };

    const prevThumbnail = () => {
      currentThumbnail.value = (currentThumbnail.value - 1 + (product.value.thumbnails?.length || 0)) % (product.value.thumbnails?.length || 0);
      product.value.mainImage = product.value.thumbnails[currentThumbnail.value];
    };

    const nextThumbnail = () => {
      currentThumbnail.value = (currentThumbnail.value + 1) % (product.value.thumbnails?.length || 0);
      product.value.mainImage = product.value.thumbnails[currentThumbnail.value];
    };

    const toggleDescription = () => {
      isDescriptionExpanded.value = !isDescriptionExpanded.value;
    };

    const paginatedReviews = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return reviews.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(reviews.value.length / itemsPerPage.value);
    });

    onMounted(() => {
      fetchProductDetail();
    });

    return {
      product,
      quantity,
      isFavorite,
      currentThumbnail,
      reviews,
      newReview,
      itemsPerPage,
      currentPage,
      isDescriptionExpanded,
      paginatedReviews,
      totalPages,
      buyNow,
      addToCart,
      submitReview,
      toggleFavorite,
      selectThumbnail,
      prevThumbnail,
      nextThumbnail,
      toggleDescription,
    };
  },
};
</script>

<style scoped>
/* Giữ nguyên các import CSS global */
@import "@/assets/css/ProductDetail.css";
@import "@/assets/css/General.css";

/* Thêm style cho form đánh giá */
.customer-reviews {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-list {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
}

.pagination button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  color: #999;
}

.pagination button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pagination .active button {
  background-color: #2c3e50;
  color: white;
  border-color: #2c3e50;
}

.pagination .active button:hover {
  background-color: #34495e;
}

.user-review-form {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.user-review-form h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 15px;
}

.rating-input, .comment-input {
  margin-bottom: 15px;
}

.rating-input label, .comment-input label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #2c3e50;
}

.rating-input select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.comment-input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
}

.submit-review {
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.submit-review:hover {
  background-color: #219653;
}

/* Style cho nút yêu thích và actions */
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buy-now, .add-to-cart, .favorite-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.buy-now {
  background-color: #27ae60;
  color: white;
}

.buy-now:hover {
  background-color: #219653;
}

.add-to-cart {
  background-color: #3498db;
  color: white;
}

.add-to-cart:hover {
  background-color: #2980b9;
}

.favorite-button {
  background: none;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Kích thước nút yêu thích */
  font-size: 16px;
}

.favorite-button i {
  transition: color 0.3s ease;
}

.favorite-button .far.fa-heart {
  color: #e74c3c; /* Màu đỏ nhạt cho icon yêu thích khi chưa chọn */
}

.favorite-button:hover .far.fa-heart {
  color: #c0392b; /* Màu đỏ đậm hơn khi hover trên icon chưa chọn */
}

.favorite-button .fas.fa-heart {
  color: #c0392b; /* Màu đỏ đậm khi đã yêu thích */
}
</style>