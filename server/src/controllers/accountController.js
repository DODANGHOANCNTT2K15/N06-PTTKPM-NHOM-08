import * as authService from "../services/authService"
import * as mailService from "../services/mailService"

// đổi mật khẩu
export const changePassWord = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;
    try {
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await authService.changePasswordService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// quên mật khẩu
export const forgotPassWord = async (req, res) => {
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