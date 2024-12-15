import * as accountService from "../services/accountService"
import * as mailService from "../services/mailService"

// đổi mật khẩu
export const changePassWordController = async (req, res) => {
    const { email, old_pass_word, new_pass_word } = req.body;
    try {
        if (!email || !old_pass_word || !new_pass_word) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await accountService.changePasswordService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// quên mật khẩu
export const forgotPassWordController = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await mailService.getPassService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// cập nhật tài khoản
export const updateAccountController = async (req, res) => {
    const { email, role, status, user_name } = req.body;
    try {
        if (!email || !role || !status || !user_name) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await accountService.updateAccountService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// cập nhật tài khoản
export const deleteAccountController = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await accountService.deleteAccountService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}