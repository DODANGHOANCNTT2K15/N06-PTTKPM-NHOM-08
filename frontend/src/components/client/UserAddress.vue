<template>
  <div class="profile-info-content">
    <h2>Thông tin giao hàng của bạn</h2>
    <div class="address-container">
      <!-- Box "Thêm mới" luôn hiển thị, nhưng chỉ mở popup khi chưa có customerInfo -->
      <div
        class="address-add-box"
        @click="!customerInfo ? (showAddAddressPopup = true) : null"
      >
        <span class="add-icon">+</span>
        <p>Thêm thông tin giao hàng</p>
      </div>
      <!-- Hiển thị thông tin giao hàng hiện tại nếu có -->
      <div class="address-existing-box" v-if="customerInfo">
        <h3>Thông tin giao hàng hiện tại</h3>
        <p><strong>Họ và tên:</strong> {{ customerInfo.full_name }}</p>
        <p><strong>Ngày sinh:</strong> {{ formatDate(customerInfo.dob) }}</p>
        <p>
          <strong>Giới tính:</strong>
          {{ customerInfo.gender === 1 ? "Nam" : "Nữ" }}
        </p>
        <p><strong>Thông tin:</strong> {{ customerInfo.address }}</p>
        <p><strong>Số điện thoại:</strong> {{ customerInfo.phone }}</p>
        <div class="address-actions">
          <button class="edit-btn" @click="showEditAddressPopup = true">
            Sửa
          </button>
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
      @update="updateCustomerInfor"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  apiGetCustomerInfor,
  apiAddCustomerInfor,
  apiUpdateCustomerInfor,
  apiDeleteCustomerInfor,
} from "@/services/client/UserAddressService";
import AddAddressModal from "@/components/client/AddAddressModal.vue";
import EditAddressModal from "@/components/client/EditAddressModal.vue";

export default {
  name: "UserAddress",
  components: {
    AddAddressModal,
    EditAddressModal,
  },
  setup() {
    const showAddAddressPopup = ref(false);
    const showEditAddressPopup = ref(false);
    const customerInfo = ref(null);
    const userId = ref(null);

    const editAddressData = ref({
      full_name: "",
      dob: "",
      gender: 0, // 1 cho Nam, 0 cho Nữ
      address: "",
      phone: "",
    });

    // Hàm định dạng ngày tháng
    const formatDate = (date) => {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    };

    // Hàm giải mã JWT token để lấy user_id
    const getUserIdFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Không tìm thấy token trong localStorage");
        return null;
      }
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã phần payload của JWT
        console.log(payload.user_id); // Giả định user_id nằm trong payload (tùy backend)
        return payload.user_id || payload.id;
      } catch (error) {
        console.log("Lỗi khi giải mã token:", error);
        return null;
      }
    };

    // Hàm lấy thông tin khách hàng từ API
    const fetchCustomerInfo = async () => {
      try {
        userId.value = getUserIdFromToken();
        if (!userId.value) {
          console.log("Không thể lấy user_id từ token");
          return;
        }

        const response = await apiGetCustomerInfor({ user_id: userId.value });

        if (response.status === 200 && response.data.err === 0) {
          customerInfo.value = {
            full_name: response.data.data.full_name,
            dob: response.data.data.dob,
            gender: response.data.data.gender,
            address: response.data.data.address,
            phone: response.data.data.phone,
          };
          editAddressData.value = { ...customerInfo.value }; // Cập nhật dữ liệu để chỉnh sửa
        } else {
          customerInfo.value = null; // Đặt customerInfo về null nếu không có dữ liệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin khách hàng:", error);
        customerInfo.value = null; // Đặt customerInfo về null nếu có lỗi
      }
    };

    onMounted(() => {
      fetchCustomerInfo();
    });

    const saveNewAddress = async (newAddress) => {
      try {
        // Gọi API để thêm thông tin khách hàng với user_id
        const response = await apiAddCustomerInfor({
          ...newAddress,
          user_id: userId.value,
        });

        if (response.status === 200 && response.data.err === 0) {
          console.log("Thông tin mới đã lưu:", newAddress);
          alert("Thông tin mới đã được lưu thành công!");
          await fetchCustomerInfo(); // Đảm bảo fetchCustomerInfo là async nếu cần
          showAddAddressPopup.value = false;
        } else {
          const errorMessage =
            response.data.msg ||
            "Đã xảy ra lỗi không xác định khi lưu Thông tin!";
          console.error("Lỗi từ API:", errorMessage);
          alert(`Có lỗi xảy ra: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Lỗi khi lưu Thông tin:", error);
        alert("Có lỗi sảy ra. Vui lòng thử lại sau!!!");
      }
    };

    const updateCustomerInfor = async (updatedAddress) => {
      try {
        // Gọi API để thêm thông tin khách hàng với user_id
        const response = await apiUpdateCustomerInfor({
          ...updatedAddress,
          user_id: userId.value,
        });

        if (response.status === 200 && response.data.err === 0) {
          console.log("Thông tin mới đã lưu:", updatedAddress);
          alert("Thông tin mới đã được lưu thành công!");
          await fetchCustomerInfo(); // Đảm bảo fetchCustomerInfo là async nếu cần
          showEditAddressPopup.value = false;
        } else {
          const errorMessage =
            response.data.msg ||
            "Đã xảy ra lỗi không xác định khi lưu Thông tin!";
          console.error("Lỗi từ API:", errorMessage);
          alert(`Có lỗi xảy ra: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Lỗi khi lưu Thông tin:", error);
        alert("Có lỗi sảy ra. Vui lòng thử lại sau!!!");
      }
    };

    const deleteAddress = async () => {
      const confirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa thông tin giao hàng này không?"
      );
      if (!confirmed) {
        return; 
      }

      try {
        const response = await apiDeleteCustomerInfor({
          user_id: userId.value,
        });

        if (response.status === 200 && response.data.err === 0) {
          console.log("Thông tin đã xóa");
          alert("Thông tin hiện tại đã được xóa!");
          fetchCustomerInfo();
        } else {
          const errorMessage =
            response.data.msg ||
            "Đã xảy ra lỗi không xác định khi xóa thông tin!";
          console.error("Lỗi từ API:", errorMessage);
          alert(`Có lỗi xảy ra: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Lỗi khi xóa thông tin:", error);
        alert("Có lỗi xảy ra khi xóa thông tin!");
      }
    };

    return {
      showAddAddressPopup,
      showEditAddressPopup,
      customerInfo,
      editAddressData,
      saveNewAddress,
      updateCustomerInfor,
      deleteAddress,
      formatDate,
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
  position: relative;
  width: 400px;
  height: 200px;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  border: 1px solid #e0e0e0;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.address-existing-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.address-existing-box h3 {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.address-existing-box p {
  font-size: 14px;
  color: #555;
  margin: 8px 0;
  line-height: 1.4;
}

.address-existing-box p strong {
  color: #333;
  font-weight: 500;
}

.address-actions {
  position: absolute;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  top: 80%;
  right: 5%;
}

.edit-btn,
.delete-btn {
  padding: 6px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}
</style>