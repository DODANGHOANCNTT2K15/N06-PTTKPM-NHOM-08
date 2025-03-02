<template>
    <div class="review-item">
      <div class="review-header">
        <h3>{{ userName }}</h3>
        <p>{{ purchaseTime }}</p>
      </div>
      <div class="review-content">
        <div class="rating">
          <span v-for="star in rating" :key="star">★</span>
          <span v-for="empty in (5 - rating)" :key="empty">☆</span>
        </div>
        <p class="review-text">{{ reviewText }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewItem',
    props: {
      userName: String,
      purchaseTime: String,
      rating: Number,
      reviewText: String,
    },
  };
  </script>
  
  <style scoped>
  .review-item {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    border: 1px solid #ddd;
  }
  
  .review-header {
    margin-bottom: 10px;
  }
  
  .review-header h3 {
    margin: 0;
    font-size: 16px;
    color: #333;
  }
  
  .review-header p {
    margin: 5px 0 0;
    font-size: 12px;
    color: #666;
  }
  
  .review-content .rating {
    color: #ff9900;
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .review-text {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
  </style>