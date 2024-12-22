import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"
import * as bookTypeController from "../controllers/bookTypeController"
import * as middleWare from "../middleware/authMiddleWare"

// xử lý buffer với hình ảnh
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// khởi tạo
const router = express.Router()

//auth route
router.post('/auth/login', authController.loginController)
router.post('/auth/register', authController.registerController)

// account route
router.post('/account/forgot', middleWare.authMiddleware, accountController.forgotPassWordController)
router.post('/account/update', middleWare.authMiddleware, accountController.updateAccountController)
router.post('/account/delete', middleWare.authMiddleware, accountController.deleteAccountController)
router.post('/account/change', middleWare.authMiddleware, accountController.changePassWordController)
router.post('/account/avatar', middleWare.authMiddleware, upload.single('avatar'), accountController.uploadAvatatController);

// books route
// router.post('/book/add', upload.array('images', 10), )

// bookTyoe route
router.post('/booktype/add', middleWare.authMiddleware, middleWare.adminAuthMiddleware, bookTypeController.addBookTypeController)
router.post('/booktype/update', middleWare.authMiddleware, middleWare.adminAuthMiddleware, bookTypeController.updateBookTypeController)
router.post('/booktype/delete', middleWare.authMiddleware, middleWare.adminAuthMiddleware, bookTypeController.deleteBookTypeController)

export default router