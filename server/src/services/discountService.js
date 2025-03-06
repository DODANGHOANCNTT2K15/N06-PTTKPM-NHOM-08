import db from "../models";

// Lấy toàn bộ danh sách giảm giá
export const getAllDiscountsService = () => new Promise(async (resolve, reject) => {
    try {
        const discounts = await db.Discount.findAll({});

        return resolve({
            err: 0,
            msg: discounts.length ? 'Lấy danh sách giảm giá thành công!' : 'Không có giảm giá nào.',
            data: discounts
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách giảm giá:", error);
        return reject({
            err: 1,
            msg: 'Lỗi khi lấy danh sách giảm giá!',
            error: error,
        });
    }
});

// Thêm mới giảm giá
export const addDiscountService = async ({ discount_name, percent_discount }) => {
    try {
        // Thêm dữ liệu vào bảng
        const newDiscount = await db.Discount.create({
            discount_name: discount_name.trim(),
            percent_discount: percent_discount,
        });

        return {
            err: 0,
            msg: 'Thêm giảm giá thành công!',
            data: newDiscount,
        };
    } catch (error) {
        console.error('Lỗi khi thêm giảm giá:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};

// Cập nhật giảm giá
export const updateDiscountService = async ({ discount_id, discount_name, percent_discount }) => {
    try {
        // Tìm bản ghi cần sửa
        const discount = await db.Discount.findOne({
            where: { discount_id: discount_id },
        });

        if (!discount) {
            return {
                err: 2,
                msg: 'Không tìm thấy giảm giá tương ứng!',
            };
        }

        // Cập nhật dữ liệu
        await discount.update({
            discount_name: discount_name.trim(),
            percent_discount: percent_discount,
        });

        return {
            err: 0,
            msg: 'Cập nhật giảm giá thành công!',
            data: discount,
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật giảm giá:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};

// Xóa giảm giá
export const deleteDiscountService = async ({ discount_id }) => {
    try {
        // Tìm bản ghi cần xóa
        const discount = await db.Discount.findOne({
            where: { discount_id: discount_id },
        });

        if (!discount) {
            return {
                err: 2,
                msg: 'Không tìm thấy giảm giá tương ứng!',
            };
        }

        // Xóa bản ghi
        await discount.destroy();

        return {
            err: 0,
            msg: 'Xóa giảm giá thành công!',
        };
    } catch (error) {
        console.error('Lỗi khi xóa giảm giá:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};