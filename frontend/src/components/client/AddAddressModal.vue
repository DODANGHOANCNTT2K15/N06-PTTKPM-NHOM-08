<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Thêm địa chỉ mới</h2>
      <div class="form-group">
        <label>Họ và tên</label>
        <input type="text" v-model="newAddress.full_name" placeholder="Nhập họ và tên" />
      </div>
      <div class="form-group">
        <label>Ngày sinh</label>
        <input type="date" v-model="newAddress.dob" placeholder="Chọn ngày sinh" />
      </div>
      <div class="form-group">
        <label>Giới tính</label>
        <select v-model="newAddress.gender">
          <option value="1">Nam</option>
          <option value="0">Nữ</option>
        </select>
      </div>
      <div class="form-group">
        <label>Địa chỉ</label>
        <input type="text" v-model="newAddress.address" placeholder="Nhập địa chỉ" />
      </div>
      <div class="form-group">
        <label>Số điện thoại</label>
        <input type="text" v-model="newAddress.phone" placeholder="Nhập số điện thoại" />
      </div>
      <div class="modal-actions">
        <button @click="save">Lưu</button>
        <button @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AddAddressModal',
  setup(props, { emit }) {
    const newAddress = ref({
      full_name: '',
      dob: '',
      gender: 1, // Mặc định là Nam (1), bạn có thể thay đổi nếu cần
      address: '',
      phone: '',
    });

    const save = () => {
      emit('save', { ...newAddress.value });
      newAddress.value = { full_name: '', dob: '', gender: 1, address: '', phone: '' }; // Reset form
    };

    return {
      newAddress,
      save,
    };
  },
};
</script>

<style scoped>
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
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
}

.modal-content h2 {
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
}

.modal-actions button:hover {
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.modal-actions button:last-child {
  background-color: #e74c3c;
  color: white;
}
</style>