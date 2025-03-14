<template>
  <div class="product-detail-container">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="book">
          <div class="book-page"></div>
          <div class="book-page"></div>
          <div class="book-page"></div>
        </div>
        <p>Đang tải<span class="dots"></span></p>
      </div>
    </div>

    <div class="product-header">
      <nav class="nav-tabs">
        <a href="#">Trang chủ</a> > <a href="#">Sách tiếng Việt</a> >
        <span>{{ book.title }}</span>
      </nav>
    </div>

    <div class="product-content">
      <div class="product-left">
        <div class="product-image">
          <img :src="mainImage" :alt="book.title" />
        </div>
        <div class="thumbnail-slider">
          <button class="arrow-left" @click="prevThumbnail">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="thumbnail-container">
            <img
              v-for="(thumbnail, index) in book.images"
              :key="index"
              :src="thumbnail.image_path"
              :alt="`Thumbnail ${index + 1}`"
              :class="{ active: index === currentThumbnail }"
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
            <li>Tác phẩm kinh điển của {{ book.author }}</li>
            <li>Ngôn ngữ sắc sảo, phản ánh xã hội sâu sắc</li>
            <li>Ấn bản mới từ {{ book.publisher }}</li>
          </ul>
        </div>
      </div>

      <div class="product-right">
        <h1>{{ book.title }}</h1>
        <div class="rating">
          <span>{{
            "★".repeat(book.rating_avg) + "☆".repeat(5 - book.rating_avg)
          }}</span>
          ({{ book.reviews.length || 0 }} đánh giá)
        </div>
        <div class="price">
          <span class="current-price">{{ formatPrice(totalPrice) }} VNĐ</span>
          <span class="original-price"
            >~{{ formatPrice(book.price * quantity) }} VNĐ</span
          >
        </div>

        <div class="quantity">
          <label>Số lượng</label>
          <input
            type="number"
            min="1"
            v-model.number="quantity"
            @input="updateQuantity"
          />
        </div>

        <div class="actions">
          <button class="buy-now" @click="buyNow">Mua ngay</button>
          <button class="add-to-cart" @click="addToCart">Thêm vào giỏ</button>
          <button class="favorite-button" @click="toggleFavorite">
            <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
          </button>
        </div>

        <div class="shipping-info">
          <p>
            <i class="fas fa-map-marker-alt"></i> Hoàn Kiếm, Hà Đông, Hà Nội
          </p>
          <p><i class="fas fa-truck"></i> Giao phí chỉ từ 10k cho đơn từ 45k</p>
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
                <td>Ngày xuất bản</td>
                <td>{{ formatDate(book.published_date) }}</td>
              </tr>
              <tr>
                <td>Tác giả</td>
                <td>{{ book.author }}</td>
              </tr>
              <tr>
                <td>Kích thước</td>
                <td>16 x 24 cm</td>
              </tr>
              <tr>
                <td>Số trang</td>
                <td>100000</td>
              </tr>
              <tr>
                <td>Công ty phát hành</td>
                <td>{{ book.publisher }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="description">
          <h2>Mô tả sản phẩm</h2>
          <p>{{ book.description }}</p>
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
          :user-name="review.user.user_name"
          :purchase-time="formatDate(review.createdAt)"
          :rating="review.rating"
          :review-text="review.comment"
          :can-delete="review.user.user_id === currentUserId"
          @delete-review="deleteReview(review.review_id)"
        />
      </div>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <span
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button @click="currentPage = page">{{ page }}</button>
        </span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
      <div class="user-review-form">
        <h3>Thêm đánh giá của bạn</h3>
        <div class="rating-input">
          <label>Đánh giá (1-5 sao):</label>
          <select v-model="newReview.rating">
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
        <div class="comment-input">
          <label>Bình luận:</label>
          <textarea
            v-model="newReview.reviewText"
            placeholder="Viết đánh giá của bạn..."
            rows="4"
          ></textarea>
        </div>
        <button @click="submitReview" class="submit-review">
          Gửi đánh giá
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import ReviewItem from "@/components/client/ReviewItem.vue";
import { apiGetAllBookByID } from "@/services/client/BookService";
import { apiAddReview, apiDeleteReview } from "@/services/client/ReviewService";
import {
  apiAddToCart,
  apiGetCountProductOfCart,
} from "@/services/client/CartService";
import {
  apiAddToFavorite,
  apiDeleteFavorite,
  apiGetFavorites,
} from "@/services/client/FavoriteService";
import { useCartStore } from "@/stores/cart";
import Swal from "sweetalert2";

export default {
  name: "ProductPage",
  components: { ReviewItem },
  data() {
    return {
      isLoading: false, // Thêm trạng thái loading
      book: {
        book_id: "",
        title: "",
        author: "",
        publisher: "",
        published_date: "",
        price: 0,
        rating_avg: 0,
        discount_price: 0,
        description: "",
        images: [],
        reviews: [],
      },
      quantity: 1,
      isFavorite: false,
      favoriteId: null,
      currentThumbnail: 0,
      mainImage: "",
      reviews: [],
      newReview: {
        rating: 5,
        reviewText: "",
      },
      itemsPerPage: 2,
      currentPage: 1,
      currentUserId: null,
    };
  },
  computed: {
    totalPrice() {
      const basePrice = this.book.price * this.quantity;
      const discount = this.book.discount_price / 100;
      return basePrice * (1 - discount);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reviews.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.reviews.length / this.itemsPerPage);
    },
  },
  created() {
    this.fetchBookData();
    this.loadCurrentUser();
    this.checkFavoriteStatus();
  },
  setup() {
    const cartStore = useCartStore();
    return { cartStore };
  },
  methods: {
    getUserIdFromToken() {
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
    },
    loadCurrentUser() {
      this.currentUserId = this.getUserIdFromToken();
    },
    async fetchBookData() {
      this.isLoading = true; // Hiển thị loading
      const bookId = this.$route.params.id;
      try {
        const response = await apiGetAllBookByID({ book_id: bookId });
        if (response.status === 200 && response.data.err === 0) {
          this.book = response.data.data;
          this.mainImage = this.book.images[0]?.image_path || "";
          this.reviews = this.book.reviews || [];
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sách:", error);
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    async submitReview() {
      if (!this.newReview.reviewText.trim() || !this.newReview.rating) {
        Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập đánh giá và bình luận!",
        });
        return;
      }

      this.isLoading = true; // Hiển thị loading
      const bookId = this.$route.params.id;
      const reviewData = {
        book_id: bookId,
        user_id: this.currentUserId,
        rating: parseInt(this.newReview.rating),
        comment: this.newReview.reviewText,
      };

      try {
        const response = await apiAddReview(reviewData);
        if (response.status === 200 && response.data.err === 0) {
          await this.fetchBookData();
          this.newReview.reviewText = "";
          this.newReview.rating = 5;
          this.currentPage = Math.ceil(this.reviews.length / this.itemsPerPage);
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đánh giá của bạn đã được gửi!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: response.data.msg || "Có lỗi xảy ra khi gửi đánh giá.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi gửi đánh giá:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi gửi đánh giá.",
        });
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    async deleteReview(reviewId) {
      this.isLoading = true; // Hiển thị loading
      try {
        const response = await apiDeleteReview({ review_id: reviewId });
        if (response.status === 200 && response.data.err === 0) {
          await this.fetchBookData();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã xóa đánh giá thành công!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: response.data.msg || "Có lỗi xảy ra khi xóa đánh giá.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi xóa đánh giá:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xóa đánh giá.",
        });
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    updateQuantity() {
      if (this.quantity < 1 || isNaN(this.quantity)) {
        this.quantity = 1;
      }
    },
    formatPrice(price) {
      return Math.round(price).toLocaleString("vi-VN");
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
    buyNow() {
      console.log("Mua ngay:", this.quantity, "sách:", this.book.title);
      Swal.fire({
        icon: "info",
        title: "Mua ngay",
        text: `Bạn đã chọn mua ${this.quantity} cuốn sách: ${this.book.title}`,
      });
    },
    async addToCart() {
      if (!this.currentUserId) {
        Swal.fire({
          icon: "warning",
          title: "Chưa đăng nhập",
          text: "Vui lòng đăng nhập để thêm vào giỏ hàng!",
        });
        this.$router.push("/login");
        return;
      }

      this.isLoading = true; // Hiển thị loading
      const bookId = this.$route.params.id;
      const cartItem = {
        book_id: bookId,
        user_id: this.currentUserId,
        quantity: this.quantity,
        all_price: this.totalPrice,
      };

      try {
        const response = await apiAddToCart(cartItem);
        if (response.status === 200 && response.data.err === 0) {
          await this.updateCartCount();
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Đã thêm vào giỏ hàng thành công!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: response.data.msg || "Lỗi khi thêm vào giỏ hàng",
          });
        }
      } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi thêm vào giỏ hàng.",
        });
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    async updateCartCount() {
      this.isLoading = true; // Hiển thị loading
      try {
        const userId = this.getUserIdFromToken();
        if (userId) {
          const response = await apiGetCountProductOfCart({ user_id: userId });
          if (response.data.err === 0) {
            const count = response.data.total_product_types || 0;
            this.cartStore.updatetotal_product_type(count);
          } else {
            console.error(
              "Lỗi từ API khi lấy số lượng giỏ hàng:",
              response.data.msg
            );
            this.cartStore.updatetotal_product_type(0);
          }
        }
      } catch (error) {
        console.error("Không thể cập nhật số lượng giỏ hàng:", error);
        this.cartStore.updatetotal_product_type(0);
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    async checkFavoriteStatus() {
      if (!this.currentUserId) return;
      this.isLoading = true; // Hiển thị loading
      const bookId = this.$route.params.id;
      try {
        const response = await apiGetFavorites({ user_id: this.currentUserId });
        if (response.status === 200 && response.data.err === 0) {
          const favorites = response.data.data;
          const favorite = favorites.find((fav) => fav.book_id === bookId);
          if (favorite) {
            this.isFavorite = true;
            this.favoriteId = favorite.favorite_id;
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
      } finally {
        this.isLoading = false; // Ẩn loading
      }
    },
    async toggleFavorite() {
      if (!this.currentUserId) {
        Swal.fire({
          icon: "warning",
          title: "Chưa đăng nhập",
          text: "Vui lòng đăng nhập để thêm vào danh sách yêu thích!",
        });
        this.$router.push("/login");
        return;
      }

      this.isLoading = true; // Hiển thị loading
      const bookId = this.$route.params.id;
      if (!this.isFavorite) {
        const favoriteData = {
          user_id: this.currentUserId,
          book_id: bookId,
        };
        try {
          const response = await apiAddToFavorite(favoriteData);
          if (response.status === 200 && response.data.err === 0) {
            this.isFavorite = true;
            this.favoriteId = response.data.favorite_id;
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đã thêm vào danh sách yêu thích!",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: response.data.msg || "Lỗi khi thêm vào yêu thích",
            });
          }
        } catch (error) {
          console.error("Lỗi khi thêm vào yêu thích:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Có lỗi xảy ra khi thêm vào yêu thích.",
          });
        } finally {
          this.isLoading = false; // Ẩn loading
        }
      } else {
        try {
          const response = await apiDeleteFavorite({
            favorite_id: this.favoriteId,
          });
          if (response.status === 200 && response.data.err === 0) {
            this.isFavorite = false;
            this.favoriteId = null;
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Đã xóa khỏi danh sách yêu thích!",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: response.data.msg || "Lỗi khi xóa khỏi yêu thích",
            });
          }
        } catch (error) {
          console.error("Lỗi khi xóa khỏi yêu thích:", error);
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Có lỗi xảy ra khi xóa khỏi yêu thích.",
          });
        } finally {
          this.isLoading = false; // Ẩn loading
        }
      }
    },
    selectThumbnail(index) {
      this.currentThumbnail = index;
      this.mainImage = this.book.images[index].image_path;
    },
    prevThumbnail() {
      this.currentThumbnail =
        (this.currentThumbnail - 1 + this.book.images.length) %
        this.book.images.length;
      this.mainImage = this.book.images[this.currentThumbnail].image_path;
    },
    nextThumbnail() {
      this.currentThumbnail =
        (this.currentThumbnail + 1) % this.book.images.length;
      this.mainImage = this.book.images[this.currentThumbnail].image_path;
    },
  },
};
</script>

