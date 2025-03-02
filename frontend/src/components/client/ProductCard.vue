<template>
    <div class="product">
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
    image: String,
    discountedPrice: Number,
    originalPrice: Number,
    author: String,
    title: String,
    sold: Number,
    tags: Array
}
};
</script>
  