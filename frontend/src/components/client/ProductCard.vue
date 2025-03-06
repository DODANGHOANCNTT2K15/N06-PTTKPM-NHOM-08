<template>
  <div class="product" @click="$emit('click')">
    <div class="product-img">
      <img :src="require(`@/assets/images/${image}`)" :alt="title">
    </div>
    <div class="product-info">
      <p class="price">
        <span class="discounted">{{ formatPrice(discountedPrice) }}</span>
        <span class="original">{{ formatPrice(originalPrice) }}</span>
      </p>
      <p class="author">{{ author }}</p>
      <h1 class="title">{{ title }}</h1>
      <div class="ratings">
        <span>⭐⭐⭐⭐⭐</span>
        <span class="separator">|</span>
        <span>Đã bán {{ sold }}</span>
      </div>
      <div class="tags-cover-card">
        <span v-for="tag in tags" :key="tag" class="tags">#{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { type: Number, required: true },
    image: { type: String, required: true },
    discountedPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    author: { type: String, required: true },
    title: { type: String, required: true },
    sold: { type: Number, required: true },
    tags: { type: Array, required: true },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price);
    },
  },
};
</script>

<style scoped>
.product {
  cursor: pointer;
  padding: 15px; /* Tăng padding cho thoáng */
  border: 1px solid #e0e0e0; /* Viền nhạt hơn */
  border-radius: 8px; /* Bo góc mềm hơn */
  background-color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease; /* Hiệu ứng mượt mà */
  display: flex;
  flex-direction: column;
  height: 100%; /* Đảm bảo card có chiều cao đồng đều */
}

.product:hover {
  transform: translateY(-5px); /* Nhấc lên nhẹ khi hover */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Bóng đậm hơn */
}

.product-img {
  flex-shrink: 0; /* Ngăn ảnh bị co lại */
}

.product-img img {
  width: 100%;
  height: 200px; /* Chiều cao cố định để đồng đều */
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
  border-radius: 8px; /* Đồng bộ bo góc */
  display: block;
}

.product-info {
  padding: 10px 0; /* Giảm padding ngang để cân đối */
  display: flex;
  flex-direction: column;
  gap: 8px; /* Khoảng cách đều giữa các phần tử */
  flex-grow: 1; /* Đảm bảo phần info chiếm hết không gian còn lại */
}

.product-info .price {
  display: flex;
  align-items: center;
  gap: 10px; /* Khoảng cách giữa giá giảm và giá gốc */
  margin: 0;
}

.product-info .discounted {
  color: #e74c3c; /* Màu đỏ nổi bật */
  font-weight: 700; /* Đậm hơn */
  font-size: 1.2em; /* Tăng kích thước */
}

.product-info .original {
  color: #999; /* Xám nhạt hơn */
  font-size: 0.9em;
  text-decoration: line-through;
}

.product-info .author {
  color: #666;
  font-size: 0.9em;
  margin: 0;
  white-space: nowrap; /* Giữ tên tác giả trên 1 dòng */
  overflow: hidden;
  text-overflow: ellipsis; /* Thêm dấu ba chấm nếu tên quá dài */
}

.product-info .title {
  color: #2c3e50;
  font-size: 1.1em; /* Giảm nhẹ để cân đối */
  font-weight: 600; /* Đậm vừa phải */
  margin: 0;
  line-height: 1.4; /* Tăng khoảng cách dòng */
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Giới hạn 2 dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Thêm dấu ba chấm nếu tiêu đề quá dài */
}

.product-info .ratings {
  display: flex;
  align-items: center;
  gap: 5px; /* Khoảng cách giữa các phần tử */
  font-size: 0.85em; /* Nhỏ hơn để gọn */
  color: #f1c40f; /* Màu vàng cho sao */
}

.product-info .ratings .separator {
  color: #ccc; /* Dấu phân cách nhạt hơn */
}

.product-info .ratings span:last-child {
  color: #666; /* Màu xám cho số lượng đã bán */
}

.product-info .tags-cover-card {
  display: flex;
  flex-wrap: wrap; /* Cho phép tag xuống dòng nếu nhiều */
  gap: 5px; /* Khoảng cách giữa các tag */
  margin-top: auto; /* Đẩy tags xuống dưới cùng */
}

.product-info .tags {
  background-color: #e9ecef; /* Nền xám nhạt hơn */
  color: #2c3e50;
  padding: 4px 10px; /* Tăng padding cho đẹp */
  border-radius: 12px; /* Bo góc tròn hơn */
  font-size: 0.8em;
  transition: background-color 0.3s ease;
}

.product-info .tags:hover {
  background-color: #007bff; /* Màu xanh khi hover */
  color: white;
}
</style>