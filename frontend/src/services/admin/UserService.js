import axiosConfig from "../../axiosConfig";

// lấy thông tin
export const apiGetAllUsers = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/account',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// tạo tài khoản
export const apiAddUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/auth/register',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// sửa người dùng
export const apiEditUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/account/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa
export const apiDeleteUser = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/account/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// đổi mật khẩu
export const apiChangePassword = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/account/change',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})