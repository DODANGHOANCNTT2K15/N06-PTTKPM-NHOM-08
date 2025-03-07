import axiosConfig from "../../axiosConfig";

// lấy ra gợi ý tìm kiếm
export const apiSearchBookSuggestions = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/search/suggestion',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})

// lấy ra kết quả tìm kiếm
export const apiSearchBooks = (payload) => new Promise((resolve, reject) => {
    try {
        const response = axiosConfig({
            method: 'post',
            url: 'api/v1/search/books',
            data: payload
        })
        resolve(response)
    } catch (error) {
        reject(error)
    }
})