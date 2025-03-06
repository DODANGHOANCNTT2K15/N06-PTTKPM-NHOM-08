import axiosConfig from "../../axiosConfig";

// lấy toàn bộ review theo id sách
export const apiGetAllReviewsOfBook = (payload) => new Promise((resolve, reject) => {
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


// tạo 
export const apiAddReview = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/book/id',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})



