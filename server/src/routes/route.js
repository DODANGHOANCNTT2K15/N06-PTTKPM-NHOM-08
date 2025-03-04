import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"
import * as bookTypeController from "../controllers/bookTypeController"
import * as bookController from "../controllers/bookController"
import * as bookImageController from "../controllers/bookImageController"
import * as reviewController from "../controllers/reviewController"
import * as cartController from "../controllers/cartController"
import * as customerController from "../controllers/customerController"
import * as orderController from "../controllers/orderController"
import * as paymentService from "../services/paymentService"
import * as middleWare from "../middleware/authMiddleWare"
import { upload } from "../middleware/multerMiddleWare";

// init route
const router = express.Router()

// auth route
router.post('/auth/login', authController.loginController)  
router.post('/auth/register', authController.registerController)

// account route
router.get('/account', accountController.getAllAccountController)
router.post('/account/forgot', middleWare.authMiddleware, accountController.forgotPassWordController)
router.post('/account/update', middleWare.authMiddleware, accountController.updateAccountController)
router.post('/account/delete', middleWare.authMiddleware, accountController.deleteAccountController)
router.post('/account/change', middleWare.authMiddleware, accountController.changePassWordController)
router.post('/account/avatar', middleWare.authMiddleware, upload.single('avatar'), accountController.uploadAvatatController);

// books route
router.get('/book', bookController.getAllBookController)
router.post('/book/id', bookController.getBookByIdController)
router.post('/book/add', upload.array('images', 10), bookController.addBookController)
router.post('/book/update', bookController.updateBookController)
router.post('/book/delete', bookController.deleteBookController)

// book image
router.post('/bookimage/add', upload.array('images', 10), bookImageController.addBookImageController)
router.post('/bookimage/delete', bookImageController.deleteBookImageController)

// bookType route
router.get('/booktype', bookTypeController.getAllBookTypeController)
router.post('/booktype/add', bookTypeController.addBookTypeController)
router.post('/booktype/update', bookTypeController.updateBookTypeController)
router.post('/booktype/delete', bookTypeController.deleteBookTypeController)

// review route
router.post('/review/add', reviewController.addReviewController)
router.post('/review/delete', reviewController.deleteReviewController)

// cart route
router.get('/cart', cartController.getCartController)
router.post('/cart/add', cartController.addToCartController)
router.post('/cart/update', cartController.updateCartController)
router.post('/cart/delete', cartController.deleteCartItemController)

// customer route
router.post('/customer', customerController.getCustomerController)
router.post('/customer/add', customerController.addCustomerController)
router.post('/customer/update', customerController.updateCustomerController)
router.post('/customer/delete', customerController.deleteCustomerController)

// order route
router.post("/order/get", orderController.getOrderController);
router.post("/order/add", orderController.addOrderController);
router.post("/order/update", orderController.updateOrderController);
router.post("/order/delete", orderController.deleteOrderController);

// payment method

// payment
router.post("/payment", paymentService.payment);

export default router