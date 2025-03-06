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

