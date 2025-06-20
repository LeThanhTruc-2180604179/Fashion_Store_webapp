# Hướng dẫn test tính năng thông báo

## Các tính năng đã được thêm:

### 1. Icon chuông thông báo ở Header
- Hiển thị icon chuông với số thông báo chưa đọc
- Click vào icon chuông sẽ chuyển đến trang thông báo
- Có cả trên desktop và mobile

### 2. Trang thông báo riêng biệt (/notifications)
- Giao diện đẹp với danh sách thông báo
- Có thể đánh dấu đã đọc từng thông báo
- Có thể đánh dấu tất cả đã đọc
- Có thể xóa thông báo
- Hiển thị thời gian thông báo

### 3. Thông báo chào mừng cho người dùng mới
- Khi đăng ký tài khoản mới
- Khi đăng nhập lần đầu (nếu chưa có thông tin đầy đủ)
- Popup chào mừng với nút "Bổ sung thông tin"
- Nút "Bổ sung thông tin" chuyển đến trang profile

### 4. Thông báo cập nhật tài khoản
- Khi cập nhật thông tin profile
- Khi đổi mật khẩu
- Giữ lại thông báo cũ để có nhiều thông báo

### 5. Bỏ nút thông báo trong ProfilePage
- Đã bỏ tab thông báo trong ProfilePage
- Chỉ còn 2 tab: Edit Profile và Lịch sử mua hàng

## Cách test:

1. **Đăng ký tài khoản mới:**
   - Đăng ký tài khoản mới
   - Sẽ có popup chào mừng hiện ra
   - Click "Bổ sung thông tin" sẽ chuyển đến trang profile
   - Có thông báo trong hệ thống

2. **Đăng nhập tài khoản cũ (chưa có thông tin đầy đủ):**
   - Đăng nhập tài khoản chưa có phone, address, city
   - Sẽ có thông báo chào mừng
   - Có popup chào mừng

3. **Cập nhật thông tin:**
   - Vào trang profile
   - Cập nhật thông tin
   - Sẽ có thông báo mới "Cập nhật tài khoản thành công"
   - Thông báo cũ vẫn còn

4. **Xem thông báo:**
   - Click icon chuông ở header
   - Xem danh sách thông báo
   - Test các chức năng đánh dấu đã đọc, xóa thông báo

## Lưu ý:
- Thông báo được lưu trong localStorage
- Mỗi người dùng có key riêng: `notifications_${userId}`
- Popup chào mừng chỉ hiển thị 1 lần cho mỗi người dùng 