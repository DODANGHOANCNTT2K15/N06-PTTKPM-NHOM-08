import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"
import * as bookTypeController from "../controllers/bookTypeController"

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
router.post('/account/forgot', accountController.forgotPassWordController)
router.post('/account/update', accountController.updateAccountController)
router.post('/account/delete', accountController.deleteAccountController)
router.post('/account/change', accountController.changePassWordController)
router.post('/account/avatar', upload.single('avatar'), accountController.uploadAvatatController);

// books route
// router.post('/book/add', upload.array('images', 10), )

// bookTyoe route
router.post('/booktype/add', bookTypeController.addBookTypeController)
router.post('/booktype/update', bookTypeController.updateBookTypeController)
router.post('/booktype/delete', bookTypeController.deleteBookTypeController)

export default router