<style scoped>
@import "@/assets/css/ProductDetail.css";
@import "@/assets/css/General.css";

.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative; /* Để overlay hoạt động trong container */
}

.product-header .nav-tabs {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.product-header .nav-tabs a {
  color: #2c3e50;
  text-decoration: none;
}

.product-header .nav-tabs span {
  color: #e74c3c;
}

.product-content {
  display: flex;
  gap: 30px;
}

.product-left {
  flex: 1;
}

.product-right {
  flex: 1.5;
}

.product-image img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.thumbnail-slider {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.thumbnail-container {
  display: flex;
  overflow-x: auto;
  gap: 10px;
}

.thumbnail-container img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 5px;
}

.thumbnail-container img.active {
  border: 2px solid #2c3e50;
}

.arrow-left,
.arrow-right {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0 10px;
}

.highlight-section {
  margin-top: 20px;
}

.highlight-section h3 {
  font-size: 18px;
  color: #2c3e50;
}

.highlight-section ul {
  list-style-type: none;
  padding-left: 0px;
}

.highlight-section li {
  margin-bottom: 10px;
}

.product-right h1 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.rating {
  margin-bottom: 10px;
}

.rating span {
  color: #f1c40f;
}

.price {
  margin-bottom: 20px;
}

.current-price {
  font-size: 24px;
  color: #e74c3c;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.quantity {
  margin-bottom: 20px;
}

.quantity label {
  margin-right: 10px;
}

.quantity input {
  width: 60px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.buy-now,
.add-to-cart,
.favorite-button {
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
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-button .fas.fa-heart {
  color: #c0392b;
}

.shipping-info {
  margin-bottom: 20px;
}

.shipping-info p {
  font-size: 14px;
  color: #666;
}

.shipping-info i {
  margin-right: 5px;
}

.product-details,
.description {
  margin-bottom: 20px;
}

.product-details h2,
.description h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.product-details table {
  width: 100%;
  border-collapse: collapse;
}

.product-details td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

.description p {
  font-size: 14px;
  color: #666;
}

.read-more {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
}

.customer-reviews {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.customer-reviews h2 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.review-list {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.pagination button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.pagination .active button {
  background-color: #2c3e50;
  color: white;
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

.rating-input,
.comment-input {
  margin-bottom: 15px;
}

.rating-input select,
.comment-input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-review {
  padding: 8px 16px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-review:hover {
  background-color: #219653;
}

/* CSS cho Loading Overlay */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: #fff;
}

.book {
  position: relative;
  width: 60px;
  height: 80px;
  margin: 0 auto 20px;
}

.book-page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 2px;
  transform-origin: left center;
  animation: flip 1.5s infinite ease-in-out;
}

.book-page:nth-child(1) {
  animation-delay: 0s;
  background: #f5f5f5;
}

.book-page:nth-child(2) {
  animation-delay: 0.3s;
  background: #e0e0e0;
}

.book-page:nth-child(3) {
  animation-delay: 0.6s;
  background: #d0d0d0;
}

@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(-180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

p {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots::after {
  content: "...";
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s infinite;
}

@keyframes dots {
  0% {
    content: ".";
  }
  33% {
    content: "..";
  }
  66% {
    content: "...";
  }
  100% {
    content: ".";
  }
}
</style>