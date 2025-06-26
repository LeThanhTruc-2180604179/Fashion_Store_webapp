# TESTER LƯU Ý ĐỌC KĨ README GIÚP MÌNH ĐẶC BIỆT LÀ MỤC ## 3 TÀI KHOẢN ADMIN VÀ CHỨC NĂNG MÃ GIẢM GIÁ NHÉ. 

## 1. Giới thiệu
ClothingStore là webapp bán hàng thời trang hiện đại, hỗ trợ đầy đủ các chức năng mua sắm, quản lý đơn hàng, quản lý sản phẩm, chat hỗ trợ khách hàng, thông báo, mã giảm giá, v.v. Giao diện đẹp, dễ sử dụng, tối ưu cho cả desktop và mobile.


## 2. Hướng dẫn cài đặt & chạy project

### Yêu cầu
- Node.js >= 16
- npm >= 8

### Cài đặt
```bash
npm install
```

### Chạy local
```bash
npm start
```
Truy cập: http://localhost:3000



-------------------------------------------------------LƯU Ý----------------------------------------------------------
## 3. Tài khoản có sẵn (Admin)

- **Email: Admin@gmail.com
- **Mật khẩu: Aa123456@

> Đăng nhập bằng tài khoản trên để truy cập Dashboard Admin và các chức năng quản trị.

-----------------------------------------------------------------------------------------------------------------
## 4. Danh sách chức năng & hướng dẫn sử dụng

### 4.1. Chức năng cho khách hàng

#### Trang chủ (/)  
- Banner, slider thương hiệu, sản phẩm mới, sản phẩm giảm giá, blog, form liên hệ, bản đồ.
- Điều hướng nhanh đến shop, giỏ hàng, wishlist, lịch sử đơn hàng.

#### Đăng ký/Đăng nhập (/register, /login)
- Đăng ký tài khoản mới, đăng nhập tài khoản đã có.
- Thông báo lỗi khi nhập sai/thông tin thiếu.

#### Cửa hàng (/shop)
- Xem tất cả sản phẩm, lọc theo danh mục, thương hiệu, giá, tìm kiếm, phân trang.
- Xem sản phẩm mới, sản phẩm giảm giá, sản phẩm theo danh mục.

#### Chi tiết sản phẩm (/product/:id)
- Xem thông tin chi tiết, hình ảnh, mô tả, đánh giá, sản phẩm liên quan.
- Thêm vào giỏ hàng, wishlist.

#### Giỏ hàng (/cart)
- Xem, sửa, xóa sản phẩm trong giỏ.
- Tính tổng tiền, phí ship, áp dụng mã giảm giá.

#### Thanh toán (/checkout)
- Nhập thông tin giao hàng, chọn phương thức thanh toán (COD).
- Áp dụng mã giảm giá.
- Đặt hàng, nhận thông báo thành công.

#### Lịch sử đơn hàng (/orders)
- Xem danh sách đơn hàng đã đặt, trạng thái, chi tiết từng đơn.
- Đánh giá sản phẩm đã mua.
- Nhận mã giảm giá khi đơn hàng đủ điều kiện.

#### Wishlist (/wishlist)
- Lưu lại các sản phẩm yêu thích.

#### Thông báo (/notifications)
- Nhận thông báo về đơn hàng, tài khoản, khuyến mãi, v.v.
- Đánh dấu đã đọc, xóa thông báo, xem chi tiết.

#### Quản lý tài khoản (/profile)
- Cập nhật thông tin cá nhân, đổi mật khẩu.
- Xem lịch sử mua hàng, mã giảm giá.

#### Mã giảm giá (/discount-codes)
- Xem danh sách mã giảm giá, trạng thái (còn hiệu lực, đã dùng, hết hạn).

#### Chat hỗ trợ khách hàng (nút Chat góc phải)
- Gửi yêu cầu kiểm tra đơn hàng, chat với admin.
- Nhận phản hồi trực tiếp từ admin.

#### Popup chào mừng
- Hiện popup chào mừng khi đăng ký/lần đầu đăng nhập, nhắc bổ sung thông tin cá nhân.

---

### 4.2. Chức năng cho Admin

#### Dashboard Admin (/admin)
- Quản lý đơn hàng: xem, lọc, cập nhật trạng thái, xem chi tiết, gửi thông báo cho khách.
- Quản lý sản phẩm: thêm, sửa, xóa, tìm kiếm, phân trang.
- Thống kê doanh thu: xem biểu đồ doanh thu theo ngày/tháng/năm/tổng.
- Quản lý chat: xem, trả lời tin nhắn khách hàng theo từng user.

#### Quản lý thông báo
- Nhận thông báo khi có đơn hàng mới, cập nhật trạng thái đơn, phản hồi chat, v.v.



## 5. Một số lưu ý
- Mỗi người dùng có thông báo, đơn hàng, wishlist, mã giảm giá riêng.
- Admin không thể đặt hàng, không có wishlist/giỏ hàng.



## 7. Công nghệ sử dụng
- ReactJS, React Router, Context API
- TailwindCSS, Chart.js, Lucide Icons
- LocalStorage (demo data)

---

