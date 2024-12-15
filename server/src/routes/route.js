import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"

// xử lý buffer với hình ảnh
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// khởi tạo
const router = express.Router()

//auth, account route
router.post('/auth/login', authController.loginController)
router.post('/auth/register', authController.registerController)
router.post('/account/forgot', accountController.forgotPassWordController)
router.post('/account/update', accountController.updateAccountController)
router.post('/account/delete', accountController.deleteAccountController)
router.post('/account/change', accountController.changePassWordController)
router.post('/account/avatar', upload.single('avatar'), accountController.uploadAvatatController);


export default router