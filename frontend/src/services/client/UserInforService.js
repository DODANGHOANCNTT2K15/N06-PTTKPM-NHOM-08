import axiosConfig from "../../axiosConfig";

// lấy thông tin tài khoản
export const apiGetUserInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/account/id',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// update avatar
export const apiUpdateAvatar = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/account/avatar',
            data: payload,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// cập nhật thông tin
export const apiUpdateInfor = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/account/update',
            data: payload,
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

