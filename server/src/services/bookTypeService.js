import db from "../models"

export const addBookTypeService = async ({ name, description }) => {
    try {
        // Thêm dữ liệu vào bảng
        const newBookType = await db.BookType.create({
            name,
            description: description.trim() || null,
        });

        return {
            err: 0,
            msg: 'Thêm loại sách thành công!',
            data: newBookType,
        };
    } catch (error) {
        console.error('Lỗi khi thêm loại sách:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};

// chinh sửa loại sách 
export const updateBookTypeService = async ({ id, name, description }) => {
    try {
        // Tìm bản ghi cần sửa
        const bookType = await db.BookType.findOne({
            where: { book_type_id: id },
        });

        if (!bookType) {
            return {
                err: 2,
                msg: 'Không tìm thấy loại sách tương ứng!',
            };
        }

        // Cập nhật dữ liệu
        await bookType.update({ name, description });

        return {
            err: 0,
            msg: 'Cập nhật loại sách thành công!',
            data: bookType,
        };
    } catch (error) {
        console.error('Lỗi khi cập nhật loại sách:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};


// xóa loại sách
export const deleteBookTypeService = async ({ id }) => {
    try {
        // Tìm bản ghi cần xóa
        const bookType = await db.BookType.findOne({
            where: { book_type_id: id },
        });

        if (!bookType) {
            return {
                err: 2,
                msg: 'Không tìm thấy loại sách tương ứng!',
            };
        }

        // Xóa bản ghi
        await bookType.destroy();

        return {
            err: 0,
            msg: 'Xóa loại sách thành công!',
        };
    } catch (error) {
        console.error('Lỗi khi xóa loại sách:', error);
        return {
            err: 2,
            msg: 'Lỗi server!',
            error: error.message,
        };
    }
};
