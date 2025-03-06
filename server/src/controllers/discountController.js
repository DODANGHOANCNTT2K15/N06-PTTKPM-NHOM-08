import { getAllDiscountsService, addDiscountService, updateDiscountService, deleteDiscountService } from "../services/discountService";

// Lấy toàn bộ danh sách giảm giá
export const getAllDiscountsController = async (req, res) => {
    try {
        const response = await getAllDiscountsService();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

// Thêm mới giảm giá
export const addDiscountController = async (req, res) => {
    const { discount_name, percent_discount } = req.body;

    if (!discount_name || percent_discount === undefined) {
        return res.status(400).json({
            err: 2,
            msg: 'Thiếu thông tin bắt buộc (discount_name hoặc percent_discount)!',
        });
    }

    try {
        const response = await addDiscountService({ discount_name, percent_discount });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

// Cập nhật giảm giá
export const updateDiscountController = async (req, res) => {
    const { discount_id, discount_name, percent_discount } = req.body;

    if (!discount_id || !discount_name || percent_discount === undefined) {
        return res.status(400).json({
            err: 2,
            msg: 'Thiếu thông tin bắt buộc (discount_id, discount_name hoặc percent_discount)!',
        });
    }

    try {
        const response = await updateDiscountService({ discount_id, discount_name, percent_discount });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};

// Xóa giảm giá
export const deleteDiscountController = async (req, res) => {
    const { discount_id } = req.body;

    if (!discount_id) {
        return res.status(400).json({
            err: 2,
            msg: 'Thiếu thông tin discount_id!',
        });
    }

    try {
        const response = await deleteDiscountService({ discount_id });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        });
    }
};