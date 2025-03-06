import axiosConfig from "../../axiosConfig";

// Thêm sách vào danh sách yêu thích
export const apiAddToFavorite = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: '/api/v1/favorite/add',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Xóa sách khỏi danh sách yêu thích
export const apiDeleteFavorite = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: '/api/v1/favorite/delete',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Lấy danh sách yêu thích của người dùng
export const apiGetFavorites = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: '/api/v1/favorite/userid',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});