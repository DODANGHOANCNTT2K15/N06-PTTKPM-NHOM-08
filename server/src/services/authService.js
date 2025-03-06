import db from "../models";
import bcrypt from "bcryptjs";  // Nếu mật khẩu đã được mã hóa
import jwt from "jsonwebtoken"; // Để tạo token (JWT)
require('dotenv').config()

// đăng nhập
export const loginService = ({ email, pass_word }) => new Promise(async (resolve, reject) => {
    try {
        // Tìm account theo email
        const account = await db.User.findOne({
            where: { email: email.trim() },
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
        if (account?.status === 1) {
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
                avatar: account.avatar ? account.avatar.avatar_path : "",
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

export const registerService = ({ user_name, email, pass_word, role }) => 
    new Promise(async (resolve, reject) => {
        try {
            // Chuẩn hóa dữ liệu đầu vào
            const trimmedData = {
                email: email.trim(),
                user_name: user_name.trim(),
                pass_word: pass_word.trim()
            };

            // Kiểm tra email đã tồn tại chưa
            const existingUser = await db.User.findOne({
                where: { email: trimmedData.email }
            });

            if (existingUser) {
                return resolve({
                    err: 2,
                    msg: 'Email đã được sử dụng.',
                    token: null
                });
            }

            // Tạo tài khoản mới
            const newUser = await db.User.create({
                email: trimmedData.email,
                user_name: trimmedData.user_name,
                pass_word: hash(trimmedData.pass_word),
                role: role === 1 ? 1 : 0,
                status: 0
            });

            // // Tạo thông tin khách hàng
            // await db.Customer.create({
            //     user_id: newUser.user_id
            // });

            // Tạo JWT token
            const token = jwt.sign(
                {
                    user_id: newUser.user_id,
                    user_name: newUser.user_name,
                    email: newUser.email,
                    avatar: newUser.avatar?.avatar_path || "",
                    role: newUser.role
                },
                process.env.JWT_SECRET || 'khongcokeygihet',
                { expiresIn: '1h' }
            );

            // Trả về kết quả thành công
            resolve({
                err: 0,
                msg: 'Tạo tài khoản thành công!',
                token: token
            });

        } catch (error) {
            console.error('Registration error:', error);
            reject({
                err: 1,
                msg: 'Đã xảy ra lỗi khi tạo tài khoản!',
                error: error.message
            });
        }
    });

