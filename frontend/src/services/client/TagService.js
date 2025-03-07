import axiosConfig from "../../axiosConfig";

// lấy ra danh mục sách
export const apiGetAllTags = (payload) => new Promise((resolve, reject) => {
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

