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
            const result = await cloudinary.uploader.upload_stream(
                { folder: 'avatars' }, // Thư mục trên Cloudinary
                (error, result) => {
                    if (error) {
                        reject(false);
                    }
                    // Phản hồi kết quả thành công
                    resolve({
                        url: result.secure_url,
                    })
                }
            ).end(req.file.buffer); // Đẩy buffer của file

            // console.log(result)
        } catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            return res.status(500).json({ msg: 'Lỗi server!', error: error.message });
        }
    });
};