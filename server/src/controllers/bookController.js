import * as bookService from "../services/bookService"

//lấy toàn bộ sách
export const getAllBookController = async (req, res) => {
    try {
        const rs = await bookService.getAllBooksService();
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in addBookController:', error);
        return res.status(500).json(error);
    }
};

//lấy sách theo id
export const getBookByIdController = async (req, res) => {
    const { id } = req.body;
    try {
        if(!id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào!"
            })
        }
        const rs = await bookService.getBookByIdService(id);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in addBookController:', error);
        return res.status(500).json(error);
    }
};

// hàm thêm sách
export const addBookController = async (req, res) => {
    const { title, author, publisher, published_date, price, discount_price, stock_quantity, description, book_type_id } = req.body;

    try {
        console.log('req.files in controller:', req.files); // Debug
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
        return res.status(500).json(error);
    }
};

//chỉnh sửa thông tin
export const updateBookController = async (req, res) => {
    const { book_id } = req.body;

    try {
        console.log(req)
        // Kiểm tra nếu không có book_id
        if (!book_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu ID sách để cập nhật!',
            });
        }
        const rs = await bookService.updateBookService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in updateBookController:', error);
        return res.status(500).json(error);
    }
};


//hàm xóa sách
export const deleteBookController = async (req, res) => {
    const {
        book_id,
    } = req.body;

    try {
        // Kiểm tra nếu không có book_id
        if (!book_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu ID sách để xóa!',
            });
        }
        const rs = await bookService.deleteBookService(book_id);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in deleteBookController:', error);
        return res.status(500).json(error);
    }
};