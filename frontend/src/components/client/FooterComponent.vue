<template>
    <footer>
        <div>
            <div>
                <div class="footer_group">
                    <h1>Hỗ trợ khách hàng</h1>
                    <ul>
                        <li>Hotline: 0987 654 321</li>
                        <li>Email: dohoan@gmail.com</li>
                        <li>Gửi yêu cầu hỗ trợ</li> 
                        <li>Hướng dẫn đặt hàng</li>
                        <li>Chính sách kiểm hàng</li>
                        <li>Phương thức vận chuyển</li>
                        <li>Chính sách vận chuyển</li>
                        <li>Báo lỗi</li>
                    </ul>
                </div>
                <div class="footer_group">
                    <h1>Về PlayBook</h1>
                    <ul>
                        <li>Giới thiệu về PlayBook</li>
                        <li>PlayBook Blog</li>
                        <li>Tuyển dụng</li> 
                        <li>Chính sách bảo mật thanh toán</li>
                        <li>Chính sách giải quyết kiếu nại</li>
                        <li>Chính sách bảo mật thông tin các nhân</li>
                        <li>Điều khoản sử dụng</li>
                        <li>Tiếp thị liên kết PlayBook</li>
                        <li>Bán hàng doanh nghiệp</li>
                        <li>Điều kiện vận chuyển</li>
                    </ul>
                </div>
                <div class="footer_group">
                    <h1>Hợp tác và liên kết</h1>
                    <ul>
                        <li>Bán hàng cùng PlayBook</li>
                    </ul>
                </div>
                <div class="footer_group footer_group_payment">
                    <h1>Phương thứ thanh toán</h1>
                    <ul class="flex">
                        <li>
                            <img src="@/assets/images/Payment_00.png" alt="">
                        </li>
                        <li>
                            <img src="@/assets/images/Payment_01.png" alt="">
                        </li>
                        <li>
                            <img src="@/assets/images/Payment_02.png" alt="">
                        </li>
                    </ul>
                    <h1>Phương thức vận chuyển</h1>
                    <ul class="flex">
                        <li>
                            <img src="@/assets/images/Transport_00.png" alt="">
                        </li>
                        <li>
                            <img src="@/assets/images/Transport_01.png" alt="">
                        </li>
                    </ul>
                </div>
                <div class="footer_group footer_group_social">
                    <h1>Kết nối với chúng tôi</h1>
                    <ul class="flex">
                        <li><img src="@/assets/images/Social_00.png" alt=""></li>
                        <li><img src="@/assets/images/Social_01.png" alt=""></li>
                    </ul>
                </div>
            </div>
            <div>
                &copy; 2025 Playbook. All rights reserved.
            </div>
        </div>
    </footer>
</template>
  
<style scoped>
footer{
    margin-top: 50px;
}
footer > div{
    padding: 20px 10%;
}

footer li{
    list-style: none;
    margin-bottom: 10px;
    font-size: 0.8em;
}

footer ul{
    margin-top: 10px;
    margin-bottom: 20px;
}

footer h1{
    font-size: 1.2em;
    margin-bottom: 10px;
}

footer > div> div:nth-child(1){
    display: flex;
    justify-content: space-between;
}

footer > div > div:nth-child(2){
    display: flex;
    justify-content: center;
    width: 100%;
    border-top: 1px solid rgb(79, 79, 79);
    padding-top: 20px;
}

.footer_group_payment > ul > li{
    margin-right: 15px;
}

.footer_group_social img{
    width: 40px; 
    height: 40px;
    margin-right: 10px;
}
</style>
  