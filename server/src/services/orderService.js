import db from "../models";

// lấy ra toàn bộ đơn hàng
export const getAllOrderService = (user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const orders = await db.Order.findAll({
                include: [
                    {
                        model: db.OrderDetail, 
                        as: 'order_details',
                        attributes: ['book_id', 'quantity', 'price'], 
                        include: [
                            {
                                model: db.Book, 
                                as: 'book'
                            },
                        ]
                    },
                    {
                        model: db.Customer, 
                        as: 'customer'
                    }
                ]
            });

            if (!orders.length) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng nào.",
                });
            }

            return resolve({
                err: 0,
                msg: "Tìm thấy đơn hàng.",
                data: orders,
            });
        } catch (error) {
            console.error("Lỗi tại getAllOrderByUserService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi tìm kiếm đơn hàng.",
                error: error.message,
            });
        }
    });
// update status
export const updateOrderStatusService = (order_id, status) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm đơn hàng theo order_id
            const order = await db.Order.findOne({
                where: { order_id }
            });

            if (!order) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng.",
                });
            }

            // Cập nhật trạng thái đơn hàng
            await order.update({ status: status });

            return resolve({
                err: 0,
                msg: "Cập nhật trạng thái đơn hàng thành công.",
                data: { order_id, status }
            });
        } catch (error) {
            console.error("Lỗi tại updateOrderStatusService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi cập nhật trạng thái đơn hàng.",
                error: error.message,
            });
        }
    });


// lấy thông tin theo người dùng
export const getAllOrderByUserService = (user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            // 🔹 Tìm customer_id dựa trên user_id
            const customer = await db.Customer.findOne({
                where: { user_id },
                attributes: ['customer_id'] // Chỉ lấy trường customer_id
            });

            if (!customer) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy khách hàng.",
                });
            }

            // 🔹 Sau khi có customer_id, lấy danh sách order kèm theo book
            const orders = await db.Order.findAll({
                where: { customer_id: customer.customer_id },
                include: [
                    {
                        model: db.OrderDetail, 
                        as: 'order_details',
                        attributes: ['book_id', 'quantity', 'price'], 
                        include: [
                            {
                                model: db.Book, 
                                as: 'book'
                            }
                        ]
                    }
                ]
            });

            if (!orders.length) {
                return resolve({
                    err: 1,
                    msg: "Không tìm thấy đơn hàng nào.",
                });
            }

            return resolve({
                err: 0,
                msg: "Tìm thấy đơn hàng.",
                data: orders,
            });
        } catch (error) {
            console.error("Lỗi tại getAllOrderByUserService: ", error);
            return reject({
                err: 1,
                msg: "Lỗi khi tìm kiếm đơn hàng.",
                error: error.message,
            });
        }
    });




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

// Thêm đơn hàng mới kèm chi tiết đơn hàng và xóa khỏi giỏ hàng
export const addOrderService = ({
    user_id,
    customer_id,
    order_date,
    delivery_date,
    delivery_price,
    total_price,
    discount_id, // Thêm discount_id vào tham số đầu vào
    payment_method_id,
    payment_status,
    order_details,
}) =>
    new Promise(async (resolve, reject) => {
        const transaction = await db.sequelize.transaction();
        try {
            // Thêm đơn hàng
            const newOrder = await db.Order.create(
                {
                    customer_id,
                    order_date,
                    delivery_date,
                    delivery_price: delivery_price || 0,
                    total_price: Math.ceil(total_price), // Làm tròn tổng giá trị
                    discount_id: discount_id || null, // Thêm discount_id (nếu có)
                    status: 0, // Trạng thái mặc định
                    payment_method_id,
                    payment_status: payment_status || 0,
                },
                { transaction }
            );

            // Kiểm tra và thêm danh sách chi tiết đơn hàng
            if (!order_details || order_details.length === 0) {
                throw new Error("Không có chi tiết đơn hàng để thêm.");
            }

            const orderDetailsData = order_details.map((detail) => {
                if (!detail.book_id || !detail.quantity || !detail.price) {
                    throw new Error("Dữ liệu chi tiết đơn hàng không hợp lệ.");
                }

                return {
                    order_id: newOrder.order_id,
                    book_id: detail.book_id,
                    quantity: detail.quantity,
                    price: detail.price,
                };
            });

            await db.OrderDetail.bulkCreate(orderDetailsData, {
                transaction,
                validate: true, // Xác thực dữ liệu trước khi thêm
            });

            // Xóa các sản phẩm khỏi giỏ hàng sau khi thêm đơn hàng thành công
            const bookIds = order_details.map((detail) => detail.book_id);
            const cartDeleteResult = await db.Cart.destroy({
                where: {
                    user_id: user_id,
                    book_id: {
                        [db.Sequelize.Op.in]: bookIds,
                    },
                },
                transaction,
            });

            // Commit transaction
            await transaction.commit();
            // Lấy số lượng sản phẩm còn lại trong giỏ hàng
            const totalProductTypes = await db.Cart.count({
                where: { user_id },
                distinct: true,
                col: 'book_id',
            });

            return resolve({
                err: 0,
                msg: "Thêm đơn hàng thành công và đã xóa sản phẩm khỏi giỏ hàng.",
                data: {
                    order: newOrder,
                    details: orderDetailsData,
                    count: totalProductTypes,
                },
            });
        } catch (error) {
            await transaction.rollback();
            console.error("Lỗi tại addOrderService: ", error);
            return reject({
                err: 1,
                msg: error.message || "Lỗi khi thêm đơn hàng.",
                error: error.stack || error.message,
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
            const updated = await db.Order.update(
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
            const deleted = await db.Order.destroy({
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