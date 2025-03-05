<template>
    <div class="profile-info-content">
      <h2>Địa chỉ của bạn</h2>
      <div class="address-container">
        <div class="address-add-box" @click="showAddAddressPopup = true">
          <span class="add-icon">+</span>
          <p>Thêm địa chỉ mới</p>
        </div>
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
  
      <AddAddressModal
        v-if="showAddAddressPopup"
        @close="showAddAddressPopup = false"
        @save="saveNewAddress"
      />
      <EditAddressModal
        v-if="showEditAddressPopup"
        :address-data="editAddressData"
        @close="showEditAddressPopup = false"
        @update="updateAddress"
      />
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import AddAddressModal from '@/components/client/AddAddressModal.vue';
  import EditAddressModal from '@/components/client/EditAddressModal.vue';
  
  export default {
    name: 'UserAddress',
    components: {
      AddAddressModal,
      EditAddressModal,
    },
    setup() {
      const showAddAddressPopup = ref(false);
      const showEditAddressPopup = ref(false);
  
      const editAddressData = ref({
        phone: '0335546276',
        address: 'Ba Đình, Hà Nội, ...',
        recipient: 'Đỗ Đăng Hoàn',
      });
  
      const saveNewAddress = (newAddress) => {
        console.log('Địa chỉ mới đã lưu:', newAddress);
        alert('Địa chỉ mới đã được lưu thành công!');
        showAddAddressPopup.value = false;
      };
  
      const updateAddress = (updatedAddress) => {
        console.log('Địa chỉ đã cập nhật:', updatedAddress);
        alert('Địa chỉ đã được cập nhật thành công!');
        showEditAddressPopup.value = false;
      };
  
      const deleteAddress = () => {
        console.log('Địa chỉ đã xóa');
        alert('Địa chỉ hiện tại đã được xóa!');
      };
  
      return {
        showAddAddressPopup,
        showEditAddressPopup,
        editAddressData,
        saveNewAddress,
        updateAddress,
        deleteAddress,
      };
    },
  };
  </script>
  
  <style scoped>
  .profile-info-content h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .address-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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
  }
  
  .address-existing-box {
    width: 300px;
    height: 200px; /* Tăng chiều cao một chút để bố cục thoáng hơn */
    background: linear-gradient(135deg, #ffffff, #f9f9f9); /* Gradient nhẹ */
    border: 1px solid #e0e0e0; /* Viền nhạt hơn */
    border-radius: 15px; /* Bo góc mềm mại hơn */
    padding: 20px; /* Tăng padding */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Bóng đổ nhẹ nhàng */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* Hiệu ứng hover */
  }
  
  .address-existing-box:hover {
    transform: translateY(-5px); /* Nhấc lên khi hover */
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1); /* Bóng đậm hơn */
  }
  
  .address-existing-box h3 {
    font-size: 18px;
    color: #333;
    margin: 0 0 15px 0; /* Khoảng cách dưới tiêu đề */
    font-weight: 600; /* Đậm hơn một chút */
  }
  
  .address-existing-box p {
    font-size: 14px;
    color: #555; /* Màu chữ nhạt hơn cho dễ đọc */
    margin: 8px 0; /* Khoảng cách đều giữa các dòng */
    line-height: 1.4; /* Tăng độ cao dòng */
  }
  
  .address-existing-box p strong {
    color: #333; /* Màu đậm cho nhãn */
    font-weight: 500;
  }
  
  .address-actions {
    display: flex;
    gap: 12px; /* Tăng khoảng cách giữa các nút */
    justify-content: flex-end;
    margin-top: 15px; /* Khoảng cách trên nút */
  }
  
  .edit-btn,
  .delete-btn {
    padding: 6px 18px; /* Tăng kích thước nút */
    border: none;
    border-radius: 8px; /* Bo góc nút mềm hơn */
    cursor: pointer;
    font-size: 13px; /* Chữ nhỏ gọn */
    font-weight: 500;
    transition: background-color 0.3s ease, transform 0.2s ease; /* Hiệu ứng chuyển màu và nhấc lên */
  }
  
  .edit-btn {
    background-color: #007bff;
    color: white;
  }
  
  .edit-btn:hover {
    background-color: #0056b3;
    transform: translateY(-2px); /* Nhấc lên khi hover */
  }
  
  .delete-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
    transform: translateY(-2px); /* Nhấc lên khi hover */
  }
  </style>