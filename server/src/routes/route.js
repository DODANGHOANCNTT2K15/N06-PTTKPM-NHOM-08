import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"
import * as bookTypeController from "../controllers/bookTypeController"
import * as bookController from "../controllers/bookController"
import * as middleWare from "../middleware/authMiddleWare"
import { upload } from "../middleware/multerMiddleWare";

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
router.get('/book', bookController.getAllBookController)
router.post('/book/id', bookController.getBookByIdController)
router.post('/book/add', upload.array('images', 10), bookController.addBookController)

// bookTyoe route
router.post('/booktype/add', bookTypeController.addBookTypeController)
router.post('/booktype/update', bookTypeController.updateBookTypeController)
router.post('/booktype/delete', bookTypeController.deleteBookTypeController)

export default router