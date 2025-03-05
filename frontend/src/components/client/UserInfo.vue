<template>
    <div class="profile-info-content">
      <div class="profile-header">
        <div class="avatar-container" @click="showImagePopup = true">
          <img v-if="avatarSrc" :src="avatarSrc" alt="Avatar" class="avatar" />
          <div v-else class="avatar-placeholder"></div>
          <div class="avatar-overlay">
            <i class="fas fa-camera"></i>
          </div>
        </div>
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
          <p>{{ phoneNumber }}</p>
          <button class="copy-btn" @click="showPhonePopup = true">Cập nhật</button>
        </div>
        <div class="info-item">
          <label>Email</label>
          <p>{{ email }}</p>
          <button class="copy-btn" @click="showEmailPopup = true">Cập nhật</button>
        </div>
        <div class="info-item">
          <label>Thay đổi mật khẩu</label>
          <p>********</p>
          <button class="copy-btn" @click="showPasswordPopup = true">Cập nhật</button>
        </div>
      </div>
  
      <!-- Popup chọn ảnh -->
      <div v-if="showImagePopup" class="modal">
        <div class="modal-content">
          <h2>Chọn ảnh đại diện</h2>
          <div class="preview-container" v-if="previewImage">
            <img :src="previewImage" alt="Preview" class="preview-image" />
          </div>
          <input type="file" accept="image/*" @change="handleImageChange" class="file-input" />
          <div class="modal-actions">
            <button @click="saveImage">Lưu</button>
            <button @click="showImagePopup = false">Hủy</button>
          </div>
        </div>
      </div>
  
      <!-- Popup cập nhật số điện thoại -->
      <div v-if="showPhonePopup" class="modal">
        <div class="modal-content">
          <h2>Cập nhật số điện thoại</h2>
          <div class="form-group">
            <label>Số điện thoại mới</label>
            <input type="text" v-model="newPhoneNumber" placeholder="Nhập số điện thoại mới" />
          </div>
          <div class="modal-actions">
            <button @click="savePhoneNumber">Lưu</button>
            <button @click="showPhonePopup = false">Hủy</button>
          </div>
        </div>
      </div>
  
      <!-- Popup cập nhật email -->
      <div v-if="showEmailPopup" class="modal">
        <div class="modal-content">
          <h2>Cập nhật email</h2>
          <div class="form-group">
            <label>Email mới</label>
            <input type="email" v-model="newEmail" placeholder="Nhập email mới" />
          </div>
          <div class="modal-actions">
            <button @click="saveEmail">Lưu</button>
            <button @click="showEmailPopup = false">Hủy</button>
          </div>
        </div>
      </div>
  
      <!-- Popup thay đổi mật khẩu -->
      <div v-if="showPasswordPopup" class="modal">
        <div class="modal-content">
          <h2>Thay đổi mật khẩu</h2>
          <div class="form-group">
            <label>Mật khẩu cũ</label>
            <input type="password" v-model="oldPassword" placeholder="Nhập mật khẩu cũ" />
          </div>
          <div class="form-group">
            <label>Mật khẩu mới</label>
            <input type="password" v-model="newPassword" placeholder="Nhập mật khẩu mới" />
          </div>
          <div class="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input type="password" v-model="confirmPassword" placeholder="Xác nhận mật khẩu mới" />
          </div>
          <div class="modal-actions">
            <button @click="savePassword">Lưu</button>
            <button @click="showPasswordPopup = false">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'UserInfo',
    setup() {
      const userInfo = ref({
        fullName: 'Đỗ Đình Hoàn',
        nickname: '',
        gender: 'Nam',
      });
  
      const avatarSrc = ref(null);
      const showImagePopup = ref(false);
      const previewImage = ref(null);
  
      // Dữ liệu cho số điện thoại, email, mật khẩu
      const phoneNumber = ref('0335546276');
      const email = ref('abc@gmail.com');
      const showPhonePopup = ref(false);
      const showEmailPopup = ref(false);
      const showPasswordPopup = ref(false);
      const newPhoneNumber = ref('');
      const newEmail = ref('');
      const oldPassword = ref('');
      const newPassword = ref('');
      const confirmPassword = ref('');
  
      const saveChanges = () => {
        console.log('Thông tin đã lưu:', userInfo.value);
        alert('Thông tin đã được lưu thành công!');
      };
  
      const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          previewImage.value = URL.createObjectURL(file);
        }
      };
  
      const saveImage = () => {
        if (previewImage.value) {
          avatarSrc.value = previewImage.value;
          console.log('Ảnh đã lưu:', avatarSrc.value);
          alert('Ảnh đại diện đã được cập nhật!');
        }
        showImagePopup.value = false;
        previewImage.value = null;
      };
  
      const savePhoneNumber = () => {
        if (newPhoneNumber.value) {
          phoneNumber.value = newPhoneNumber.value;
          console.log('Số điện thoại mới:', phoneNumber.value);
          alert('Số điện thoại đã được cập nhật!');
          // Gọi API để cập nhật số điện thoại
        }
        showPhonePopup.value = false;
        newPhoneNumber.value = '';
      };
  
      const saveEmail = () => {
        if (newEmail.value) {
          email.value = newEmail.value;
          console.log('Email mới:', email.value);
          alert('Email đã được cập nhật!');
          // Gọi API để cập nhật email
        }
        showEmailPopup.value = false;
        newEmail.value = '';
      };
  
      const savePassword = () => {
        if (newPassword.value && newPassword.value === confirmPassword.value) {
          console.log('Mật khẩu mới:', newPassword.value);
          alert('Mật khẩu đã được thay đổi!');
          // Gọi API để thay đổi mật khẩu
        } else if (newPassword.value !== confirmPassword.value) {
          alert('Mật khẩu xác nhận không khớp!');
        }
        showPasswordPopup.value = false;
        oldPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      };
  
      return {
        userInfo,
        avatarSrc,
        showImagePopup,
        previewImage,
        phoneNumber,
        email,
        showPhonePopup,
        showEmailPopup,
        showPasswordPopup,
        newPhoneNumber,
        newEmail,
        oldPassword,
        newPassword,
        confirmPassword,
        saveChanges,
        handleImageChange,
        saveImage,
        savePhoneNumber,
        saveEmail,
        savePassword,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .avatar-container {
    position: relative;
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
  
  .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #000;
  }
  
  .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #fff;
    border: 1px solid #000;
  }
  
  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .avatar-container:hover .avatar-overlay {
    opacity: 1;
  }
  
  .avatar-overlay i {
    color: white;
    font-size: 24px;
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
  }
  
  .save-btn {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
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
  }
  
  .info-item p {
    font-size: 14px;
    color: #666;
  }
  
  .copy-btn {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .copy-btn:hover {
    background-color: #0056b3;
  }
  
  /* Modal Styles */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content h2 {
    font-size: 20px;
    color: #333;
    margin-bottom: 15px;
  }
  
  .preview-container {
    margin-bottom: 15px;
    text-align: center;
  }
  
  .preview-image {
    max-width: 100%;
    max-height: 200px;
    border-radius: 5px;
  }
  
  .file-input {
    display: block;
    width: 100%;
    margin-bottom: 15px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .modal-actions button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal-actions button:first-child {
    background-color: #007bff;
    color: white;
  }
  
  .modal-actions button:first-child:hover {
    background-color: #0056b3;
  }
  
  .modal-actions button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  
  .modal-actions button:last-child:hover {
    background-color: #c0392b;
  }
  </style>