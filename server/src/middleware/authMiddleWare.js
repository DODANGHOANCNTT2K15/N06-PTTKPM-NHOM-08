const jwt = require('jsonwebtoken');
require('dotenv').config();

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log(token);
    try {
        if (!token) {
            return res.status(401).json({
                err: 3,
                msg: 'Truy cập bị từ chối. Không có token được cung cấp.'
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'khongcokeygihet');
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({
            err: 3,
            msg: 'Mã token không hợp lệ.'
        });
    }
};

// kiểm tra admin
export const adminAuthMiddleware = (req, res, next) => {
    try {
        if (req.user.role === 1) {
            next();
        } else {
            return res.status(403).json({
                err: 3,
                msg: 'Bạn không có quyền sử dụng dịch vụ này.'
            });
        }
    } catch (ex) {
        throw ex;
    }
};
