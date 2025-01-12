import * as reviewService from "../services/reviewService"

// thêm review
export const addReviewController = async (req, res) => {
    const { book_id, user_id, rating, comment } = req.body;
    try {
        if (!book_id || !user_id || !rating || !comment) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await reviewService.createReviewService(req.body);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};

// xóa đánh giá
export const deleteReviewController = async (req, res) => {
    const { review_id } = req.body;
    try {
        if (!review_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            });
        }
        const rs = await reviewService.deleteReviewService(review_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json(error);
    }
};
