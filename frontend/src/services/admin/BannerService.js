import axiosConfig from "../../axiosConfig";

// Lấy danh sách tất cả banner
export const apiGetAllBanners = () => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/banner', // Giả định endpoint GET /banner để lấy tất cả banner
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Thêm banner mới
export const apiAddBanner = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/banner/add',
            data: payload,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Xóa banner
export const apiDeleteBanner = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete', // Dùng POST theo cấu trúc route của bạn
            url: 'api/v1/banner/delete',
            data: payload, // Payload chứa banner_id và banner_public_id
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});