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


// thêm sách
export const addBookService = (req) =>
    new Promise(async (resolve, reject) => {
        const {
            title,
            author,
            publisher,
            published_date,
            price,
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
                err: 1,
                msg: 'Đã xảy ra lỗi trong quá trình thêm sách!',
                error: error.message,
            });
        }
    });

// sửa thông tin


// xóa



