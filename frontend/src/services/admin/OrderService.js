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
            method: 'get',
            url: 'api/v1/order',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

