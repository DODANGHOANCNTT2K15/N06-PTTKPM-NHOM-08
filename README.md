# Backend cho Ứng Dụng Web Bán Sách (Thương Mại Điện Tử) với Node.js và Express

Phần mềm bán sách này sử dụng **Node.js** kết hợp với **Express.js** để xây dựng backend, giúp quản lý các yêu cầu từ người dùng và cung cấp các API cho giao diện người dùng. **Node.js** được chọn vì khả năng xử lý các yêu cầu đồng thời hiệu quả, phù hợp với môi trường thương mại điện tử, nơi có lượng truy cập lớn và cần đáp ứng nhanh chóng.

## Cấu trúc Backend:
- **Node.js**: Là nền tảng JavaScript phía server, **Node.js** cho phép xử lý các tác vụ bất đồng bộ một cách nhanh chóng và hiệu quả.
- **Express.js**: Là framework cho **Node.js**, giúp dễ dàng tạo và quản lý các API, xử lý các route HTTP (GET, POST, PUT, DELETE) để giao tiếp với frontend.

## Các tính năng chính của Backend:
- **Quản lý Sản Phẩm**: Backend cung cấp các API để quản lý sách, bao gồm thêm mới, chỉnh sửa, xóa và tìm kiếm sản phẩm (sách) theo các tiêu chí như tên, tác giả, thể loại, và giá cả.
- **Quản lý Giỏ Hàng**: Cho phép người dùng thêm, xóa hoặc cập nhật sản phẩm trong giỏ hàng của họ. Mỗi giỏ hàng sẽ được lưu trữ dưới dạng session hoặc trong cơ sở dữ liệu để duy trì trạng thái.
- **Quản lý Đơn Hàng**: API xử lý quy trình thanh toán và xác nhận đơn hàng. Sau khi khách hàng thanh toán, hệ thống sẽ tạo đơn hàng mới và cập nhật trạng thái vận chuyển.
- **Xử lý Thanh Toán**: Tích hợp với các cổng thanh toán như PayPal hoặc Stripe để thực hiện các giao dịch an toàn và thuận tiện cho người dùng.
- **Quản lý Người Dùng**: Cung cấp các API cho việc đăng ký, đăng nhập, cập nhật thông tin cá nhân, và theo dõi đơn hàng của người dùng. Hệ thống sử dụng **JSON Web Tokens (JWT)** để xác thực người dùng và bảo mật các giao dịch.
- **Tìm Kiếm và Lọc Sản Phẩm**: Hỗ trợ tính năng tìm kiếm sách theo từ khóa, thể loại, hoặc giá. Các bộ lọc giúp khách hàng tìm được sản phẩm phù hợp nhanh chóng.
- **Cơ Sở Dữ Liệu**: Backend sử dụng **MySQL** để lưu trữ dữ liệu người dùng, sách, đơn hàng và giỏ hàng. Dữ liệu sẽ được cấu trúc dưới dạng bảng trong MySQL.

## Bảo Mật và Hiệu Năng:
- **Xác thực và Phân quyền**: Sử dụng **JWT** để xác thực người dùng, bảo vệ các API khỏi những truy cập trái phép.
- **Caching**: Các kết quả tìm kiếm sách hoặc giỏ hàng có thể được lưu trữ tạm thời trong bộ nhớ (cache) để giảm thiểu số lần truy cập cơ sở dữ liệu, nâng cao hiệu suất hệ thống.
- **Xử lý lỗi và Logging**: Mỗi yêu cầu và phản hồi từ server sẽ được ghi lại trong log, giúp quản trị viên dễ dàng theo dõi và xử lý sự cố.
