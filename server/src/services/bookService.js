import db from "../models";
import * as cloudinaryService from "../services/cloudinaryService"

// hàm lấy toàn bộ sách
export const getAllBooksService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const books = await db.Book.findAll({
                include: [
                    {
                        model: db.BookImage,
                        as: "images",
                        attributes: ['image_public_id', 'image_path'],
                    },
                ],
                order: [['published_date', 'DESC']],
            });

            if (!books) {
                return resolve({
                    err: 0,
                    msg: 'Không có sách nào trong cơ sở dữ liệu!',
                    data: [],
                });
            }

            resolve({
                err: 0,
                msg: 'Lấy danh sách sách thành công!',
                data: books,
            });
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sách: ', error);
            reject({
                err: 1,
                msg: 'Đã xảy ra lỗi khi lấy danh sách sách!',
                error: error.message,
            });
        }
    });

// lấy sách theo id
export const getBookByIdService = (book_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const book = await db.Book.findOne({
                where: { book_id: book_id },
                include: [
                    {
                        model: db.BookImage,
                        as: "images",
                        attributes: ['image_public_id', 'image_path'],
                    },
                    {
                        model: db.Review,
                        as: "reviews",
                    }
                ],
            });

            // Kiểm tra nếu không tìm thấy sách
            if (!book) {
                return resolve({
                    err: 0,
                    msg: 'Không tìm thấy sách với ID này!',
                    data: null,
                });
            }

            // Trả về thông tin sách
            resolve({
                err: 0,
                msg: 'Lấy thông tin sách thành công!',
                data: book,
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin sách: ', error);
            reject({
                err: 1,
                msg: 'Đã xảy ra lỗi khi lấy thông tin sách!',
                error: error.message,
            });
        }
    });


// thêm sách
export const addBookService = (req) =>
    new Promise(async (resolve, reject) => {
        const {
            title,
            author,
            publisher,
            published_date,
            price,
            rating_avg,
            discount_price,
            stock_quantity,
            description,
            book_type_id,
        } = req.body;

        try {
            // Kiểm tra và thêm sách mới
            const [book, created] = await db.Book.findOrCreate({
                where: { title: title.trim() },
                defaults: {
                    title: title.trim(),
                    author: author.trim(),
                    publisher: publisher.trim(),
                    published_date: new Date(published_date),
                    price: price,
                    rating_avg: rating_avg ? rating_avg : 5,
                    discount_price: discount_price || null,
                    stock_quantity: stock_quantity,
                    description: description?.trim() || null,
                    book_type_id: book_type_id,
                },
            });

            if (!created) {
                return reject({
                    err: 2,
                    msg: 'Sách đã tồn tại!',
                });
            }

            // Upload hình ảnh lên Cloudinary
            const uploadResults = await cloudinaryService.uploadMultipleImagesService(req);

            if (!uploadResults || uploadResults.length === 0) {
                book.destroy();
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
                msg: 'Thêm sách và upload hình ảnh thành công!',
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

// sửa thông tin
export const updateBookService = ({
    book_id,
    title,
    author,
    publisher,
    published_date,
    price,
    discount_price,
    stock_quantity,
    description,
    book_type_id,
}) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm sách theo ID
            const book = await db.Book.findOne({ where: { book_id: book_id } });
            if (!book) {
                return resolve({
                    err: 0,
                    msg: 'Không tìm thấy sách với ID này!',
                });
            }

            // Cập nhật thông tin sách
            await book.update({
                title: title?.trim() || book.title,
                author: author?.trim() || book.author,
                publisher: publisher?.trim() || book.publisher,
                published_date: published_date ? new Date(published_date) : book.published_date,
                price: price !== undefined ? price : book.price,
                discount_price: discount_price !== undefined ? discount_price : book.discount_price,
                stock_quantity: stock_quantity !== undefined ? stock_quantity : book.stock_quantity,
                description: description?.trim() || book.description,
                book_type_id: book_type_id || book.book_type_id,
            });

            // Trả về thông tin sách sau khi cập nhật
            resolve({
                err: 0,
                msg: 'Cập nhật thông tin sách thành công!',
                data: book,
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật sách: ', error);
            reject({
                err: 1,
                msg: 'Đã xảy ra lỗi khi cập nhật thông tin sách!',
                error: error.message,
            });
        }
    });

// xóa sách
export const deleteBookService = (book_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const book = await db.Book.findOne({ where: { book_id } });
            const images = await db.BookImage.findAll({ where: { book_id } });

            // Kiểm tra nếu sách không tồn tại
            if (!book) {
                return resolve({
                    err: 0,
                    msg: 'Không tìm thấy sách với ID này!',
                });
            }

            if (images.length > 0) {
                await Promise.all(images.map(async (image) => {
                    await cloudinaryService.deleteImageService(image.image_public_id);
                    await image.destroy();
                }));
            }

            // Xóa sách
            await book.destroy();

            // Trả về kết quả thành công
            resolve({
                err: 0,
                msg: 'Xóa sách thành công!',
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


