import axiosConfig from "../../axiosConfig";

// lấy toàn bộ sách
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


// lấy sách theo ID
export const apiGetAllBookByID = (payload) => new Promise((resolve, reject) => {
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



