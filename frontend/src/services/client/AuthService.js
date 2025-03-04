import axiosConfig from "../../axiosConfig";

// đăng nhập
export const apiLogin = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1//auth/login',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// đăng ký
export const apiRegister = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1//auth/register', 
            data: payload,
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});

// quên mật khẩu
export const apiForgotPass = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/account/forgot',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

