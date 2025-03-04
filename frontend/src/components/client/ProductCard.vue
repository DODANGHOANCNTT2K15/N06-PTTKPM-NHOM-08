<template>
  <div class="product" @click="$emit('click')">
    <div class="product-img">
      <img :src="require(`@/assets/images/${image}`)" :alt="title">
    </div>
    <div class="product-info">
      <p>
        <span class="discounted">{{ discountedPrice }}₫</span>
        <span class="original">{{ originalPrice }}₫</span>
      </p>
      <p class="author">{{ author }}</p>
      <h1 class="title">{{ title }}</h1>
      <div class="ratings">
        <span>⭐⭐⭐⭐⭐</span><span>|</span>
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
    id: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    sold: {
      type: Number,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.product {
  cursor: pointer; /* Thêm con trỏ tay để người dùng biết có thể click */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  transition: box-shadow 0.3s ease;
}

.product:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-img img {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
}

.product-info {
  padding: 10px;
}

.product-info .discounted {
  color: #e74c3c;
  font-weight: bold;
  font-size: 1.1em;
  margin-right: 10px;
}

.product-info .original {
  color: #888;
  text-decoration: line-through;
  font-size: 0.9em;
}

.product-info .author {
  color: #666;
  font-size: 0.9em;
  margin: 5px 0;
}

.product-info .title {
  color: #2c3e50;
  font-size: 1.2em;
  margin: 5px 0;
}

.product-info .ratings {
  color: #f1c40f;
  font-size: 0.9em;
  margin: 5px 0;
}

.product-info .ratings span:nth-child(2) {
  margin: 0 5px;
  color: #666;
}

.product-info .tags-cover-card {
  margin-top: 10px;
}

.product-info .tags {
  background-color: #f0f0f0;
  color: #2c3e50;
  padding: 2px 8px;
  margin-right: 5px;
  border-radius: 10px;
  font-size: 0.8em;
}
</style>