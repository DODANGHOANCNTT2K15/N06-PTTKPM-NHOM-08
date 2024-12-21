import db from "../models";
import * as cloudinaryService from "../services/cloudinaryService"

export const addBookService = (req) =>
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

