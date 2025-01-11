import db from "../models";
import * as cloudinaryService from "./cloudinaryService"

// thêm ảnh cho sách
export const addBookImageService = (book_id, req) =>
    new Promise(async (resolve, reject) => {

        try {
            // Kiểm tra 
            const book = await db.Book.findOne({
                where: { book_id },
            });

            if (!book) {
                return reject({
                    err: 2,
                    msg: 'Sách không tồn tại!',
                });
            }

            // Upload hình ảnh lên Cloudinary
            const uploadResults = await cloudinaryService.uploadMultipleImagesService(req);

            if (!uploadResults || uploadResults.length === 0) {
                return reject({
                    err: 2,
                    msg: 'Lỗi upload lên Cloudinary!',
                });
            }

            // Lưu thông tin hình ảnh vào cơ sở dữ liệu
            await Promise.all(
                uploadResults.map(async (image) => {
                    await db.BookImage.create({
                        book_id: book.book_id,
                        image_public_id: image.image_public_id,
                        image_path: image.image_path,
                    });
                })
            );

            // Trả về kết quả thành công
            resolve({
                err: 0,
                msg: 'Upload hình ảnh thành công!',
                data: {
                    book,
                    images: uploadResults,
                },
            });
        } catch (error) {
            console.error('Lỗi khi thêm sách: ', error);
            reject({
                err: 2,
                msg: 'Đã xảy ra lỗi trong quá trình thêm sách!',
                error: error.message,
            });
        }
    });

//xóa ảnh
export const deleteBookImageService = (book_id, image_public_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const image = await db.BookImage.findOne({ where: { book_id, image_public_id } });

            // Kiểm tra nếu sách không tồn tại
            if (!image) {
                return resolve({
                    err: 0,
                    msg: 'Không tìm thấy ảnh với ID này!',
                });
            }

            await cloudinaryService.deleteImageService(image.image_public_id);
            await image.destroy();

            resolve({
                err: 0,
                msg: 'Xóa ảnh thành công!',
            });

        } catch (error) {
            console.error('Lỗi khi xóa sách:', error);
            reject({
                err: 2,
                msg: 'Đã xảy ra lỗi khi xóa sách!',
                error: error.message,
            });
        }
    });