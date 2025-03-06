import * as accountService from "../services/accountService"
import * as mailService from "../services/mailService"

//lấy toàn bộ tài khoản
export const getAllAccountController = async (req, res) => {
    try {
        const rs = await accountService.getAllAccountService();
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in getAccountController:', error);
        return res.status(500).json(error);
    }
};

//lấy toàn bộ tài khoản
export const getAccountController = async (req, res) => {
    const { user_id } = req.body; 
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await accountService.getAccountService(req.body);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in getAccountController:', error);
        return res.status(500).json(error);
    }
};


// đổi mật khẩu
export const changePassWordController = async (req, res) => {
    const { email, old_pass_word, new_pass_word } = req.body;
    try {
        if (req.user.role !== 1) {
            if (!email || !new_pass_word || !old_pass_word) {
                return res.status(400).json({
                    err: 1,
                    msg: "Thiếu dữ liệu đầu vào."
                })
            }
        } else if (!email || !new_pass_word) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }

        const rs = await accountService.changePasswordService(req)
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
        if(req.user.role === 1) {
            if (!email || role == undefined || status == undefined || !user_name) {
                return res.status(400).json({
                    err: 1,
                    msg: "Thiếu dữ liệu đầu vào."
                })
            }
        } else {
            if (!email || !user_name) {
                return res.status(400).json({
                    err: 1,
                    msg: "Thiếu dữ liệu đầu vào."
                })
            }
        }
        const rs = await accountService.updateAccountService(req)
        return res.status(200).json(rs)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

// xóa tài khoản
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

// upload avatar
export const uploadAvatatController = async (req, res) => {
    const { user_id } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!'
            });
        }
        const rs = await accountService.uploadAvatarService(user_id, req)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}