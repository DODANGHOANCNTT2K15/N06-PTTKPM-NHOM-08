import * as bookService from "../services/bookService"


export const addBookController = async (req, res) => {
    const { title, author, publisher, published_date, price, discount_price, stock_quantity, description, book_type_id } = req.body;

    try {
        // Kiểm tra nếu thiếu dữ liệu bắt buộc
        if (!title || !author || !publisher || !published_date || !price || !stock_quantity || !book_type_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào bắt buộc!'
            });
        }
        const rs = await bookService.addBookService(req);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in addBookController:', error);
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi xử lý dữ liệu tại server!'
        });
    }
};
