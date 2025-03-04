<template>
  <div class="product-detail-container">
    <div class="product-header">
      <nav class="nav-tabs">
        <a href="#">Trang chủ</a> > <a href="#">Sách tiếng Việt</a> > <a href="#">Truyện tranh</a> > 
        <span>Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)</span>
      </nav>
    </div>

    <div class="product-content">
      <div class="product-left">
        <div class="product-image">
          <img :src="require(`@/assets/images/${mainImage}`)" alt="Thiên Tài Bên Trái, Kẻ Điên Bên Phải" />
        </div>
        <div class="thumbnail-slider">
          <button class="arrow-left" @click="prevThumbnail">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="thumbnail-container">
            <img
              v-for="(thumbnail, index) in thumbnails"
              :key="index"
              :src="require(`@/assets/images/${thumbnail}`)"
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
            <li>Khám phá những điều thú vị ngay cả khi bạn chưa từng đọc truyện tranh, kể cả bạn đã từng đọc.</li>
            <li>Ngôn ngữ sắc sảo, sâu sắc với văn phong, khai thác sâu những giá trị nhân văn.</li>
            <li>Tạo động lực, giúp bạn tìm thấy chính mình.</li>
          </ul>
        </div>
      </div>
      
      <div class="product-right">
        <h1>Thiên Tài Bên Trái, Kẻ Điên Bên Phải (Tái Bản)</h1>
        <div class="rating">
          <span>★★★★★</span> (5,467) | Đã bán 3,000+
        </div>
        <div class="price">
          <span class="current-price">600,000 VNĐ</span>
          <span class="original-price">~1,000,000 VNĐ</span>
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
          <p><i class="fas fa-map-marker-alt"></i> Hoàn Kiếm, Hà Đông, Hà Nội</p>
          <p><i class="fas fa-truck"></i> Giao phí chỉ từ 10k cho đơn từ 45k, 25k cho đơn từ 100k</p>
        </div>

        <div class="product-details">
          <h2>Thông tin sản phẩm</h2>
          <table>
            <tbody>
              <tr>
                <td>Phiên bản</td>
                <td>Tái bản</td>
              </tr>
              <tr>
                <td>Công ty phát hành</td>
                <td>Vibooks</td>
              </tr>
              <tr>
                <td>Ngày xuất bản</td>
                <td>2021-06-01</td>
              </tr>
              <tr>
                <td>Kích thước</td>
                <td>16 x 24 cm</td>
              </tr>
              <tr>
                <td>Dịch giá</td>
                <td>Thu Hương</td>
              </tr>
              <tr>
                <td>Số trang</td>
                <td>424</td>
              </tr>
              <tr>
                <td>Nhà xuất bản</td>
                <td>Nhà xuất bản Thế Giới</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="description">
          <h2>Mô tả sản phẩm</h2>
          <p>NEW MỚI NGAY ANH THÁY TÔI ĐIỆN, THỨC RA CHỈNH LÀ ANH ĐIỆN! Hãy nhớ rằng con người đang sống trên thế giới này, bản thân bị giới hạn bởi rất nhiều thứ, nhưng nếu bạn có thể vượt qua những giới hạn ấy, bạn sẽ thấy cả một thế giới rộng lớn đang chờ đợi bạn...</p>
          <button class="read-more">Xem thêm</button>
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
    <div class="related-products">
      <h2>Sản phẩm tương tự</h2>
      <ProductCard
        image="Product_00.png"
        :discountedPrice="600000"
        :originalPrice="1600000"
        :author="'DAISETZ TEITARO SUZUKI'"
        :title="'Thiền luận'"
        :sold="96"
        :tags="['khoahoc', '4Sao']"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import ReviewItem from '@/components/client/ReviewItem.vue';

export default {
  name: "ProductPage",
  components: { ProductCard, ReviewItem },
  data() {
    return {
      quantity: 1,
      isFavorite: false, // Trạng thái yêu thích ban đầu
      thumbnails: [
        'Product_00.png',
        'image_00.png',
        'Product_00.png',
        'Product_00.png',
        'Product_00.png', // Thêm nhiều ảnh để test cuộn
        'Product_00.png',
        'Product_00.png',
      ],
      currentThumbnail: 0, // Index của thumbnail hiện tại (có viền đen)
      mainImage: 'Product_00.png', // Hình ảnh lớn mặc định
      reviews: [
        {
          id: 1,
          userName: 'Tina Bình',
          purchaseTime: 'Đã tham gia 2 năm',
          rating: 5,
          reviewText: 'Rất hài lòng, sách chất lượng tốt, nội dung hay, giao hàng nhanh.',
        },
        {
          id: 2,
          userName: 'Tina Bình',
          purchaseTime: 'Đã tham gia 2 năm',
          rating: 4,
          reviewText: 'Hơi thất vọng, nhưng nội dung vẫn ổn, giao hàng đúng hẹn.',
        },
      ],
      newReview: {
        id: null,
        userName: 'Người dùng (giả lập)', // Giả lập tên người dùng, bạn có thể thay bằng logic thực tế
        purchaseTime: 'Vừa đánh giá',
        rating: 1,
        reviewText: '',
      },
      itemsPerPage: 2, // Số bình luận trên mỗi trang
      currentPage: 1, // Trang hiện tại
    };
  },
  computed: {
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reviews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.reviews.length / this.itemsPerPage);
    },
  },
  methods: {
    buyNow() {
      console.log('Mua ngay:', this.quantity);
      // Thêm logic mua hàng tại đây
    },
    addToCart() {
      console.log('Thêm vào giỏ:', this.quantity);
      // Thêm logic thêm vào giỏ hàng tại đây
    },
    submitReview() {
      if (this.newReview.reviewText.trim() && this.newReview.rating) {
        this.newReview.id = this.reviews.length + 1;
        this.reviews.push({ ...this.newReview });
        this.newReview.reviewText = ''; // Reset bình luận
        this.newReview.rating = 1; // Reset đánh giá về 1 sao
        this.currentPage = Math.ceil(this.reviews.length / this.itemsPerPage); // Chuyển đến trang cuối nếu cần
        console.log('Đánh giá mới đã được gửi:', this.reviews);
      } else {
        alert('Vui lòng nhập đánh giá và bình luận!');
      }
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      console.log('Sản phẩm đã được ' + (this.isFavorite ? 'thêm vào' : 'bỏ khỏi') + ' yêu thích');
      // Thêm logic lưu vào store/API tại đây (ví dụ: Pinia/Vuex hoặc API call)
    },
    selectThumbnail(index) {
      this.currentThumbnail = index;
      this.mainImage = this.thumbnails[index]; // Cập nhật hình ảnh lớn khi chọn thumbnail
    },
    prevThumbnail() {
      this.currentThumbnail = (this.currentThumbnail - 1 + this.thumbnails.length) % this.thumbnails.length;
      this.mainImage = this.thumbnails[this.currentThumbnail]; // Cập nhật hình ảnh lớn khi chuyển trước
    },
    nextThumbnail() {
      this.currentThumbnail = (this.currentThumbnail + 1) % this.thumbnails.length;
      this.mainImage = this.thumbnails[this.currentThumbnail]; // Cập nhật hình ảnh lớn khi chuyển sau
    },
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