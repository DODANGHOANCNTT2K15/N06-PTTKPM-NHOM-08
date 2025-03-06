import db from "../models";
import * as cloudinaryService from "./cloudinaryService"

// lấy dữ liệu
export const getAllBannersService = () =>
    new Promise(async (resolve, reject) => {
      try {
        const banners = await db.Banner.findAll();
  
        if (!banners) {
          return resolve({
            err: 0,
            msg: 'Không có banner nào trong cơ sở dữ liệu!',
            data: [],
          });
        }
  
        resolve({
          err: 0,
          msg: 'Lấy danh sách banner thành công!',
          data: banners,
        });
      } catch (error) {
        console.error('Lỗi khi lấy danh sách banner: ', error);
        reject({
          err: 1,
          msg: 'Đã xảy ra lỗi khi lấy danh sách banner!',
          error: error.message,
        });
      }
    });
  

// thêm dữ liệu banner
export const addBannerService = (banner_name, req) =>
    new Promise(async (resolve, reject) => {
        let transaction;
        let uploadedImagePublicId = null;

        try {
            // Bắt đầu transaction
            transaction = await db.sequelize.transaction();

            // Tạo bản ghi banner mới với thông tin mặc định
            const bannerRecord = await db.Banner.create(
                {
                    banner_name: banner_name.trim(),
                    banner_path: '',
                    banner_public_id: '',
                },
                { transaction }
            );

            if (!bannerRecord) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Không thể tạo bản ghi banner!',
                });
            }

            // Upload ảnh lên Cloudinary
            const uploadResult = await cloudinaryService.uploadImageService(req, null);
            if (!uploadResult) {
                await transaction.rollback();
                return reject({
                    err: 2,
                    msg: 'Lỗi khi upload ảnh lên Cloudinary!',
                });
            }

            // Lưu public_id để rollback nếu cần
            uploadedImagePublicId = uploadResult.banner_public_id;

            // Cập nhật bản ghi banner với đường dẫn và public_id từ Cloudinary
            await bannerRecord.update(
                {
                    banner_path: uploadResult.url,
                    banner_public_id: uploadResult.banner_public_id,
                },
                { transaction }
            );

            // Commit transaction
            await transaction.commit();

            resolve({
                err: 0,
                msg: 'Thêm banner thành công!',
                data: {
                    banner_id: bannerRecord.banner_id,
                    banner_name: bannerRecord.banner_name,
                    banner_path: uploadResult.url,
                },
            });
        } catch (error) {
            console.error('Lỗi tại addBannerService: ', error);

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
                msg: 'Lỗi khi thêm banner!',
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