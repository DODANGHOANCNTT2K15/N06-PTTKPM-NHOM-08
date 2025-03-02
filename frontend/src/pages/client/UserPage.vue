<template>
    <div class="user-page-container">
      <div class="user-header">
        <nav class="nav-tabs">
          <a href="#">Trang chủ</a> > <a href="#">Truyện tranh</a>
        </nav>
      </div>
  
      <div class="user-content">
        <div class="sidebar">
          <div class="sidebar-item" @click="$router.push('/user/info')">
            <i class="fas fa-user"></i> Thông tin tài khoản
          </div>
          <div class="sidebar-item" @click="$router.push('/user/cart')">
            <i class="fas fa-shopping-cart"></i> Giỏ hàng
          </div>
          <div class="sidebar-item" @click="$router.push('/user/address')">
            <i class="fas fa-map-marker-alt"></i> Địa chỉ
          </div>
          <div class="sidebar-item" @click="$router.push('/user/like')">
            <i class="fas fa-heart"></i> Sản phẩm yêu thích
          </div>
          <div class="sidebar-item" @click="$router.push('/user/history')">
            <i class="fas fa-eye"></i> Lịch sử sản phẩm
          </div>
        </div>
  
        <div class="user-profile">
          <div v-if="currentRouteName === 'UserInfo'" class="profile-info-content">
            <div class="profile-header">
              <img src="@/assets/images/image_01.png" alt="Avatar" class="avatar" />
              <h2>Thông tin tài khoản</h2>
            </div>
  
            <div class="profile-form">
              <div class="form-group">
                <label>Họ và tên</label>
                <input type="text" v-model="userInfo.fullName" placeholder="Đỗ Đình Hoàn" />
              </div>
              <div class="form-group">
                <label>Nickname</label>
                <input type="text" v-model="userInfo.nickname" placeholder="Nickname" />
              </div>
              <div class="form-group">
                <label>Giới tính</label>
                <div class="radio-group">
                  <label>
                    <input type="radio" v-model="userInfo.gender" value="Nam" /> Nam
                  </label>
                  <label>
                    <input type="radio" v-model="userInfo.gender" value="Nữ" /> Nữ
                  </label>
                </div>
              </div>
              <button class="save-btn" @click="saveChanges">Lưu thay đổi</button>
            </div>
  
            <div class="profile-info">
              <div class="info-item">
                <label>Số điện thoại</label>
                <p>0335546276</p>
                <button class="copy-btn">Cập nhật</button>
              </div>
              <div class="info-item">
                <label>Email</label>
                <p>abc@gmail.com</p>
                <button class="copy-btn">Cập nhật</button>
              </div>
              <div class="info-item">
                <label>Thay đổi mật khẩu</label>
                <p>abc@gmail.com</p>
                <button class="copy-btn">Cập nhật</button>
              </div>
            </div>
          </div>
  
          <div v-if="currentRouteName === 'UserCart'" class="profile-info-content">
            <h2>Giỏ hàng của bạn</h2>
            <p>Đây là nội dung giỏ hàng. Bạn có thể hiển thị danh sách sản phẩm từ giỏ hàng ở đây.</p>
            <!-- Thêm logic hiển thị giỏ hàng (có thể sử dụng component CartPage hoặc dữ liệu từ store) -->
          </div>
  
          <div v-if="currentRouteName === 'UserAddress'" class="profile-info-content">
            <h2>Địa chỉ của bạn</h2>
            <p>Đây là nội dung địa chỉ. Bạn có thể hiển thị danh sách địa chỉ hoặc form chỉnh sửa địa chỉ ở đây.</p>
            <!-- Thêm logic hiển thị hoặc form địa chỉ -->
          </div>
  
          <div v-if="currentRouteName === 'UserLike'" class="profile-info-content">
            <h2>Sản phẩm yêu thích</h2>
            <p>Đây là nội dung sản phẩm yêu thích. Bạn có thể hiển thị danh sách sản phẩm yêu thích ở đây.</p>
            <!-- Thêm logic hiển thị sản phẩm yêu thích -->
          </div>
  
          <div v-if="currentRouteName === 'UserHistory'" class="profile-info-content">
            <h2>Lịch sử sản phẩm</h2>
            <p>Đây là nội dung lịch sử sản phẩm. Bạn có thể hiển thị lịch sử xem sản phẩm ở đây.</p>
            <!-- Thêm logic hiển thị lịch sử sản phẩm -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    name: 'UserPage',
    setup() {
      const userInfo = ref({
        fullName: 'Đỗ Đình Hoàn',
        nickname: '',
        gender: 'Nam',
      });
  
      const route = useRoute();
      const currentRouteName = computed(() => route.name);
  
      const saveChanges = () => {
        console.log('Thông tin đã lưu:', userInfo.value);
        alert('Thông tin đã được lưu thành công!');
      };
  
      return {
        userInfo,
        currentRouteName,
        saveChanges,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Giữ nguyên CSS từ trước... */
  .user-page-container {
    background-color: #f0f8ff;
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .user-header {
    margin-bottom: 20px;
    color: #666;
    font-size: 14px;
  }
  
  .nav-tabs {
    color: #666;
  }
  
  .nav-tabs a {
    color: #666;
    text-decoration: none;
  }
  
  .nav-tabs a:hover {
    text-decoration: underline;
  }
  
  .user-content {
    display: flex;
    gap: 20px;
  }
  
  .sidebar {
    width: 200px;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 14px;
    color: #333;
    cursor: pointer;
  }
  
  .sidebar-item i {
    color: #007bff;
  }
  
  .sidebar-item:hover {
    color: #007bff;
  }
  
  .user-profile {
    flex: 1;
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #ddd;
  }
  
  .profile-header h2 {
    font-size: 24px;
    color: #333;
    margin: 0;
  }
  
  .profile-form {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    font-size: 16px;
    color: #333;
    display: block;
    margin-bottom: 5px;
    margin-right: 20px;
  }
  
  .form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .radio-group {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  
  .radio-group label {
    font-size: 14px;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  
  .radio-group input {
    margin-right: 5px;
    vertical-align: middle;
  }
  
  .save-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .save-btn:hover {
    background-color: #0056b3;
  }
  
  .profile-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .info-item {
    flex: 1;
    min-width: 200px;
  }
  
  .info-item label {
    font-size: 16px;
    color: #333;
    display: block;
    margin-bottom: 5px;
  }
  
  .info-item p {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }
  
  .copy-btn {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .copy-btn:hover {
    background-color: #0056b3;
  }
  
  .profile-info-content {
    width: 100%;
  }
  
  .profile-info-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .profile-info-content p {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
  </style>