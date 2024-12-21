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

export const uploadImageService = (req) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { avatar_public_id } = req.body;


            const result = await cloudinary.uploader.upload_stream(
                { folder: 'avatars' }, // Thư mục trên Cloudinary
                (error, result) => {
                    if (error) {
                        reject(false);
                    }
                    // Phản hồi kết quả thành công
                    resolve({
                        url: result.secure_url,
                        avatar_public_id: result.public_id,
                    });
                }
            ).end(req.file.buffer); // Đẩy buffer của file

            if (avatar_public_id) {
                deleteImageService(avatar_public_id)
            }
            
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            return res.status(500).json({ msg: 'Lỗi server!', error: error.message });
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
