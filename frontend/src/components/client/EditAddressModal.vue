<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Sửa địa chỉ hiện tại</h2>
      <div class="form-group">
        <label>Họ và tên</label>
        <input
          type="text"
          v-model="localAddress.full_name"
          placeholder="Nhập họ và tên"
        />
      </div>
      <div class="form-group">
        <label>Ngày sinh</label>
        <input
          type="date"
          v-model="localAddress.dob"
          placeholder="Chọn ngày sinh"
        />
      </div>
      <div class="form-group">
        <label>Giới tính</label>
        <select v-model="localAddress.gender">
          <option :value="1">Nam</option>
          <option :value="0">Nữ</option>
        </select>
      </div>
      <div class="form-group">
        <label>Địa chỉ</label>
        <input
          type="text"
          v-model="localAddress.address"
          placeholder="Nhập địa chỉ"
        />
      </div>
      <div class="form-group">
        <label>Số điện thoại</label>
        <input
          type="text"
          v-model="localAddress.phone"
          placeholder="Nhập số điện thoại"
        />
      </div>
      <div class="modal-actions">
        <button @click="update">Cập nhật</button>
        <button @click="$emit('close')">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "EditAddressModal",
  props: {
    addressData: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    // Hàm định dạng ngày thành YYYY-MM-DD
    const formatDateForInput = (date) => {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d.getTime())) return ""; // Kiểm tra nếu ngày không hợp lệ
      return d.toISOString().split("T")[0]; // Trả về định dạng YYYY-MM-DD
    };

    // Khởi tạo localAddress với dữ liệu từ props, định dạng lại dob
    const localAddress = ref({
      full_name: props.addressData.full_name || "",
      dob: formatDateForInput(props.addressData.dob),
      gender: props.addressData.gender || 0,
      address: props.addressData.address || "",
      phone: props.addressData.phone || "",
    });

    // Theo dõi thay đổi từ props.addressData để đồng bộ
    watch(
      () => props.addressData,
      (newVal) => {
        localAddress.value = {
          full_name: newVal.full_name || "",
          dob: formatDateForInput(newVal.dob),
          gender: newVal.gender || 0,
          address: newVal.address || "",
          phone: newVal.phone || "",
        };
      }
    );

    // Hàm cập nhật dữ liệu
    const update = () => {
      emit("update", { ...localAddress.value });
    };

    return {
      localAddress,
      update,
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

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
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
  transition: background-color 0.3s ease;
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