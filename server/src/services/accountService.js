import db from "../models";
import * as cloudinaryService from "./cloudinaryService"
import bcrypt from "bcryptjs";

// lấy toàn bộ
export const getAllAccountService = () => new Promise(async (resolve, reject) => {
    try {
        const users = await db.User.findAll({});

        return resolve({
            err: users.length ? 0 : 2,
            msg: users.length ? 'Lấy danh sách người dùng thành công!' : 'Không có người dùng nào.',
            data: users
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
        return reject({
            err: 1,
            msg: 'Lỗi khi lấy danh sách người dùng!',
            error: error,
        });
    }
})

// lấy thông tin tài khoản theo user_id
export const getAccountService = ({ user_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { user_id },
                attributes: ['user_name', 'email'], // Chỉ lấy các trường cần thiết của User
                include: [
                    {
                        model: db.Avatar,
                        as: 'avatar',
                        attributes: ['avatar_public_id', 'avatar_path'],
                    }
                ]
            });

            return resolve({
                err: user ? 0 : 2,
                msg: user ? 'Lấy thông tin người dùng thành công!' : 'Không tìm thấy người dùng.',
                data: user
            });
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return reject({
                err: 1,
                msg: 'Đã xảy ra lỗi khi lấy thông tin người dùng!',
                error: error.message,
            });
        }
    });


// sửa thông tin tài khoản
export const updateAccountService = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            const { email, role, status, user_name } = req.body;

            if (!email) {
                return resolve({
                    err: 2,
                    msg: 'Email là bắt buộc để cập nhật tài khoản.'
                });
            }

            const trimmedEmail = email.trim();
            const trimmedUsername = user_name?.trim();

            const account = await db.User.findOne({
                where: { email: trimmedEmail }
            });

            if (!account) {
                return resolve({
                    err: 2,
                    msg: 'Không tìm thấy tài khoản để cập nhật.'
                });
            }

            const updateData = req.user.role === 1
                ? {
                    user_name: trimmedUsername,
                    status: status !== undefined ? status : account.status,
                    role: role !== undefined ? role : account.role
                }
                : {
                    user_name: trimmedUsername
                };

            const [affectedRows] = await db.User.update(
                updateData,
                {
                    where: { email: trimmedEmail }
                }
            );

            return resolve({
                err: affectedRows ? 0 : 2,
                msg: affectedRows
                    ? 'Cập nhật tài khoản thành công!'
                    : 'Không có thay đổi nào được thực hiện.'
            });

        } catch (error) {
            console.error('Error in updateAccountService:', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi cập nhật tài khoản!',
            });
        }
    });

// xóa tài khoản
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
export const changePasswordService = (req) =>
    new Promise(async (resolve, reject) => {
        try {
            const { email, old_pass_word, new_pass_word } = req.body;

            if (!email || !new_pass_word) {
                return resolve({
                    err: 2,
                    msg: 'Email và mật khẩu mới là bắt buộc.'
                });
            }

            // Trim inputs once at the start
            const trimmedEmail = email.trim();
            const trimmedOldPassword = old_pass_word?.trim();
            const trimmedNewPassword = new_pass_word.trim();

            // Find user
            const account = await db.User.findOne({
                where: { email: trimmedEmail }
            });

            if (!account) {
                return resolve({
                    err: 2,
                    msg: 'Tài khoản không tồn tại.'
                });
            }

            if (req.user.role === 1) {
                const hashedNewPassword = await bcrypt.hash(trimmedNewPassword, 10);

                await db.User.update(
                    { pass_word: hashedNewPassword },
                    { where: { email: trimmedEmail } }
                );
            } else {
                if (!trimmedOldPassword) {
                    return resolve({
                        err: 2,
                        msg: 'Mật khẩu cũ là bắt buộc cho người dùng thông thường.'
                    });
                }

                const isCorrectOldPassword = await bcrypt.compare(
                    trimmedOldPassword,
                    account.pass_word
                );

                if (!isCorrectOldPassword) {
                    return resolve({
                        err: 2,
                        msg: 'Mật khẩu cũ không chính xác.'
                    });
                }

                const hashedNewPassword = await bcrypt.hash(trimmedNewPassword, 10);

                await db.User.update(
                    { pass_word: hashedNewPassword },
                    { where: { email: trimmedEmail } }
                );
            }

            return resolve({
                err: 0,
                msg: 'Đổi mật khẩu thành công!'
            });

        } catch (error) {
            console.error('Change password error:', error);
            return reject({
                err: 1,
                msg: 'Lỗi khi đổi mật khẩu!',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

// upload avatar
export const uploadAvatarService = (user_id, req) =>
    new Promise(async (resolve, reject) => {
        let transaction;
        let uploadedImagePublicId = null;

        try {
            transaction = await db.sequelize.transaction();

            const [avatarRecord, created] = await db.Avatar.findOrCreate({
                where: { user_id },
                defaults: {
                    avatar_path: '',
                    avatar_public_id: '',
                },
                transaction,
            });

            if (!avatarRecord) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Không thể tìm hoặc tạo bản ghi Avatar!',
                });
            }

            const rs = await cloudinaryService.uploadImageService(req, avatarRecord?.avatar_public_id);
            if (!rs) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Lỗi upload lên Cloudinary!',
                });
            }

            // Lưu public_id của ảnh vừa upload để rollback nếu cần
            uploadedImagePublicId = rs.avatar_public_id;

            await avatarRecord.update(
                {
                    avatar_path: rs.url,
                    avatar_public_id: rs.avatar_public_id,
                },
                { transaction }
            );

            await transaction.commit();

            resolve({
                err: 0,
                msg: 'Upload avatar thành công!',
                data: {
                    avatar_path: rs.url
                },
            });
        } catch (error) {
            console.error('Lỗi tại upload Avatar: ', error);

            // Rollback database
            if (transaction) {
                await transaction.rollback();
                console.log('Đã rollback transaction do lỗi.');
            }

            // Rollback ảnh trên Cloudinary nếu đã upload
            if (uploadedImagePublicId) {
                try {
                    await cloudinaryService.deleteImageService(uploadedImagePublicId);
                    console.log('Đã xóa ảnh trên Cloudinary do lỗi.');
                } catch (deleteError) {
                    console.error('Lỗi khi xóa ảnh rollback trên Cloudinary: ', deleteError);
                }
            }

            reject({
                err: 1,
                msg: 'Lỗi khi thay đổi Avatar!',
                error: error.message,
            });
        }
    });


