import db from "../models"

// thêm review
export const addReviewService = ({ book_id, user_id, rating, comment }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Thêm một bản ghi mới vào bảng reviews
            const response = await db.Review.create({
                book_id,
                user_id,
                rating,
                comment,
            });

            // Gọi hàm cập nhật rating_avg
            const update_rating = await updateRatingReviewService(book_id, rating);

            if (update_rating) {
                return resolve({
                    err: 0,
                    msg: 'Thêm đánh giá và cập nhật thành công!',
                    data: response,
                });
            } else {
                // Rollback nếu cập nhật thất bại
                await response.destroy();
                return resolve({
                    err: 2,
                    msg: 'Thêm đánh giá không thành công. Hệ thống đã rollback.',
                });
            }
        } catch (error) {
            console.log("Lỗi tại addReviewService: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm đánh giá!',
                error: error.message,
            });
        }
    });


// update rating
export const updateRatingReviewService = (book_id, rating) =>
    new Promise(async (resolve, reject) => {
        try {
            const book = await db.Book.findOne({
                where: { book_id },
            });

            if (!book) {
                console.error(`Không tìm thấy sách với ID: ${book_id}`);
                return resolve(false);
            }

            // Lấy tổng số đánh giá và tính toán trung bình
            const stats = await db.Review.findAll({
                where: { book_id },
                attributes: [
                    [db.Sequelize.fn('COUNT', db.Sequelize.col('rating')), 'count'],
                ],
            });

            console.log(stats);

            const currentCount = parseInt(stats[0]?.dataValues?.count || 0, 10);
            const newRatingAvg = (book.rating_avg * currentCount + rating) / (currentCount + 1);

            // Cập nhật rating_avg cho sách
            book.rating_avg = parseFloat(newRatingAvg.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
            await book.save();

            return resolve(true);
        } catch (error) {
            console.log('Lỗi tại updateRatingReviewService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật rating_avg!',
                error: error.message,
            });
        }
    });



// xóa đánh giá    
export const deleteReviewService = (review_id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi đánh giá dựa trên review_id
            const response = await db.Review.destroy({
                where: { review_id: review_id },
            });

            return resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa đánh giá thành công!' : 'Không tìm thấy đánh giá để xóa.',
            });
        } catch (error) {
            console.log("Lỗi tại deleteReviewService: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa đánh giá!',
                error: error.message,
            });
        }
    });

