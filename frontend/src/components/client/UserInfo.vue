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
      <button class="change-password-btn" @click="showPasswordPopup = true">
        Thay đổi mật khẩu
      </button>
    </div>

    <div class="profile-form">
      <div class="form-group">
        <label>Tên</label>
        <input
          type="text"
          v-model="userInfo.fullName"
          placeholder="Đinh Việt Anh"
        />
      </div>
      <div class="form-group">
        <label>Email</label>
        <p>{{ email }}</p>
      </div>
      <button class="save-btn" @click="saveChanges">Lưu thay đổi</button>
    </div>

    <!-- Popup chọn ảnh -->
    <div v-if="showImagePopup" class="modal">
      <div class="modal-content">
        <h2>Chọn ảnh đại diện</h2>
        <div class="preview-container" v-if="previewImage">
          <img :src="previewImage" alt="Preview" class="preview-image" />
        </div>
        <input
          type="file"
          accept="image/*"
          @change="handleImageChange"
          class="file-input"
        />
        <div class="modal-actions">
          <button @click="saveImage">Lưu</button>
          <button @click="showImagePopup = false">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Popup thay đổi mật khẩu -->
    <div v-if="showPasswordPopup" class="modal">
      <div class="modal-content">
        <h2>Thay đổi mật khẩu</h2>
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="Nhập email"
            readonly
          />
        </div>
        <div class="form-group">
          <label>Mật khẩu cũ</label>
          <input
            type="password"
            v-model="oldPassword"
            placeholder="Nhập mật khẩu cũ"
          />
        </div>
        <div class="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            v-model="newPassword"
            placeholder="Nhập mật khẩu mới"
          />
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
import { ref, onMounted } from "vue";
import {
  apiGetUserInfor,
  apiUpdateAvatar,
  apiChangePassword,
  apiUpdateInfor
} from "@/services/client/UserInforService";
import { useAvatarStore } from "@/stores/avatar";
import Swal from "sweetalert2"; // Import SweetAlert2

export default {
  name: "UserInfo",
  setup() {
    const avatarStore = useAvatarStore();
    const userInfo = ref({
      fullName: "",
    });
    const email = ref("");
    const avatarSrc = ref(null);
    const showImagePopup = ref(false);
    const previewImage = ref(null);
    const showPasswordPopup = ref(false);
    const oldPassword = ref("");
    const newPassword = ref("");
    const userId = ref(null);

    // Hàm giải mã JWT token để lấy user_id
    const getUserIdFromToken = () => {
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
    };

    // Load dữ liệu người dùng từ API và avatar từ store
    const loadUserData = async () => {
      userId.value = getUserIdFromToken();
      if (!userId.value) {
        console.log("Không thể lấy user_id từ token");
        return;
      }

      try {
        const response = await apiGetUserInfor({ user_id: userId.value });
        if (response.status === 200 && response.data.err === 0) {
          userInfo.value.fullName = response.data.data.user_name;
          email.value = response.data.data.email;
          const apiAvatar = response.data.data.avatar?.avatar_path;
          avatarSrc.value = apiAvatar || avatarStore.avatar;
          if (apiAvatar) {
            avatarStore.updateAvatar(apiAvatar); // Đồng bộ store với API
          }
        } else {
          console.log("Lỗi khi tải dữ liệu: " + response.data.msg);
        }
      } catch (error) {
        console.log("Lỗi khi gọi API:", error);
      }
    };

    onMounted(() => {
      avatarStore.initializeAvatar(); // Khởi tạo avatar từ localStorage
      avatarSrc.value = avatarStore.avatar; // Hiển thị avatar từ store nếu có
      loadUserData(); // Load dữ liệu từ API
    });

    const saveChanges = async () => {
      try {
        const response = await apiUpdateInfor({
          user_name: userInfo.value.fullName,
          email: email.value,
          user_id: userId.value
        });
        if (response.status === 200 && response.data.err === 0) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thông tin đã được lưu thành công!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lưu thông tin:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi lưu thông tin!",
        });
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        previewImage.value = URL.createObjectURL(file);
      }
    };

    const saveImage = async () => {
      if (!userId.value || !previewImage.value) {
        console.log("Không thể upload avatar: user_id hoặc ảnh không hợp lệ");
        return;
      }

      const fileInput = document.querySelector(".file-input");
      const file = fileInput.files[0];
      if (!file) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Vui lòng chọn một file ảnh!",
        });
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("user_id", userId.value);

      try {
        const response = await apiUpdateAvatar(formData);
        if (response.status === 200 && response.data.err === 0) {
          const newAvatarUrl = response.data.data.avatar_path || previewImage.value;
          avatarSrc.value = newAvatarUrl;
          avatarStore.updateAvatar(newAvatarUrl); // Cập nhật avatar trong store
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Ảnh đại diện đã được cập nhật!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Lỗi khi upload avatar:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi cập nhật ảnh đại diện!",
        });
      }
      showImagePopup.value = false;
      previewImage.value = null;
    };

    const savePassword = async () => {
      if (!userId.value || !email.value || !oldPassword.value || !newPassword.value) {
        Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Vui lòng điền đầy đủ thông tin!",
        });
        return;
      }
      try {
        const response = await apiChangePassword({
          email: email.value,
          old_pass_word: oldPassword.value,
          new_pass_word: newPassword.value,
        });
        if (response.status === 200 && response.data.err === 0) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Mật khẩu đã được thay đổi!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Lỗi: " + response.data.msg,
          });
        }
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi thay đổi mật khẩu!",
        });
      }
      showPasswordPopup.value = false;
      oldPassword.value = "";
      newPassword.value = "";
    };

    return {
      userInfo,
      email,
      avatarSrc,
      showImagePopup,
      previewImage,
      showPasswordPopup,
      oldPassword,
      newPassword,
      saveChanges,
      handleImageChange,
      saveImage,
      savePassword,
    };
  },
};
</script>

<style scoped>
.profile-info-content {
  padding: 20px;
}

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
  flex-grow: 1;
}

.change-password-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.change-password-btn:hover {
  background-color: #0056b3;
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

.form-group p {
  font-size: 14px;
  color: #666;
  margin: 0;
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