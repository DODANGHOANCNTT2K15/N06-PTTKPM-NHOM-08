import axiosConfig from "../../axiosConfig";

// Lấy thông tin giỏ hàng của khách hàng
export const apiGetCartByUserId = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/userid',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Thêm vào giỏ hàng
export const apiAddToCart = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/add',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Cập nhật sản phẩm trong giỏ hàng
export const apiUpdateCartItem = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/cart/update',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Lấy số lượng sản phẩm trong giỏ hàng
export const apiGetCountProductOfCart = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/count',
            data: payload
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// Xóa sản phẩm khỏi giỏ hàng
export const apiDeleteCartItem = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/cart/delete',
            data: payload // Payload chứa cart_id
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});