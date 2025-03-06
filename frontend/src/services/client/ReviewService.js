import axiosConfig from "../../axiosConfig";

// tạo review
export const apiAddReview = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/review/add',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// xóa commnet theo id
export const apiDeleteReview = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/review/delete',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

