import db from "../models";

// Lấy thông tin chi tiết đơn hàng
export const getOrderDetailService = (order_detail_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const orderDetail = await db.OrderDetails.findOne({
                where: { order_detail_id },
                attributes: ["order_detail_id", "order_id", "book_id", "quantity", "price"],
            });

            if (!orderDetail) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy chi tiết đơn hàng.",
                });
            }

            return resolve({
                err: 0,
                msg: "Tìm thấy chi tiết đơn hàng.",
                data: orderDetail,
            });
        } catch (error) {
            console.error("Lỗi tại getOrderDetailService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi tìm kiếm chi tiết đơn hàng.",
                error: error.message,
            });
        }
    });

// Thêm chi tiết đơn hàng mới
export const addOrderDetailService = ({ order_id, book_id, quantity, price }) =>
    new Promise(async (resolve, reject) => {
        try {
            const newOrderDetail = await db.OrderDetails.create({
                order_id,
                book_id,
                quantity,
                price,
            });
            return resolve({
                err: 0,
                msg: "Thêm chi tiết đơn hàng thành công.",
                data: newOrderDetail,
            });
        } catch (error) {
            console.error("Lỗi tại addOrderDetailService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi thêm chi tiết đơn hàng.",
                error: error.message,
            });
        }
    });

// Cập nhật thông tin chi tiết đơn hàng
export const updateOrderDetailService = ({ order_detail_id, order_id, book_id, quantity, price }) =>
    new Promise(async (resolve, reject) => {
        try {
            const updated = await db.OrderDetails.update(
                {
                    order_id,
                    book_id,
                    quantity,
                    price,
                },
                {
                    where: { order_detail_id },
                }
            );

            if (updated[0] === 0) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy chi tiết đơn hàng để cập nhật.",
                });
            }

            return resolve({
                err: 0,
                msg: "Cập nhật chi tiết đơn hàng thành công.",
            });
        } catch (error) {
            console.error("Lỗi tại updateOrderDetailService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi cập nhật chi tiết đơn hàng.",
                error: error.message,
            });
        }
    });

// Xóa chi tiết đơn hàng
export const deleteOrderDetailService = (order_detail_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const deleted = await db.OrderDetails.destroy({
                where: { order_detail_id },
            });

            if (!deleted) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy chi tiết đơn hàng để xóa.",
                });
            }

            return resolve({
                err: 0,
                msg: "Xóa chi tiết đơn hàng thành công.",
            });
        } catch (error) {
            console.error("Lỗi tại deleteOrderDetailService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi xóa chi tiết đơn hàng.",
                error: error.message,
            });
        }
    });