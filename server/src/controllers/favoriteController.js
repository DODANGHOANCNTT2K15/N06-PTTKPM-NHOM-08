import * as favoriteService from '../services/favoriteService';

// Lấy số lượng sách yêu thích
export const getFavoriteCountController = async (req, res) => {
    const { user_id } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await favoriteService.getFavoriteCountService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Thêm sách vào danh sách yêu thích
export const addToFavoriteController = async (req, res) => {
    const { user_id, book_id } = req.body;
    try {
        if (!user_id || !book_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await favoriteService.addToFavoriteService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Lấy danh sách sách yêu thích
export const getFavoritesController = async (req, res) => {
    const { user_id } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu user_id."
            });
        }
        const rs = await favoriteService.getFavoritesService(user_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Cập nhật sách yêu thích (chỉ ví dụ, có thể không cần nếu không có trường cần cập nhật)
// export const updateFavoriteController = async (req, res) => {
//     const { favorite_id } = req.body;
//     try {
//         if (!favorite_id) {
//             return res.status(400).json({
//                 err: 1,
//                 msg: "Thiếu dữ liệu đầu vào."
//             });
//         }
//         const rs = await favoriteService.updateFavoriteService(req.body);
//         return res.status(200).json(rs);
//     } catch (error) {
//         return res.status(500).json({
//             err: 1,
//             msg: "Lỗi server.",
//             error: error.message,
//         });
//     }
// };

// Xóa sách khỏi danh sách yêu thích
export const deleteFavoriteItemController = async (req, res) => {
    const { favorite_id } = req.body;
    try {
        if (!favorite_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await favoriteService.deleteFavoriteItemService({ favorite_id });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};