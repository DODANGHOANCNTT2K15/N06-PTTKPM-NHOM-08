import * as authService from "../services/authService"

// đăng ký
export const register = async (req, res) => {
    const { user_name, email, pass_word, role } = req.body;
    try {
        if (!user_name || !email || !pass_word) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await authService.registerService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// đăng nhập
export const login = async (req, res) => {
    const { email, pass_word } = req.body;
    try {
        if (!email || !pass_word) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await authService.loginService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}
