import * as bookTypeService from '../services/bookTypeService';

//lấy toàn bộ tài khoản
export const getAllBookTypeController = async (req, res) => {
    try {
        const rs = await bookTypeService.getAllBookTypeService();
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in getAllBookTypeController:', error);
        return res.status(500).json(error);
    }
};


// thêm loại sách
export const addBookTypeController = async (req, res) => {
    const { name, tag,  description } = req.body;
    try {
        if (!name || !tag) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!',
            });
        }

        const result = await bookTypeService.addBookTypeService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi tại createBookTypeController:', error);
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

// sửa loại sách
export const updateBookTypeController = async (req, res) => {
    const { book_type_id, name, tag, description } = req.body;
    try {
        if (!book_type_id || (!name && !description && !tag)) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!',
            });
        }

        const result = await bookTypeService.updateBookTypeService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi tại updateBookTypeController:', error);
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

// xóa loại sách
export const deleteBookTypeController = async (req, res) => {
    const { book_type_id } = req.body;
    try {
        if (!book_type_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu ID loại sách cần xóa!',
            });
        }

        const result = await bookTypeService.deleteBookTypeService(req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi tại deleteBookTypeController:', error);
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

