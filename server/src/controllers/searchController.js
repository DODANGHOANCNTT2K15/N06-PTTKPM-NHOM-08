import * as searchService from "../services/searchService"

// tìm kiếm gợi ý sản phẩm
export const searchSuggestionController = async (req, res) => {
    const { key } = req.body;
    try {
        if (!key) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await searchService.searchBookSuggestionsService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


// tìm kiếm gợi ý sản phẩm
export const searchController = async (req, res) => {
    const { key } = req.body;
    try {
        if (!key) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await searchService.searchBookService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}