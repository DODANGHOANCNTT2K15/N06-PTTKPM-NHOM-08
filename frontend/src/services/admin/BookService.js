import axiosConfig from "../../axiosConfig";

// lấy thông tin
export const apiGetAllBooks = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'get',
            url: 'api/v1/book',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

export const apiAddBook = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/book/add', // Sửa endpoint để khớp với server
            data: payload,
            headers: {
                'Content-Type': 'multipart/form-data', // Ghi đè header mặc định
            },
        });
        resolve(response);
    } catch (error) {
        reject(error);
    }
});
// sửa loại sách
export const apiEditBook = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'put',
            url: 'api/v1/book/update',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa 
export const apiDeleteBook = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'delete',
            url: 'api/v1/book/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})
