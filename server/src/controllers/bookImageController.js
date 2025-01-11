//hàm xóa sách
import * as bookImageService from "../services/bookImageService"

// thêm ảnh
export const addBookImageController = async (req, res) => {
    const {
        book_id
    } = req.body;

    try {
        if (!book_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu ID sách để thêm ảnh!',
            });
        }
        const rs = await bookImageService.addBookImageService(book_id, req);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in addBookImageController:', error);
        return res.status(500).json(error);
    }
};

// xóa ảnh
export const deleteBookImageController = async (req, res) => {
    const {
        book_id,
        image_public_id 
    } = req.body;

    try {
        if (!book_id || !image_public_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!',
            });
        }
        const rs = await bookImageService.deleteBookImageService(book_id, image_public_id);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in deleteBookImageController:', error);
        return res.status(500).json(error);
    }
};