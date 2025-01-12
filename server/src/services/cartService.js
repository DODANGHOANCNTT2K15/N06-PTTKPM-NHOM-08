import db from '../models';

// Thêm sản phẩm vào giỏ hàng
export const addToCartService = ({ user_id, book_id, quantity, all_price }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
            const existingCartItem = await db.Cart.findOne({
                where: { user_id, book_id },
            });

            if (existingCartItem) {
                return resolve({
                    err: 1,
                    msg: 'Sản phẩm đã có trong giỏ hàng.',
                });
            }

            // Thêm sản phẩm mới vào giỏ hàng
            const newCartItem = await db.Cart.create({
                user_id,
                book_id,
                quantity,
                all_price,
            });

            return resolve({
                err: 0,
                msg: 'Thêm sản phẩm vào giỏ hàng thành công.',
                data: newCartItem,
            });
        } catch (error) {
            console.error('Lỗi tại addToCartService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi thêm sản phẩm vào giỏ hàng.',
                error: error.message,
            });
        }
    });

// Lấy danh sách giỏ hàng theo user_id
export const getCartService = (user_id) =>
    new Promise(async (resolve, reject) => {
        try {
            const cartItems = await db.Cart.findAll({
                where: { user_id },
                include: [
                    {
                        model: db.Book,
                        as: 'book',
                        attributes: ['title', 'price'], // Lấy thông tin bổ sung từ bảng sách
                    },
                ],
            });

            if (!cartItems.length) {
                return resolve({
                    err: 1,
                    msg: 'Giỏ hàng trống.',
                    data: [],
                });
            }

            return resolve({
                err: 0,
                msg: 'Lấy danh sách giỏ hàng thành công.',
                data: cartItems,
            });
        } catch (error) {
            console.error('Lỗi tại getCartService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi lấy danh sách giỏ hàng.',
                error: error.message,
            });
        }
    });

// Cập nhật sản phẩm trong giỏ hàng
export const updateCartService = ({ cart_id, quantity, all_price }) =>
    new Promise(async (resolve, reject) => {
        try {
            const cartItem = await db.Cart.findOne({
                where: { cart_id },
            });

            if (!cartItem) {
                return resolve({
                    err: 1,
                    msg: 'Sản phẩm không tồn tại trong giỏ hàng.',
                });
            }

            // Cập nhật số lượng và tổng giá
            cartItem.quantity = quantity;
            cartItem.all_price = all_price;
            await cartItem.save();

            return resolve({
                err: 0,
                msg: 'Cập nhật giỏ hàng thành công.',
                data: cartItem,
            });
        } catch (error) {
            console.error('Lỗi tại updateCartService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật giỏ hàng.',
                error: error.message,
            });
        }
    });

// Xóa sản phẩm khỏi giỏ hàng
export const deleteCartItemService = ({ cart_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const cartItem = await db.Cart.destroy({
                where: { cart_id },
            });

            if (!cartItem) {
                return resolve({
                    err: 1,
                    msg: 'Không tìm thấy sản phẩm trong giỏ hàng để xóa.',
                });
            }

            return resolve({
                err: 0,
                msg: 'Xóa sản phẩm khỏi giỏ hàng thành công.',
            });
        } catch (error) {
            console.error('Lỗi tại deleteCartItemService: ', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng.',
                error: error.message,
            });
        }
    });
