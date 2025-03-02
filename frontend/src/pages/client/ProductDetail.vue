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
            <img src="@/assets/images/Product_00.png" alt="Thiên Tài Bên Trái, Kẻ Điên Bên Phải" />
            <div class="thumbnail-slider">
              <img src="@/assets/images/Product_00.png" alt="Thumbnail 1" />
              <img src="@/assets/images/Product_00.png" alt="Thumbnail 2" />
              <img src="@/assets/images/Product_00.png" alt="Thumbnail 3" />
              <img src="@/assets/images/Product_00.png" alt="Thumbnail 4" />
            </div>
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
            <input type="number" min="1" value="1" />
          </div>
  
          <div class="actions">
            <button class="buy-now" @click="buyNow">Mua ngay</button>
            <button class="add-to-cart" @click="addToCart">Thêm vào giỏ</button>
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
                    <td>Địch giá</td>
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
      
      <div class="related-products">
        <h2>Sản phẩm tương tự</h2>
        <ProductCard
        image="Product_00.png"
        :discountedPrice="600000"
        :originalPrice="1600000"
        author="DAISETZ TEITARO SUZUKI"
        title="Thiền luận"
        :sold="96"
        :tags="['khoahoc', '4Sao']"
        />
      </div>
  
      <div class="customer-reviews">
        <h2>Khách hàng đánh giá</h2>
        <div class="review-list">
            <ReviewItem
            v-for="review in reviews"
            :key="review.id"
            :user-name="review.userName"
            :purchase-time="review.purchaseTime"
            :rating="review.rating"
            :review-text="review.reviewText"
            />
      </div>
    </div>
    </div>
  </template>

<script>
import ProductCard from "@/components/client/ProductCard.vue";
import ReviewItem from '@/components/client/ReviewItem.vue';

export default {
  name: "ProductPage",
  components: { ProductCard,ReviewItem, },
  data() {
    return {
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
    };
  },
};
</script>

<style scoped>
  @import "@/assets/css/ProductDetail.css";
  @import "@/assets/css/General.css";
</style>