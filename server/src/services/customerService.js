import db from "../models"

// lấy thông tin khách hàng
export const getCustomerService = (customer_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const customer = await db.Customers.findOne({
                where: { customer_id },
                attributes: ['customer_id', 'full_name', 'dob', 'gender', 'address', 'phone', 'user_id'],
            });

            if (!customer) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy khách hàng.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Tìm thấy khách hàng.',
                data: customer,
            });
        } catch (error) {
            console.error('Lỗi tại getCustomerService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi tìm kiếm khách hàng.',
                error: error.message,
            });
        }
    });

// thêm thông tin khách hàng
export const addCustomerService = ({ full_name, dob, gender, address, phone, user_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const newCustomer = await db.Customers.create({ full_name, dob, gender, address, phone, user_id });
            return resolve({
                err: 0,
                msg: 'Thêm khách hàng thành công.',
                data: newCustomer,
            });
        } catch (error) {
            console.error('Lỗi tại addCustomerService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm khách hàng.',
                error: error.message,
            });
        }
    });

// sửa thông tin khách hàng
export const updateCustomerService = ({ customer_id, full_name, dob, gender, address, phone, user_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const updated = await db.Customers.update({full_name, dob, gender, address, phone, user_id}, {
                where: { customer_id },
            });

            if (updated[0] === 0) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy khách hàng để cập nhật.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Cập nhật khách hàng thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại updateCustomerService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật khách hàng.',
                error: error.message,
            });
        }
    });


// xóa thông tin khách hàng
export const deleteCustomerService = (customer_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const deleted = await db.Customers.destroy({
                where: { customer_id },
            });

            if (!deleted) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy khách hàng để xóa.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Xóa khách hàng thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại deleteCustomerService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa khách hàng.',
                error: error.message,
            });
        }
    });
