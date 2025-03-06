<template>
  <div class="product" @click="$emit('click', id)">
    <div class="product-img">
      <img :src="imageSrc" :alt="title || 'Product Image'" @error="handleImageError" />
    </div>
    <div class="product-info">
      <p class="price">
        <span class="discounted">{{ formatPrice(discountedPrice) }}</span>
        <span class="original" v-if="discountedPrice < originalPrice">{{ formatPrice(originalPrice) }}</span>
      </p>
      <p class="author">{{ author || 'Tác giả không xác định' }}</p>
      <h1 class="title">{{ title || 'Chưa có tiêu đề' }}</h1>
      <div class="ratings">
        <span class="stars">{{ renderStars(rating) }}</span>
        <span class="separator">|</span>
        <span>Đã bán {{ sold || 0 }}</span>
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
    id: { type: [Number, String], required: true }, // Hỗ trợ cả số và chuỗi (từ API)
    image: { type: String, required: false, default: 'Product_00.png' },
    discountedPrice: { type: Number, required: false, default: 0 },
    originalPrice: { type: Number, required: false, default: 0 },
    author: { type: String, required: false, default: '' },
    title: { type: String, required: false, default: '' },
    sold: { type: Number, required: false, default: 0 },
    tags: { type: Array, required: false, default: () => [] },
    rating: { type: Number, required: false, default: 0 }, // Thêm rating để hiển thị sao thực tế
  },
  computed: {
    imageSrc() {
      // Hỗ trợ cả URL từ API và ảnh local
      if (this.image.startsWith('http')) {
        return this.image;
      }
      try {
        return require(`@/assets/images/${this.image}`);
      } catch (e) {
        return require(`@/assets/images/Product_00.png`); // Ảnh mặc định nếu lỗi
      }
    },
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(price || 0);
    },
    renderStars(rating) {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5 ? '½' : '';
      const emptyStars = 5 - Math.ceil(rating);
      return '⭐'.repeat(fullStars) + halfStar + '☆'.repeat(emptyStars);
    },
    handleImageError(event) {
      event.target.src = require(`@/assets/images/Product_00.png`); // Thay bằng ảnh mặc định nếu lỗi
    },
  },
};
</script>

<style scoped>
.product {
  cursor: pointer;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.product-img {
  flex-shrink: 0;
}

.product-img img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.product-info {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-grow: 1;
}

.product-info .price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.product-info .discounted {
  color: #e74c3c;
  font-weight: 700;
  font-size: 1.2em;
}

.product-info .original {
  color: #999;
  font-size: 0.9em;
  text-decoration: line-through;
}

.product-info .author {
  color: #666;
  font-size: 0.9em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info .title {
  color: #2c3e50;
  font-size: 1.1em;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-info .ratings {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85em;
}

.product-info .ratings .stars {
  color: #f1c40f;
}

.product-info .ratings .separator {
  color: #ccc;
}

.product-info .ratings span:last-child {
  color: #666;
}

.product-info .tags-cover-card {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: auto;
}

.product-info .tags {
  background-color: #e9ecef;
  color: #2c3e50;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8em;
  transition: background-color 0.3s ease;
}

.product-info .tags:hover {
  background-color: #007bff;
  color: white;
}
</style>