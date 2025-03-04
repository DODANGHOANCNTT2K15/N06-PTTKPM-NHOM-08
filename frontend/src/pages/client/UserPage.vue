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

          <div class="address-container">
            <!-- Ô vuông lớn với dấu "+" để thêm địa chỉ mới -->
            <div class="address-add-box" @click="showAddAddressPopup = true">
              <span class="add-icon">+</span>
              <p>Thêm địa chỉ mới</p>
            </div>

            <!-- Ô vuông hiển thị địa chỉ đã có -->
            <div class="address-existing-box">
              <h3>Địa chỉ hiện tại</h3>
              <p><strong>Số điện thoại:</strong> 0335546276</p>
              <p><strong>Địa chỉ:</strong> Ba Đình, Hà Nội, ...</p>
              <p><strong>Tên người nhận:</strong> Đỗ Đăng Hoàn</p>
              <div class="address-actions">
                <button class="edit-btn" @click="showEditAddressPopup = true">Sửa</button>
                <button class="delete-btn" @click="deleteAddress">Xóa</button>
              </div>
            </div>
          </div>
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

    <!-- Popup Thêm Địa chỉ Mới -->
    <div v-if="showAddAddressPopup" class="modal">
      <div class="modal-content">
        <h2>Thêm địa chỉ mới</h2>
        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="text" v-model="newAddress.phone" placeholder="Nhập số điện thoại" />
        </div>
        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" v-model="newAddress.address" placeholder="Nhập địa chỉ" />
        </div>
        <div class="form-group">
          <label>Tên người nhận</label>
          <input type="text" v-model="newAddress.recipient" placeholder="Nhập tên người nhận" />
        </div>
        <div class="modal-actions">
          <button @click="saveNewAddress">Lưu</button>
          <button @click="showAddAddressPopup = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Popup Sửa Địa chỉ Hiện tại -->
    <div v-if="showEditAddressPopup" class="modal">
      <div class="modal-content">
        <h2>Sửa địa chỉ hiện tại</h2>
        <div class="form-group">
          <label>Số điện thoại</label>
          <input type="text" v-model="editAddressData.phone" placeholder="Nhập số điện thoại" />
        </div>
        <div class="form-group">
          <label>Địa chỉ</label>
          <input type="text" v-model="editAddressData.address" placeholder="Nhập địa chỉ" />
        </div>
        <div class="form-group">
          <label>Tên người nhận</label>
          <input type="text" v-model="editAddressData.recipient" placeholder="Nhập tên người nhận" />
        </div>
        <div class="modal-actions">
          <button @click="updateAddress">Cập nhật</button>
          <button @click="showEditAddressPopup = false">Hủy</button>
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

    const showAddAddressPopup = ref(false);
    const showEditAddressPopup = ref(false);
    const newAddress = ref({
      phone: '',
      address: '',
      recipient: '',
    });

    const editAddressData = ref({
      phone: '0335546276',
      address: 'Ba Đình, Hà Nội, ...',
      recipient: 'Đỗ Đăng Hoàn',
    });

    const addNewAddress = () => {
      showAddAddressPopup.value = true;
    };

    const saveNewAddress = () => {
      console.log('Địa chỉ mới đã lưu:', newAddress.value);
      alert('Địa chỉ mới đã được lưu thành công!');
      showAddAddressPopup.value = false;
      // Ở đây, bạn có thể thêm logic để lưu địa chỉ vào store, API, hoặc danh sách địa chỉ
      newAddress.value = { phone: '', address: '', recipient: '' }; // Reset form
    };

    const editAddress = () => {
      showEditAddressPopup.value = true;
    };

    const updateAddress = () => {
      console.log('Địa chỉ đã cập nhật:', editAddressData.value);
      alert('Địa chỉ đã được cập nhật thành công!');
      showEditAddressPopup.value = false;
      // Ở đây, bạn có thể thêm logic để cập nhật địa chỉ vào store, API, hoặc danh sách địa chỉ
    };

    const deleteAddress = () => {
      console.log('Địa chỉ đã xóa');
      alert('Địa chỉ hiện tại đã được xóa!');
      // Ở đây, bạn có thể thêm logic để xóa địa chỉ khỏi store, API, hoặc danh sách địa chỉ
    };

    return {
      userInfo,
      currentRouteName,
      saveChanges,
      showAddAddressPopup,
      showEditAddressPopup,
      newAddress,
      editAddressData,
      addNewAddress,
      saveNewAddress,
      editAddress,
      updateAddress,
      deleteAddress,
    };
  },
};
</script>

<style scoped>
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

.address-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.address-add-box {
  width: 200px;
  height: 200px;
  background-color: #e0f7fa;
  border: 2px dashed #007bff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.address-add-box:hover {
  background-color: #b3e5fc;
}

.add-icon {
  font-size: 2em;
  color: #007bff;
  margin-bottom: 10px;
}

.address-add-box p {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.address-existing-box {
  width: 300px;
  height: 200px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.address-existing-box h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.address-existing-box p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.address-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Style cho Modal/Popup */
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

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
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