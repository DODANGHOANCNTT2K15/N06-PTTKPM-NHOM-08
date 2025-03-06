import axiosConfig from "../../axiosConfig";

// lấy toàn bộ thông tin order
export const apiGetAllOrderService = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/order',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// hàm update trạng thái đơn hàng
export const apiUpdateStatusOrderService = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/order/status',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// hàm update đơn hàng
export const apiUpdateOrderService = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/order/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// hàm delete đơn hàng
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

