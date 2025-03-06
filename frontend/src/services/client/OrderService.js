import axiosConfig from "../../axiosConfig";

// lấy thông tin giỏ hàng của khách hàng
export const apiGetOrderByUserId = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/order/get',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// Thêm vào giỏ hàng
export const addOrderService = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/order/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
