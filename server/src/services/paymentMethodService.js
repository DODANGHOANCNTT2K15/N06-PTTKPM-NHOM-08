import db from "../models";

// Lấy thông tin phương thức thanh toán
export const getPaymentMethodService = (payment_method_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const paymentMethod = await db.PaymentMethods.findOne({
                where: { payment_method_id },
                attributes: ['payment_method_id', 'name', 'description'],
            });

            if (!paymentMethod) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy phương thức thanh toán.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Tìm thấy phương thức thanh toán.',
                data: paymentMethod,
            });
        } catch (error) {
            console.error('Lỗi tại getPaymentMethodService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi tìm kiếm phương thức thanh toán.',
                error: error.message,
            });
        }
    });

// Thêm phương thức thanh toán mới
export const addPaymentMethodService = ({ name, description }) =>
    new Promise(async (resolve, reject) => {
        try {
            const newPaymentMethod = await db.PaymentMethods.create({ name, description });
            return resolve({
                err: 0,
                msg: 'Thêm phương thức thanh toán thành công.',
                data: newPaymentMethod,
            });
        } catch (error) {
            console.error('Lỗi tại addPaymentMethodService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm phương thức thanh toán.',
                error: error.message,
            });
        }
    });

// Cập nhật thông tin phương thức thanh toán
export const updatePaymentMethodService = ({ payment_method_id, name, description }) =>
    new Promise(async (resolve, reject) => {
        try {
            const updated = await db.PaymentMethods.update(
                { name, description },
                { where: { payment_method_id } }
            );

            if (updated[0] === 0) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy phương thức thanh toán để cập nhật.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Cập nhật phương thức thanh toán thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại updatePaymentMethodService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật phương thức thanh toán.',
                error: error.message,
            });
        }
    });

// Xóa phương thức thanh toán
export const deletePaymentMethodService = (payment_method_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const deleted = await db.PaymentMethods.destroy({
                where: { payment_method_id },
            });

            if (!deleted) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy phương thức thanh toán để xóa.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Xóa phương thức thanh toán thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại deletePaymentMethodService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa phương thức thanh toán.',
                error: error.message,
            });
        }
    });