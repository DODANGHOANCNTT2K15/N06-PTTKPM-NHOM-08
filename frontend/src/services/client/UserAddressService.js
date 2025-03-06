import axiosConfig from "../../axiosConfig";

// lấy thông tin khách hàng
export const apiGetCustomerInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/customer/id',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// thêm thông tin khách hàng
export const apiAddCustomerInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/customer/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})


// update thông tin khách hàng
export const apiUpdateCustomerInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/customer/update',
            data: payload,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa thông tin khách hàng
export const apiDeleteCustomerInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/customer/delete',
            data: payload,
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})


