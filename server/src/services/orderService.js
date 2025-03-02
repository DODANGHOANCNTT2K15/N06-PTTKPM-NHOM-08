import db from "../models";

// Lấy thông tin đơn hàng
export const getOrderService = (order_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const order = await db.Orders.findOne({
                where: { order_id },
                attributes: [
                    "order_id",
                    "customer_id",
                    "order_date",
                    "delivery_date",
                    "delivery_price",
                    "total_price",
                    "payment_method_id",
                    "payment_status",
                ],
            });

            if (!order) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng.",
                });
            }

            return resolve({
                err: 0,
                msg: "Tìm thấy đơn hàng.",
                data: order,
            });
        } catch (error) {
            console.error("Lỗi tại getOrderService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi tìm kiếm đơn hàng.",
                error: error.message,
            });
        }
    });

// Thêm đơn hàng mới
export const addOrderService = ({
    customer_id,
    order_date,
    delivery_date,
    delivery_price,
    total_price,
    payment_method_id,
    payment_status,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const newOrder = await db.Orders.create({
                customer_id,
                order_date,
                delivery_date,
                delivery_price,
                total_price,
                payment_method_id,
                payment_status,
            });
            return resolve({
                err: 0,
                msg: "Thêm đơn hàng thành công.",
                data: newOrder,
            });
        } catch (error) {
            console.error("Lỗi tại addOrderService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi thêm đơn hàng.",
                error: error.message,
            });
        }
    });

// Cập nhật thông tin đơn hàng
export const updateOrderService = ({
    order_id,
    customer_id,
    order_date,
    delivery_date,
    delivery_price,
    total_price,
    payment_method_id,
    payment_status,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            const updated = await db.Orders.update(
                {
                    customer_id,
                    order_date,
                    delivery_date,
                    delivery_price,
                    total_price,
                    payment_method_id,
                    payment_status,
                },
                {
                    where: { order_id },
                }
            );

            if (updated[0] === 0) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng để cập nhật.",
                });
            }

            return resolve({
                err: 0,
                msg: "Cập nhật đơn hàng thành công.",
            });
        } catch (error) {
            console.error("Lỗi tại updateOrderService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi cập nhật đơn hàng.",
                error: error.message,
            });
        }
    });

// Xóa đơn hàng
export const deleteOrderService = (order_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const deleted = await db.Orders.destroy({
                where: { order_id },
            });

            if (!deleted) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng để xóa.",
                });
            }

            return resolve({
                err: 0,
                msg: "Xóa đơn hàng thành công.",
            });
        } catch (error) {
            console.error("Lỗi tại deleteOrderService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi xóa đơn hàng.",
                error: error.message,
            });
        }
    });