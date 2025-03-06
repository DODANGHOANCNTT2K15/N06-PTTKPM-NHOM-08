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

            // console.log(stats);

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
            // Tìm review trước khi xóa để lấy thông tin book_id và rating
            const review = await db.Review.findOne({
                where: { review_id: review_id },
            });

            if (!review) {
                return resolve({
                    err: 2,
                    msg: 'Không tìm thấy đánh giá để xóa.',
                });
            }

            // Lưu trữ book_id và rating trước khi xóa
            const book_id = review.book_id;
            const ratingToRemove = review.rating;

            // Xóa bản ghi đánh giá
            const response = await db.Review.destroy({
                where: { review_id: review_id },
            });

            if (response) {
                // Cập nhật lại rating_avg sau khi xóa
                const update_rating = await updateRatingAfterDeleteService(book_id, ratingToRemove);

                if (update_rating) {
                    return resolve({
                        err: 0,
                        msg: 'Xóa đánh giá và cập nhật rating thành công!',
                    });
                } else {
                    return resolve({
                        err: 3,
                        msg: 'Xóa đánh giá thành công nhưng cập nhật rating thất bại.',
                    });
                }
            } else {
                return resolve({
                    err: 2,
                    msg: 'Không tìm thấy đánh giá để xóa.',
                });
            }
        } catch (error) {
            console.log("Lỗi tại deleteReviewService: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa đánh giá!',
                error: error.message,
            });
        }
    });

// Hàm cập nhật rating sau khi xóa
export const updateRatingAfterDeleteService = (book_id, ratingToRemove) =>
    new Promise(async (resolve, reject) => {
        try {
            const book = await db.Book.findOne({
                where: { book_id },
            });

            if (!book) {
                console.error(`Không tìm thấy sách với ID: ${book_id}`);
                return resolve(false);
            }

            // Lấy tổng số đánh giá hiện tại
            const stats = await db.Review.findAll({
                where: { book_id },
                attributes: [
                    [db.Sequelize.fn('COUNT', db.Sequelize.col('rating')), 'count'],
                ],
            });

            const currentCount = parseInt(stats[0]?.dataValues?.count || 0, 10);

            if (currentCount === 0) {
                // Nếu không còn review nào, đặt rating_avg về 0 hoặc giá trị mặc định
                book.rating_avg = 0;
            } else {
                // Tính lại rating_avg bằng cách loại bỏ rating đã xóa
                const newRatingAvg = (book.rating_avg * (currentCount + 1) - ratingToRemove) / currentCount;
                book.rating_avg = parseFloat(newRatingAvg.toFixed(2)); // Làm tròn đến 2 chữ số thập phân
            }

            // Cập nhật lại rating_avg trong bảng Book
            await book.save();

            return resolve(true);
        } catch (error) {
            console.log('Lỗi tại updateRatingAfterDeleteService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật rating_avg sau khi xóa!',
                error: error.message,
            });
        }
    });