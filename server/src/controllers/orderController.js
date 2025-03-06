import * as orderService from "../services/orderService";

// Lấy thông tin đơn hàng
export const getOrderController = async (req, res) => {
    const { order_id } = req.body;
    try {
        if (!order_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu order_id.",
            });
        }
        const rs = await orderService.getOrderService(order_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// Thêm đơn hàng mới
export const addOrderController = async (req, res) => {
    const {
        customer_id,
        order_date,
        delivery_date,
        delivery_price,
        total_price,
        payment_method_id,
        payment_status,
        order_details
    } = req.body;

    try {
        if (!customer_id || !order_date || !total_price || payment_method_id === undefined || payment_status === undefined || order_details.length < 0) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào bắt buộc!",
            });
        }

        const rs = await orderService.addOrderService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        console.error("Error in addOrderController:", error);
        return res.status(500).json(error);
    }
};

// Cập nhật thông tin đơn hàng
export const updateOrderController = async (req, res) => {
    const {
        order_id,
        customer_id,
        order_date,
        delivery_date,
        delivery_price,
        total_price,
        payment_method_id,
        payment_status,
    } = req.body;

    try {
        if (!order_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu order_id!",
            });
        }

        const rs = await orderService.updateOrderService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        console.error("Error in updateOrderController:", error);
        return res.status(500).json(error);
    }
};

// Xóa đơn hàng
export const deleteOrderController = async (req, res) => {
    const { order_id } = req.body;

    try {
        if (!order_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu order_id!",
            });
        }

        const rs = await orderService.deleteOrderService(order_id);
        return res.status(200).json(rs);
    } catch (error) {
        console.error("Error in deleteOrderController:", error);
        return res.status(500).json(error);
    }
};