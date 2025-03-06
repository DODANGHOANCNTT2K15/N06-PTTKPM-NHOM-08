import axiosConfig from "../../axiosConfig";

// lấy thông tin giỏ hàng của khách hàng
export const apiGetOrderByUserId = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/order/userid',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// đặt hàng
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

// xóa hàng
export const apiDeleteOrderService = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/order/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
