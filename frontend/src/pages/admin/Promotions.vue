<template>
<div class="promotions-page">
    <h1>Quản lý Khuyến mại</h1>
    <div class="promotion-actions">
    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên khuyến mại..." class="search-input" />
    <button @click="showAddPromotionPopup = true" class="add-button">
        <i class="fas fa-plus"></i> Thêm Khuyến mại
    </button>
    </div>
    <div class="promotion-table">
    <table>
        <thead>
        <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th @click="sort('id')">STT <i :class="getSortIcon('id')"></i></th>
            <th @click="sort('name')">Tên Khuyến mại <i :class="getSortIcon('name')"></i></th>
            <th @click="sort('discount')">Phần trăm giảm <i :class="getSortIcon('discount')"></i></th>
            <th>Hành động</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="promotion in filteredAndSortedPromotions" :key="promotion.id">
            <td><input type="checkbox" v-model="selectedPromotions" :value="promotion.id" /></td>
            <td>{{ promotion.id }}</td>
            <td>{{ promotion.name }}</td>
            <td>{{ promotion.discount }}%</td>
            <td>
            <button @click="editPromotion(promotion.id)" class="action-btn edit-btn">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button @click="deletePromotion(promotion.id)" class="action-btn delete-btn">
                <i class="fas fa-trash"></i>
            </button>
            </td>
        </tr>
        </tbody>
    </table>
    <div class="pagination">
        <span>Hiển thị trang {{ currentPage }} / {{ totalPages }} - {{ filteredAndSortedPromotions.length }} kết quả</span>
        <div>
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
            <i class="fas fa-chevron-right"></i>
        </button>
        </div>
    </div>
    </div>

    <!-- Popup Thêm Khuyến mại -->
    <div v-if="showAddPromotionPopup" class="modal">
    <div class="modal-content">
        <h2>{{ editingPromotion ? 'Sửa Khuyến mại' : 'Thêm Khuyến mại' }}</h2>
        <form @submit.prevent="savePromotion">
        <div class="form-group">
            <label>Tên Khuyến mại:</label>
            <input v-model="promotionForm.name" type="text" required />
        </div>
        <div class="form-group">
            <label>Phần trăm giảm (%):</label>
            <input v-model.number="promotionForm.discount" type="number" min="1" max="100" required />
        </div>
        <div class="modal-actions">
            <button type="submit">{{ editingPromotion ? 'Cập nhật' : 'Lưu' }}</button>
            <button @click="showAddPromotionPopup = false">Hủy</button>
        </div>
        </form>
    </div>
    </div>
</div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

export default {
name: 'PromotionsPage',
setup() {
    // Dữ liệu mẫu cho danh sách khuyến mại
    const promotions = ref([
    { id: 1, name: 'Khuyến mãi Tết', discount: 20 },
    { id: 2, name: 'Giảm giá hè', discount: 15 },
    { id: 3, name: 'Black Friday', discount: 30 },
    ]);

    const searchQuery = ref('');
    const sortKey = ref('');
    const sortOrder = ref('asc');
    const showAddPromotionPopup = ref(false);
    const editingPromotion = ref(null);
    const promotionForm = ref({ name: '', discount: 0 });
    const selectedPromotions = ref([]); // Danh sách ID khuyến mại được chọn
    const selectAll = ref(false); // Checkbox chọn tất cả
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const fetchPromotions = () => {
    // Trong thực tế, gọi API để lấy danh sách khuyến mại
    // Ví dụ: await apiGetPromotions();
    };

    const savePromotion = () => {
    if (editingPromotion.value) {
        // Cập nhật khuyến mại
        const index = promotions.value.findIndex(p => p.id === editingPromotion.value.id);
        if (index !== -1) {
        promotions.value[index] = { ...editingPromotion.value, ...promotionForm.value };
        }
    } else {
        // Thêm mới khuyến mại
        const newPromotion = {
        id: Date.now(), // ID tạm thời, trong thực tế dùng API để tạo ID
        ...promotionForm.value,
        };
        promotions.value.push(newPromotion);
    }
    showAddPromotionPopup.value = false;
    promotionForm.value = { name: '', discount: 0 };
    editingPromotion.value = null;
    };

    const editPromotion = (id) => {
    const promotion = promotions.value.find(p => p.id === id);
    editingPromotion.value = { ...promotion };
    promotionForm.value = { name: promotion.name, discount: promotion.discount };
    showAddPromotionPopup.value = true;
    };

    const deletePromotion = (id) => {
    if (confirm('Bạn có chắc muốn xóa khuyến mại này?')) {
        promotions.value = promotions.value.filter(p => p.id !== id);
        selectedPromotions.value = selectedPromotions.value.filter(sid => sid !== id);
    }
    };

    const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedPromotions.value = promotions.value.map(p => p.id);
    } else {
        selectedPromotions.value = [];
    }
    };

    const deleteSelectedPromotions = () => {
    if (selectedPromotions.value.length && confirm('Bạn có chắc muốn xóa các khuyến mại đã chọn?')) {
        promotions.value = promotions.value.filter(p => !selectedPromotions.value.includes(p.id));
        selectedPromotions.value = [];
        selectAll.value = false;
    }
    };

    const filteredAndSortedPromotions = computed(() => {
    let result = [...promotions.value];

    if (searchQuery.value) {
        result = result.filter(promotion =>
        promotion.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    if (sortKey.value) {
        result.sort((a, b) => {
        const valueA = a[sortKey.value];
        const valueB = b[sortKey.value];
        if (sortOrder.value === 'asc') {
            return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
        } else {
            return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        }
        });
    }

    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return result.slice(start, end);
    });

    const totalPages = computed(() => {
    return Math.ceil(promotions.value.length / itemsPerPage.value);
    });

    const sort = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
    };

    const getSortIcon = (key) => {
    if (sortKey.value === key) {
        return sortOrder.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }
    return 'fas fa-sort';
    };

    const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
    };

    onMounted(fetchPromotions);

    return {
    promotions,
    searchQuery,
    showAddPromotionPopup,
    editingPromotion,
    promotionForm,
    selectedPromotions,
    selectAll,
    savePromotion,
    editPromotion,
    deletePromotion,
    toggleSelectAll,
    deleteSelectedPromotions,
    filteredAndSortedPromotions,
    sort,
    getSortIcon,
    currentPage,
    totalPages,
    prevPage,
    nextPage,
    };
},
};
</script>

