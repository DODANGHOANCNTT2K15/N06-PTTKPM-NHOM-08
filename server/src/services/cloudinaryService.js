const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

// Load biến môi trường
dotenv.config();

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// upload avatar
export const uploadImageService = (req, avatar_public_id) => {
    return new Promise((resolve, reject) => {
        try {
            const upload = cloudinary.uploader.upload_stream(
                { folder: 'avatars' }, // Thư mục trên Cloudinary
                async (error, result) => {
                    if (error) {
                        console.error('Lỗi khi upload ảnh lên Cloudinary:', error);
                        return reject({
                            err: 1,
                            msg: 'Lỗi upload ảnh lên Cloudinary!',
                            error: error.message,
                        });
                    }

                    // Nếu có ảnh cũ, xóa ảnh cũ sau khi upload thành công
                    try {
                        if (avatar_public_id) {
                            await deleteImageService(avatar_public_id);
                        }
                    } catch (deleteError) {
                        console.error('Lỗi khi xóa ảnh cũ:', deleteError);
                    }

                    // Trả về kết quả thành công
                    resolve({
                        url: result.secure_url,
                        avatar_public_id: result.public_id,
                    });
                }
            );

            // Đẩy buffer của file lên Cloudinary
            if (req.file && req.file.buffer) {
                upload.end(req.file.buffer);
            } else {
                return reject({
                    err: 2,
                    msg: 'Không có file để upload!',
                });
            }
        } catch (error) {
            console.error('Lỗi trong uploadImageService:', error);
            reject({
                err: 3,
                msg: 'Lỗi server!',
                error: error.message,
            });
        }
    });
};


// upload multi images book
export const uploadMultipleImagesService = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const uploadedImages = await Promise.all(
                req.files.map(file => {
                    return new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            { folder: 'books' }, // Thư mục trên Cloudinary
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve({
                                        url: result.secure_url,
                                        image_public_id: result.public_id,
                                    });
                                }
                            }
                        ).end(file.buffer); // Đẩy buffer của từng file
                    });
                })
            );

            // Phản hồi danh sách URL ảnh đã tải lên
            resolve(uploadedImages);
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            reject({ err: 2, msg: 'Lỗi server!', error: error.message });
        }
    });
};


//delete image
export const deleteImageService = (image_public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(image_public_id, (error, result) => {
            if (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                return reject({ err: 2, msg: 'Lỗi khi xóa ảnh!', error: error.msg });
            }
            resolve(result); // Trả về kết quả từ Cloudinary
        });
    });
};
