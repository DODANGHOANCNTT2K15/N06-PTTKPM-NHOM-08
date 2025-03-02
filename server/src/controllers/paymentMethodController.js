import * as paymentMethodService from "../services/paymentMethodService";

// Lấy thông tin phương thức thanh toán
export const getPaymentMethodController = async (req, res) => {
    const { payment_method_id } = req.body;
    try {
        if (!payment_method_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu payment_method_id.",
            });
        }
        const rs = await paymentMethodService.getPaymentMethodService(payment_method_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Thêm phương thức thanh toán
export const addPaymentMethodController = async (req, res) => {
    const { name, description } = req.body;

    try {
        if (!name || !description) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào bắt buộc!',
            });
        }

        const rs = await paymentMethodService.addPaymentMethodService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in addPaymentMethodController:', error);
        return res.status(500).json({
            err: 1,
            msg: 'Lỗi server.',
            error: error.message,
        });
    }
};

// Cập nhật phương thức thanh toán
export const updatePaymentMethodController = async (req, res) => {
    const { payment_method_id, name, description } = req.body;

    try {
        if (!payment_method_id || (!name && !description)) {
            return res.status(400).json({
                err: 1,
                msg: 'Không có dữ liệu cần cập nhật!',
            });
        }

        const rs = await paymentMethodService.updatePaymentMethodService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in updatePaymentMethodController:', error);
        return res.status(500).json({
            err: 1,
            msg: 'Lỗi server.',
            error: error.message,
        });
    }
};

// Xóa phương thức thanh toán
export const deletePaymentMethodController = async (req, res) => {
    const { payment_method_id } = req.body;

    try {
        if (!payment_method_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu payment_method_id!',
            });
        }

        const rs = await paymentMethodService.deletePaymentMethodService(payment_method_id);
        return res.status(200).json(rs);
    } catch (error) {
        console.error('Error in deletePaymentMethodController:', error);
        return res.status(500).json({
            err: 1,
            msg: 'Lỗi server.',
            error: error.message,
        });
    }
};