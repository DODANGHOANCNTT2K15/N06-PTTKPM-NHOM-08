import express from "express";
import * as authController from "../controllers/authController"
import * as accountController from "../controllers/accountController"


const router = express.Router()

//auth, account route
router.post('/auth/login', authController.loginController)
router.post('/auth/register', authController.registerController)
router.post('/account/forgot', accountController.forgotPassWordController)
router.post('/account/update', accountController.updateAccountController)
router.post('/account/delete', accountController.deleteAccountController)
router.post('/account/change', accountController.changePassWordController)


export default router