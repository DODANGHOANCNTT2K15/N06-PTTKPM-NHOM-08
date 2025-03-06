import db from "../models";
import * as cloudinaryService from "./cloudinaryService"

export const addBannerService = (banner_name, req) =>
    new Promise(async (resolve, reject) => {
        let transaction;
        let uploadedImagePublicId = null;

        try {
            transaction = await db.sequelize.transaction();

            const [bannerRecord, created] = await db.Avatar.Create({
                defaults: {
                    banner_path: '',
                    banner_public_id: '',
                },
                transaction,
            });

            if (!bannerRecord) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Không thể tìm hoặc tạo bản ghi banner!',
                });
            }

            const rs = await cloudinaryService.uploadImageService(req);
            if (!rs) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Lỗi upload lên Cloudinary!',
                });
            }

            // Lưu public_id của ảnh vừa upload để rollback nếu cần
            uploadedImagePublicId = rs.banner_public_id;

            await bannerRecord.update(
                {
                    banner_path: rs.url,
                    banner_public_id: rs.banner_public_id,
                },
                { transaction }
            );

            await transaction.commit();

            resolve({
                err: 0,
                msg: 'Upload banner thành công!',
                data: {
                    banner_path: rs.url
                },
            });
        } catch (error) {
            console.error('Lỗi tại upload banner: ', error);

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
                msg: 'Lỗi khi thay đổi banner!',
                error: error.message,
            });
        }
    });

// xóa banner
export const deleteBannerService = ({ banner_id, banner_public_id }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Banner.destroy({
                where: { banner_id: banner_id.trim() },
            });

            if (!response) {
                return resolve({
                    err: 2,
                    msg: 'Không tìm thấy banner để xóa!',
                });
            }

            // Xóa ảnh trên Cloudinary
            const cloudinaryResult = await cloudinaryService.deleteImageService(banner_public_id);
            if (!cloudinaryResult || cloudinaryResult.result !== 'ok') {
                console.log(`Không thể xóa ảnh trên Cloudinary với public_id: ${banner_public_id}`);
            }

            return resolve({
                err: 0,
                msg: 'Xóa banner thành công!',
            });
        } catch (error) {
            console.log("Lỗi tại deleteBannerService: ", error);
            return reject({
                err: 1,
                msg: 'Lỗi khi xóa banner!',
                error: error.message,
            });
        }
    });