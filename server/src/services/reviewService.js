import db from "../models"

export const addReviewService = ({ book_id, user_id, rating, comment }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Thêm một bản ghi mới vào bảng reviews
            const response = await db.Review.create({
                book_id: book_id,
                user_id: user_id,
                rating: rating,
                comment: comment,
            });

            return resolve({
                err: 0,
                msg: 'Thêm đánh giá thành công!',
                data: response,
            });
        } catch (error) {
            console.log("Lỗi tại createReviewService: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm đánh giá!',
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
