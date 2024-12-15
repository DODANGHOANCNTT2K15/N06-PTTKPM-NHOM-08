import db from "../models";
require('dotenv').config();
import bcrypt from "bcryptjs";  // Nếu mật khẩu đã được mã hóa
const nodemailer = require('nodemailer');

// tạo mật khẩu ngẫu nhiên
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    let pass_word = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        pass_word += charset[randomIndex];
    }
    return pass_word;
}
   
// lấy lại mật khẩu
export const getPassService = ({ email }) => new Promise(async (resolve, reject) => {
    const newPass = generateRandomPassword(8)
    try {
        const response = await db.User.findOne({
            where: { email : email.trim() },
            raw: true
        });
        if (response) {
            try {
                await db.User.update({ pass_word:  bcrypt.hashSync(newPass, bcrypt.genSaltSync(10)) }, {
                    where: {
                        email : email.trim(),
                    },
                });
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com', // Host của Gmail
                    port: 465, // Cổng SMTP của Gmail
                    secure: true,
                    auth: {
                        user: process.env.MAILER_EMAIL,
                        pass: process.env.PASS_EMAIL
                    }
                });
                let mailOptions = {
                    from: process.env.MAILER_EMAIL,
                    to: response.email,
                    subject: 'Lấy lại mật khẩu',
                    html: `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Email Template</title>
                            <style>
                                /* CSS styles go here */
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    margin: 0;
                                    padding: 0;
                                }
                                .container {
                                    width: 100%;
                                    max-width: 600px;
                                    margin: 0 auto;
                                    padding: 20px;
                                    background-color: #ffffff;
                                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                    border-radius: 10px;
                                    box-sizing: border-box;
                                }
                                h1 {
                                    color: #333333;
                                }
                                p {
                                    color: #666666;
                                }
                                .button {
                                    display: inline-block;
                                    padding: 10px 20px;
                                    background-color: #007bff;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 5px;
                                }
                                .bottom-bar {
                                    margin-top: 20px;
                                    padding-top: 20px;
                                    border-top: 1px solid #dddddd;
                                    text-align: center;
                                }
                                .pass {
                                    display: flex;
                                    justify-content: center; 
                                    align-items: center;
                                    font-size: 16px;
                                }
                                
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Lấy lại mật khẩu</h1>
                                <p>Mật khẩu của bạn đã được thay đổi. Vui không chia sẻ với bất kỳ ai.</p>
                                <p>Dưới đây là mật khẩu mới của bạn:</p>
                                <p class="pass"><strong>${newPass}</strong></p>
                                <a href="#" class="button">Đăng nhập</a>
                                <div class="bottom-bar">
                                    <p>Nếu có bất kỳ câu hỏi hoặc thắc mắc, vui lòng liên hệ với chúng tôi:</p>
                                    <p>Email: devtester0321@gmail.com</p>
                                    <p>Điện thoại: 0987654321</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `
                };

                // Gửi email và xử lý kết quả
                transporter.sendMail(mailOptions, (error, info) => {
                    return resolve({
                        err: error ? 2 : 0,
                        msg: error ? `Không thể gửi thông tin đến ${email}` : `Mật khẩu mới đã được gửi đến ${email}. Vui lòng kiểm tra email của bạn.`
                    })
                });
            } catch (error) {
                console.log(error)
                return resolve({
                    err: 2,
                    msg: `Không thể update mật khẩu!, ${error.messsage}`
                })
            }

        } else {
            return resolve({
                err: 2,
                msg: "Email không tồn tại! Vui lòng kiểm tra lại thông tin",
            })
        }
    } catch (error) {
        console.error("Lỗi tại hàm gửi mail", error);
        reject({
            err: 2,
            msg: error.messsage,
        })
    }
});