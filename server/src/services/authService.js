import db from "../models";
import bcrypt from "bcryptjs";  // Nếu mật khẩu đã được mã hóa
import jwt from "jsonwebtoken"; // Để tạo token (JWT)
require('dotenv').config()

// đăng nhập
export const loginService = ({ email, pass_word }) => new Promise(async (resolve, reject) => {
    try {
        // Tìm account theo email
        const account = await db.User.findOne({
            where: { email : email.trim() },
            include: [
                {
                    model: db.Avatar,
                    as: 'avatar',
                    attributes: ['avatar_path']
                }
            ]
        });

        // Kiểm tra nếu không tìm thấy tài khoản
        if (!account) {
            return resolve({
                err: 1,
                msg: 'Không tìm thấy thông tin email.',
                token: null,
            })
        }

        //Kiểm tra mật khẩu
        const isPasswordValid = bcrypt.compareSync(pass_word.trim(), account.pass_word || '');
        if (!isPasswordValid) {
            return resolve({
                err: 2,
                msg: 'Mật khẩu không chính xác.',
                token: null,
            })
        }

        // Kiểm tra trạng thái tài khoản
        if (!account?.status) {
            return resolve({
                err: 1,
                msg: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ với QTV để được hỗ trợ.',
                token: null,
            })
        }

        // Tạo token JWT
        const token = jwt.sign(
            {
                user_id: account.user_id,
                user_name: account.user_name,
                email: account.email,
                avatar: account.avatar.avatar_path,
                role: account.role,
            },
            process.env.SECRET_KEY || 'khongcokeygihet',
            { expiresIn: '1h' }
        );
        // console.log(account.avatar.avatar_path);
        // Trả về thông tin thành công
        return resolve({
            err: 0,
            msg: 'Đăng nhập thành công!',
            token,
        });
    } catch (error) {
        console.error('Lỗi trong loginService:', error);
        return reject({
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
                email : email.trim(),
                user_name: user_name.trim(),
                pass_word: hash(pass_word.trim()),
                role: role ? 1 : 0,
                status: 0,
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
        return resolve({
            err: token ? 0 : 2,
            msg: token ? 'Tạo tài khoản thành công!' : 'Nhân viên đã có tài khoản.',
            token: token || null
        });
    } catch (error) {
        console.log(error);
        return reject({
            err: 1,
            msg: 'Lỗi khi tạo tài khoản!',
            error: error
        });
    }
});

