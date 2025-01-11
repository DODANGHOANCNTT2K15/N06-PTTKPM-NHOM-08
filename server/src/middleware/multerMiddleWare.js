import multer from 'multer';
import path from 'path';

// Lọc file để chỉ chấp nhận file ảnh
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    if (allowedExtensions.includes(ext)) {
        cb(null, true); 
    } else {
        cb(new Error('Only .jpg, .jpeg, .png, and .gif files are allowed!'), false); 
    }
};

// Khởi tạo middleware multer
export const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB mỗi file
});
