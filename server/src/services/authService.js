import db from "../models";
import bcrypt from "bcryptjs";  // Nếu mật khẩu đã được mã hóa
import jwt from "jsonwebtoken"; // Để tạo token (JWT)
require('dotenv').config()

// đăng nhập
export const loginService = ({ email, pass_word }) = new Promise(async (resolve, reject) => {
    try {
        // Tìm account theo email
        const account = await db.User.findOne({
            where: { email },
        });

        // Kiểm tra nếu không tìm thấy tài khoản
        if (!account) {
            resolve({
                err: 1,
                msg: 'Không tìm thấy thông tin email.',
                token: null,
            })
        }

        //Kiểm tra mật khẩu
        const isPasswordValid = bcrypt.compareSync(pass_word, account.pass_word || '');
        if (!isPasswordValid) {
            resolve({
                err: 2,
                msg: 'Mật khẩu không chính xác.',
                token: null,
            })
        }

        // Kiểm tra trạng thái tài khoản
        if (!account?.status) {
            resolve({
                err: 1,
                msg: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với QTV để được hỗ trợ.',
                token: null,
            })
        }

        // Tạo token JWT
        const token = jwt.sign(
            {
                id: account.id,
                user_name: account.user_name,
                email: account.email,
                role: account.role,
            },
            process.env.JWT_SECRET || 'khongcokeygihet',
            { expiresIn: '1h' }
        );

        // Trả về thông tin thành công
        resolve({
            err: 0,
            msg: 'Đăng nhập thành công!',
            token,
        });
    } catch (error) {
        console.error('Lỗi trong loginService:', error);
        reject({
            err: 2,
            msg: error.message,
            token: null,
        });
    }
})

// đăng ký
const hash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const registerService = ({ user_name, email, pass_word, role }) => new Promise(async (resolve, reject) => {
    try {
        // Tạo tài khoản mới nếu chưa tồn tại 
        const [account, created] = await db.User.findOrCreate({
            where: { email },
            defaults: {
                email,
                user_name,
                pass_word: hash(pass_word),
                role: role ? 1 : 0
            }
        });

        // Tạo token nếu tài khoản mới được tạo thành công
        const token = created && jwt.sign(
            {
                id: account.id,
                user_name: account.user_name,
                email: account.email,
                role: account.role,
            },
            process.env.JWT_SECRET || 'khongcokeygihet',
            { expiresIn: '1h' }
        );

        // trả về kết quả
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Tạo tài khoản thành công!' : 'Nhân viên đã có tài khoản.',
            token: token || null
        });
    } catch (error) {
        console.log(error);
        reject({
            err: 1,
            msg: 'Lỗi khi tạo tài khoản!',
            error: error
        });
    }
});

// sửa
export const updateAccountService = ({ id, email, pass_word, type }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Cập nhật bản ghi tài khoản dựa trên id
            const response = await db.Account.update(
                { email, pass_word: hash(pass_word), type },
                {
                    where: { id },
                }
            );

            resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật tài khoản thành công!' : 'Không tìm thấy tài khoản để cập nhật.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi cập nhật tài khoản!',
                error: error,
            });
        }
    });


// xóa
export const deleteAccountService = (id) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi tài khoản dựa trên id
            const response = await db.Account.destroy({
                where: { id },
            });

            resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa tài khoản thành công!' : 'Không tìm thấy tài khoản để xóa.',
            });
        } catch (error) {
            reject({
                err: 1,
                msg: 'Lỗi khi xóa tài khoản!',
                error: error.message,
            });
        }
    });

// đổi mật khẩu
export const changePasswordService = ({ email, oldPassword, newPassword }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm tài khoản dựa trên email
            const account = await db.Account.findOne({ where: { email } });

            if (!account) {
                return resolve({
                    err: 2,
                    msg: 'Tài khoản không tồn tại.',
                });
            }

            // Kiểm tra mật khẩu cũ
            const isCorrectOldPassword = bcrypt.compareSync(oldPassword, account.pass_word);
            if (!isCorrectOldPassword) {
                return resolve({
                    err: 2,
                    msg: 'Mật khẩu cũ không chính xác.',
                });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

            // Cập nhật mật khẩu mới
            await db.Account.update(
                { pass_word: hashedNewPassword },
                { where: { id } }
            );

            resolve({
                err: 0,
                msg: 'Đổi mật khẩu thành công!',
            });
        } catch (error) {
            console.log(error)
            reject({
                err: 1,
                msg: 'Lỗi khi đổi mật khẩu!',
                error: error.message
            });
        }
    });