import axiosConfig from "../../axiosConfig";

// lấy thông tin
export const apiGetAllBookTypes = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/booktype',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// thêm mới loại sách
export const apiAddBookType = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/booktype/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// sửa loại sách
export const apiEditBookType = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/booktype/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa 
export const apiDeleteBookType = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/booktype/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