<style scoped>
.promotions-page {
background-color: white;
padding: 20px;
border-radius: 8px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.promotions-page h1 {
font-size: 24px;
color: #2c3e50;
margin-bottom: 20px;
}

.promotion-actions {
margin-bottom: 20px;
display: flex;
justify-content: space-between;
align-items: center;
}

.search-input {
padding: 8px 16px;
border: 1px solid #ccc;
border-radius: 20px;
font-size: 14px;
width: 250px;
background-color: #f8f9fa;
color: #495057;
transition: border-color 0.3s ease;
}

.search-input::placeholder {
color: #6c757d;
}

.search-input:focus {
border-color: #007bff;
outline: none;
box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.add-button {
padding: 8px 16px;
background-color: #007bff;
color: white;
border: none;
border-radius: 20px;
cursor: pointer;
font-size: 14px;
display: flex;
align-items: center;
box-shadow: 0 2px 5px rgba(0, 123, 255, 0.2);
}

.add-button:hover {
background-color: #0056b3;
}

.add-button i {
margin-right: 5px;
}

.promotion-table {
overflow-x: auto;
background-color: white;
border-radius: 8px;
box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.promotion-table table {
width: 100%;
border-collapse: collapse;
margin-bottom: 0;
}

.promotion-table th,
.promotion-table td {
padding: 12px 16px;
text-align: left;
border-bottom: 1px solid #e9ecef;
font-size: 14px;
color: #495057;
}

.promotion-table th {
background-color: #f8f9fa;
color: #343a40;
font-weight: 600;
position: sticky;
top: 0;
z-index: 1;
}

.promotion-table th i {
margin-left: 5px;
color: #6c757d;
cursor: pointer;
}

.promotion-table td {
background-color: #ffffff;
}

.promotion-table button.action-btn {
border: none;
background: none;
cursor: pointer;
padding: 5px;
margin-right: 5px;
border-radius: 3px;
transition: opacity 0.3s ease;
}

.promotion-table button.action-btn:hover {
opacity: 0.8;
}

.promotion-table .edit-btn i {
color: #007bff;
font-size: 16px;
}

.promotion-table .delete-btn i {
color: #dc3545;
font-size: 16px;
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
border-radius: 10px;
width: 400px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
border: 1px solid #ddd;
}

.modal-content h2 {
font-size: 20px;
color: #2c3e50;
margin-bottom: 15px;
text-align: center;
}

.form-group {
margin-bottom: 15px;
}

.form-group label {
display: block;
margin-bottom: 5px;
font-size: 14px;
color: #2c3e50;
font-weight: 500;
}

.form-group input {
width: 100%;
padding: 8px 12px;
border: 1px solid #ddd;
border-radius: 5px;
font-size: 14px;
background-color: #f9f9f9;
transition: border-color 0.3s ease;
}

.form-group input:focus {
border-color: #3498db;
outline: none;
}

.modal-actions {
display: flex;
justify-content: space-between;
margin-top: 20px;
}

.modal-actions button {
padding: 10px 20px;
border: none;
border-radius: 5px;
cursor: pointer;
font-size: 14px;
font-weight: 500;
transition: background-color 0.3s ease;
}

.modal-actions button:first-child {
background-color: #27ae60;
color: white;
}

.modal-actions button:first-child:hover {
background-color: #219653;
}

.modal-actions button:last-child {
background-color: #e74c3c;
color: white;
}

.modal-actions button:last-child:hover {
background-color: #c0392b;
}

/* Phân trang */
.pagination {
padding: 10px 16px;
display: flex;
justify-content: space-between;
align-items: center;
background-color: #f8f9fa;
border-top: 1px solid #e9ecef;
border-radius: 0 0 8px 8px;
font-size: 14px;
color: #495057;
}

.pagination-btn {
padding: 6px 12px;
border: none;
background-color: #007bff;
color: white;
border-radius: 20px;
cursor: pointer;
margin-left: 10px;
transition: background-color 0.3s ease;
}

.pagination-btn:disabled {
background-color: #6c757d;
cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
background-color: #0056b3;
}
</style>