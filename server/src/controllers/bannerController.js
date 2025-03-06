import * as bannerService from "../services/bannerService"

// tạo banner mới
export const addBannerController = async (req, res) => {
    const { banner_name } = req.body;
    try {
        if (!banner_name) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào!'
            });
        }
        const rs = await bannerService.addBannerService(banner_name, req)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}

// xóa banner
export const deleteBannerController = async (req, res) => {
    const { banner_id, banner_public_id } = req.body;
    try {
        if (!banner_id || !banner_public_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu dữ liệu đầu vào."
            })
        }
        const rs = await bannerService.deleteBannerService(req.body)
        return res.status(200).json(rs)
    } catch (error) {
        return res.status(500).json(error)
    }
}
