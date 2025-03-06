const jwt = require('jsonwebtoken');
require('dotenv').config();

export const authMiddleware = (req, res, next) => {
    // Get token from Authorization header and remove 'Bearer ' prefix if present
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.replace('Bearer ', '') 
        : authHeader;

    try {
        if (!token) {
            return res.status(401).json({
                err: 3,
                msg: 'Truy cập bị từ chối. Không có token được cung cấp.'
            });
        }

        // Verify token with secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY || 'khongcokeygihet');
        console.log(decoded.role)
        req.user = decoded;
        next();
    } catch (ex) {
        console.error('Token verification error:', ex.message);
        res.status(400).json({
            err: 3,
            msg: 'Mã token không hợp lệ.',
        });
    }
};

// Admin check middleware
export const adminAuthMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                err: 3,
                msg: 'Vui lòng xác thực trước khi kiểm tra quyền admin.'
            });
        }

        if (req.user.role === 1) {
            next();
        } else {
            return res.status(403).json({
                err: 3,
                msg: 'Bạn không có quyền sử dụng dịch vụ này.'
            });
        }
    } catch (ex) {
        console.error('Admin auth error:', ex.message);
        res.status(500).json({
            err: 3,
            msg: 'Lỗi xác thực quyền admin.',
        });
    }
};