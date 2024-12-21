import * as bookService from "../services/bookService"


export const addBookController = async (req, res) => {
    const { o } = req.body;
    try {
        if (!o) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!'
            });
        }
        const rs = await bookService.addBookService(req.body);
        return res.status(200).json(rs)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi sử lý dữ liệu tại server!'
        });
    }
}
