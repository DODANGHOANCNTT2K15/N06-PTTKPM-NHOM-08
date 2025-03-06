import db from '../models';

// // Lấy số lượng sách yêu thích
export const getFavoriteCountService = ({ user_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const totalFavorites = await db.Favorite.count({
                where: { user_id },
                distinct: true,
                col: 'book_id',
            });

            return resolve({
                err: 0,
                msg: 'Lấy số lượng sách yêu thích thành công.',
                total_favorites: totalFavorites || 0,
            });
        } catch (error) {
            console.error('Lỗi tại getFavoriteCountService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi lấy số lượng sách yêu thích.',
                error: error.message,
            });
        }
    });

// Thêm sách vào danh sách yêu thích
export const addToFavoriteService = ({ user_id, book_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const existingFavorite = await db.Favorite.findOne({
                where: { user_id, book_id },
            });

            if (existingFavorite) {
                return resolve({
                    err: 1,
                    msg: 'Sách đã có trong danh sách yêu thích.',
                });
            }

            const newFavorite = await db.Favorite.create({
                user_id,
                book_id,
            });

            const totalFavorites = await db.Favorite.count({
                where: { user_id },
                distinct: true,
                col: 'book_id',
            });

            return resolve({
                err: 0,
                msg: 'Thêm sách vào danh sách yêu thích thành công.',
                data: newFavorite,
                total_favorites: totalFavorites || 0,
            });
        } catch (error) {
            console.error('Lỗi tại addToFavoriteService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm sách vào danh sách yêu thích.',
                error: error.message,
            });
        }
    });

// Lấy danh sách sách yêu thích theo user_id
export const getFavoritesService = (user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const favoriteItems = await db.Favorite.findAll({
                where: { user_id },
                include: [
                    {
                        model: db.Book,
                        as: 'book',
                        attributes: ['title', 'price'], // Lấy thông tin bổ sung từ bảng sách
                    },
                ],
            });

            if (!favoriteItems.length) {
                return resolve({
                    err: 1,
                    msg: 'Danh sách yêu thích trống.',
                    data: [],
                });
            }

            return resolve({
                err: 0,
                msg: 'Lấy danh sách yêu thích thành công.',
                data: favoriteItems,
            });
        } catch (error) {
            console.error('Lỗi tại getFavoritesService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi lấy danh sách yêu thích.',
                error: error.message,
            });
        }
    });

// Cập nhật sách yêu thích (ví dụ, có thể bỏ nếu không cần)
// export const updateFavoriteService = ({ favorite_id }) =>
//     new Promise(async (resolve, reject) => {
//         try {
//             const favoriteItem = await db.Favorite.findOne({
//                 where: { favorite_id },
//             });

//             if (!favoriteItem) {
//                 return resolve({
//                     err: 1,
//                     msg: 'Sách yêu thích không tồn tại.',
//                 });
//             }

//             // Ghi chú: Bảng favorites không có trường nào để cập nhật (chỉ có user_id và book_id là khóa ngoại).
//             // Nếu cần thêm trường (ví dụ: status), có thể mở rộng logic ở đây.
//             await favoriteItem.save();

//             return resolve({
//                 err: 0,
//                 msg: 'Cập nhật sách yêu thích thành công.',
//                 data: favoriteItem,
//             });
//         } catch (error) {
//             console.error('Lỗi tại updateFavoriteService: ', error);
//             return reject({
//                 err: 1,
//                 msg: 'Lỗi khi cập nhật sách yêu thích.',
//                 error: error.message,
//             });
//         }
//     });

// Xóa sách khỏi danh sách yêu thích
export const deleteFavoriteItemService = ({ favorite_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const cartItem = await db.Favorite.destroy({
                where: { favorite_id },
            });

            if (!cartItem) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy sách trong danh sách yêu thích để xóa.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Xóa sách khỏi danh sách yêu thích thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại deleteFavoriteItemService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa sách khỏi danh sách yêu thích.',
                error: error.message,
            });
        }
    });