import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      // Admin hardcoded
      if (email === 'Admin@gmail.com' && password === 'Aa123456@') {
        // Nếu đã có profile admin trong localStorage thì lấy ra
        const adminProfile = localStorage.getItem('admin_profile');
        let adminUser;
        if (adminProfile) {
          adminUser = JSON.parse(adminProfile);
        } else {
          adminUser = {
            id: 'admin',
            email: 'Admin@gmail.com',
            name: 'Administrator',
            role: 'admin'
          };
        }
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
      // Check regular user credentials (demo purposes)
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        // Gửi thông báo chào mừng/mẹo chỉ 1 lần duy nhất cho mỗi user
        if (!localStorage.getItem(`welcome_noti_${userWithoutPassword.id}`)) {
          addNotification(userWithoutPassword.id, 'Chào mừng bạn đến với ClothingStore! 🎉 Vui lòng cập nhật thêm thông tin địa chỉ và số điện thoại của bạn để dễ dàng đặt hàng.');
          localStorage.setItem(`welcome_noti_${userWithoutPassword.id}`, '1');
        }
        if (!localStorage.getItem(`tip_noti_${userWithoutPassword.id}`)) {
          addNotification(userWithoutPassword.id, '💡 Mẹo: Bạn có thể lưu địa chỉ giao hàng để đặt hàng nhanh hơn!');
          localStorage.setItem(`tip_noti_${userWithoutPassword.id}`, '1');
        }
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, message: 'Email hoặc mật khẩu không đúng' };
    } catch (error) {
      return { success: false, message: 'Đã có lỗi xảy ra' };
    }
  };

  // Register function (only allow user role)
  const register = async (userData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(u => u.email === userData.email) || userData.email === 'Admin@gmail.com') {
        return { success: false, message: 'Email đã được sử dụng' };
      }
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        role: 'user'
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      const userWithoutPassword = { ...newUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      // Thông báo chào mừng/mẹo chỉ tạo 1 lần
      localStorage.setItem(`welcome_noti_${userWithoutPassword.id}`, '1');
      localStorage.setItem(`tip_noti_${userWithoutPassword.id}`, '1');
      addNotification(userWithoutPassword.id, 'Chào mừng bạn đến với ClothingStore! 🎉 Vui lòng cập nhật thêm thông tin địa chỉ và số điện thoại của bạn để dễ dàng đặt hàng.');
      addNotification(userWithoutPassword.id, '💡 Mẹo: Bạn có thể lưu địa chỉ giao hàng để đặt hàng nhanh hơn!');
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, message: 'Đã có lỗi xảy ra' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Update profile function
  const addNotification = (userId, message, link = null) => {
    const key = `notifications_${userId}`;
    const notifications = JSON.parse(localStorage.getItem(key) || '[]');
    notifications.unshift({
      id: Date.now(),
      message,
      link,
      read: false,
      time: new Date().toISOString(),
    });
    localStorage.setItem(key, JSON.stringify(notifications));
  };

  const updateProfile = async (userData) => {
    try {
      if (!user) return { success: false, message: 'Chưa đăng nhập' };
      let isPasswordChange = !!userData.password;
      if (user.id === 'admin') {
        const updatedAdmin = { ...user, ...userData };
        setUser(updatedAdmin);
        localStorage.setItem('user', JSON.stringify(updatedAdmin));
        localStorage.setItem('admin_profile', JSON.stringify(updatedAdmin));
        addNotification(updatedAdmin.id, isPasswordChange ? 'Bạn đã đổi mật khẩu thành công.' : 'Bạn đã cập nhật thông tin tài khoản thành công.');
        return { success: true, user: updatedAdmin };
      }
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex === -1) {
        return { success: false, message: 'Không tìm thấy người dùng' };
      }
      const prevUser = users[userIndex];
      const updatedUser = { ...users[userIndex], ...userData };
      users[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
      const userWithoutPassword = { ...updatedUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Kiểm tra trường nào đã cập nhật
      const changedFields = [];
      if (userData.phone && userData.phone !== prevUser.phone) changedFields.push('số điện thoại');
      if (userData.address && userData.address !== prevUser.address) changedFields.push('địa chỉ');
      if (userData.city && userData.city !== prevUser.city) changedFields.push('thành phố');
      if (userData.country && userData.country !== prevUser.country) changedFields.push('quốc gia');
      // Kiểm tra trường nào còn thiếu
      const missingFields = [];
      if (!userWithoutPassword.phone) missingFields.push('số điện thoại');
      if (!userWithoutPassword.address) missingFields.push('địa chỉ');
      if (!userWithoutPassword.city) missingFields.push('thành phố');
      if (!userWithoutPassword.country) missingFields.push('quốc gia');
      let message = '';
      if (isPasswordChange) {
        message = 'Bạn đã đổi mật khẩu thành công.';
      } else if (changedFields.length > 0) {
        message = `Bạn đã cập nhật thành công ${changedFields.join(', ')}.`;
        if (missingFields.length > 0) {
          message += ` Hãy bổ sung thêm (${missingFields.join(', ')}) để dễ dàng đặt hàng qua trang web.`;
        } else {
          message = 'Bạn đã cập nhật đầy đủ thông tin tài khoản thành công!';
        }
      } else {
        message = 'Bạn đã cập nhật thông tin tài khoản.';
      }
      addNotification(userWithoutPassword.id, message);
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, message: 'Đã có lỗi xảy ra' };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};