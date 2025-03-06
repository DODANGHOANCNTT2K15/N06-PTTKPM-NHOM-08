import axiosConfig from "../../axiosConfig";

// lấy thông tin giỏ hàng của khách hàng
export const apiGetCartByUserId = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/userid',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// Thêm vào giỏ hàng
export const apiAddToCart = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// Thêm vào giỏ hàng
export const apiUpdateCartItem = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/cart/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// Thêm vào giỏ hàng
export const apiGetCountProductOfCart = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/cart/count',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

