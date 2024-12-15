import db from "../models";
import * as cloudinaryService from "./cloudinaryService"
// sửa
export const updateAccountService = ({ email, role, status, user_name }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Cập nhật bản ghi tài khoản dựa trên email
            const response = await db.User.update(
                {
                    user_name: user_name.trim(),
                    status,
                    role
                },
                {
                    where: { email: email.trim() },
                }
            );

            return resolve({
                err: response[0] ? 0 : 2,
                msg: response[0] ? 'Cập nhật tài khoản thành công!' : 'Không tìm thấy tài khoản để cập nhật.',
            });
        } catch (error) {
            console.log("Lỗi tại update Account: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật tài khoản!',
                error: error,
            });
        }
    });


// xóa
export const deleteAccountService = ({ email }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Xóa bản ghi tài khoản dựa trên email
            const response = await db.User.destroy({
                where: { email: email.trim() },
            });

            return resolve({
                err: response ? 0 : 2,
                msg: response ? 'Xóa tài khoản thành công!' : 'Không tìm thấy tài khoản để xóa.',
            });
        } catch (error) {
            console.log("Lỗi tại delete Account: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa tài khoản!',
                error: error.message,
            });
        }
    });

// đổi mật khẩu
export const changePasswordService = ({ email, old_pass_word, new_pass_word }) =>
    new Promise(async (resolve, reject) => {
        try {
            // Tìm tài khoản dựa trên email
            const account = await db.User.findOne({ where: { email: email.trim() } });

            if (!account) {
                return resolve({
                    err: 2,
                    msg: 'Tài khoản không tồn tại.',
                });
            }

            // Kiểm tra mật khẩu cũ
            const isCorrectOldPassword = bcrypt.compareSync(old_pass_word.trim(), account.pass_word);
            if (!isCorrectOldPassword) {
                return resolve({
                    err: 2,
                    msg: 'Mật khẩu cũ không chính xác.',
                });
            }

            // Mã hóa mật khẩu mới
            const hashedNewPassword = bcrypt.hashSync(new_pass_word.trim(), 10);

            // Cập nhật mật khẩu mới
            await db.User.update(
                { pass_word: hashedNewPassword },
                { where: { email } }
            );

            return resolve({
                err: 0,
                msg: 'Đổi mật khẩu thành công!',
            });
        } catch (error) {
            console.log(error)
            return reject({
                err: 1,
                msg: 'Lỗi khi đổi mật khẩu!',
                error: error.message
            });
        }
    });

// sửa
export const uploadAvatarService = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            const { email } = req.body;

            const user = await db.User.findOne({ where: { email } });
            if (!user) {
                return reject({
                    err: 2,
                    msg: 'Không tìm thấy tài khoản với email tương ứng!',
                });
            }

            const rs = await cloudinaryService.uploadImageService(req);
            if (!rs) {
                return reject({
                    err: 2,
                    msg: 'Lỗi upload lên Cloudinary!',
                });
            }

            // Cập nhật đường dẫn avatar vào database
            await db.User.update(
                { avatar: rs?.url },
                { where: { email } }
            );

            // Trả về kết quả thành công
            resolve({
                err: 0,
                msg: 'Upload avatar thành công!',
                url: rs.url,
            });
        } catch (error) {
            console.error('Lỗi tại upload Avatar: ', error);
            reject({
                err: 1,
                msg: 'Lỗi khi thay đổi Avartar!',
                error: error.message,
            });
        }
    });



