import * as cartService from '../services/cartService';

// Thêm sản phẩm vào giỏ hàng
export const addToCartController = async (req, res) => {
    const { user_id, book_id, quantity, all_price } = req.body;
    try {
        if (!user_id || !book_id || !quantity || !all_price) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await cartService.addToCartService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Lấy danh sách giỏ hàng
export const getCartController = async (req, res) => {
    const { user_id } = req.params;
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu user_id."
            });
        }
        const rs = await cartService.getCartService(user_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Cập nhật giỏ hàng
export const updateCartController = async (req, res) => {
    const { cart_id, quantity, all_price } = req.body;
    try {
        if (!cart_id|| !quantity || !all_price) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await cartService.updateCartService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItemController = async (req, res) => {
    const { cart_id } = req.body;
    try {
        if (!cart_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await cartService.deleteCartItemService({ cart_id });
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};
