import axiosConfig from "../../axiosConfig";

// lấy thông tin
export const apiGetAllDiscounts = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/discount',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})