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

// thêm mới giảm giá
export const apiAddDiscount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/discount/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// sửa giảm giá
export const apiEditDiscount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/discount/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa giảm giá 
export const apiDeleteDiscount = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/discount/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
