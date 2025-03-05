import * as customerService from "../services/customerService"

// lấy thông tin khách hàng
export const getCustomerController = async (req, res) => {
    const { user_id } = req.body;
    try {
        if (!user_id) {
            return res.status(400).json({
                err: 1,
                msg: "Thiếu user_id.",
            });
        }
        console.log(user_id )
        const rs = await customerService.getCustomerService(user_id);
        return res.status(200).json(rs);
    } catch (error) {
        return res.status(500).json({
            err: 1,
            msg: "Lỗi server.",
            error: error.message,
        });
    }
};

// thêm khách hàng
export const addCustomerController = async (req, res) => {
    const { full_name, dob, gender, address, phone, user_id } = req.body;

    try {
        // Kiểm tra nếu thiếu dữ liệu bắt buộc
        if (!full_name || !dob || !gender || !address || !phone || !user_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu dữ liệu đầu vào bắt buộc!',
            });
        }

        const rs = await customerService.addCustomerService(req.body);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in addCustomerController:', error);
        return res.status(500).json(error);
    }
};


// cập nhật thông tin khách hàng
export const updateCustomerController = async (req, res) => {
    const { customer_id, full_name, dob, gender, address, phone, user_id } = req.body;

    try {
        // Kiểm tra nếu không có dữ liệu cần cập nhật
        if (!customer_id || !full_name && !dob && !gender && !address && !phone && !user_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Không có dữ liệu cần cập nhật!',
            });
        }

        const rs = await customerService.updateCustomerService(customer_id, req.body);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in updateCustomerController:', error);
        return res.status(500).json(error);
    }
};

// xóa thông tin
export const deleteCustomerController = async (req, res) => {
    const { customer_id } = req.body;

    try {
        // Kiểm tra nếu thiếu customer_id
        if (!customer_id) {
            return res.status(400).json({
                err: 1,
                msg: 'Thiếu customer_id!',
            });
        }

        const rs = await customerService.deleteCustomerService(customer_id);
        return res.status(200).json(rs);

    } catch (error) {
        console.error('Error in deleteCustomerController:', error);
        return res.status(500).json(error);
    }
};
