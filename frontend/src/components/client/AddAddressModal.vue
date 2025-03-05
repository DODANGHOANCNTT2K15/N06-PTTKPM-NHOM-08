<template>
    <div class="modal">
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
        phone: '',
        address: '',
        recipient: '',
      });
  
      const save = () => {
        emit('save', { ...newAddress.value });
        newAddress.value = { phone: '', address: '', recipient: '' }; // Reset form
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
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group input {
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
  
  .modal-actions button:first-child {
    background-color: #007bff;
    color: white;
  }
  
  .modal-actions button:last-child {
    background-color: #e74c3c;
    color: white;
  }
  </style>