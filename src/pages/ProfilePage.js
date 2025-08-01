import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, Eye, EyeOff, User, Package, Tag, LogOut } from 'lucide-react';
import DiscountCodesPage from './DiscountCodesPage';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    country: 'Việt Nam',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 4;
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Thêm danh sách quốc gia và thành phố
  const VIETNAM_CITIES = [
    'Hà Nội', 'TP.HCM', 'Hải Phòng', 'Cần Thơ', 'Đà Nẵng', 'Biên Hòa', 'Hải Dương', 'Huế', 'Thuận An', 'Thủ Đức'
  ];
  const COUNTRY_CITY = {
    'Việt Nam': VIETNAM_CITIES,
    'Mỹ': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'San Francisco'],
    'Hàn Quốc': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon'],
    'Nhật Bản': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo'],
    'Trung Quốc': ['Bắc Kinh', 'Thượng Hải', 'Quảng Châu', 'Thâm Quyến', 'Thành Đô'],
    'Anh': ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'],
    'Thái Lan': ['Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'Khon Kaen'],
    'Pháp': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice'],
    'Đức': ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
  };
  const COUNTRY_LIST = Object.keys(COUNTRY_CITY);

  const [selectedCountry, setSelectedCountry] = useState(formData.country || 'Việt Nam');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || 'Việt Nam',
      });
      setSelectedCountry(user.country || 'Việt Nam');
      // Lấy lịch sử mua hàng từ localStorage
      const ordersData = localStorage.getItem(`orders_${user.id}`);
      setOrders(ordersData ? JSON.parse(ordersData) : []);
    }
  }, [user]);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setFormData({ ...formData, country, city: '' });
  };

  const handleCityChange = (e) => {
    setFormData({ ...formData, city: e.target.value });
  };

  const validatePasswordFields = () => {
    const errors = {};
    if (!passwordData.oldPassword) errors.oldPassword = 'Vui lòng nhập mật khẩu cũ';
    if (!passwordData.newPassword) errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (!passwordRegex.test(passwordData.newPassword)) errors.newPassword = 'Mật khẩu mới phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt, tối thiểu 8 ký tự';
    if (!passwordData.confirmPassword) errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    else if (passwordData.newPassword !== passwordData.confirmPassword) errors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    return errors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    if (showPasswordFields) {
      const errors = validatePasswordFields();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      // Kiểm tra mật khẩu cũ
      let currentPassword = '';
      if (user.id === 'admin') {
        currentPassword = 'Aa123456@';
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.id === user.id);
        currentPassword = found ? found.password : '';
      }
      if (passwordData.oldPassword !== currentPassword) {
        setFieldErrors({ oldPassword: 'Mật khẩu cũ không đúng' });
        return;
      }
      // Cập nhật mật khẩu mới
      const result = await updateProfile({ ...user, ...formData, password: passwordData.newPassword });
      if (result.success) {
        setSuccess('Đổi mật khẩu thành công!');
        setShowPasswordFields(false);
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setError(result.message || 'Có lỗi xảy ra');
      }
      return;
    }
    // Cập nhật thông tin cá nhân
    const result = await updateProfile({ ...user, ...formData });
    if (result.success) {
      setSuccess('Cập nhật thành công!');
    } else {
      setError(result.message || 'Có lỗi xảy ra');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: 'Việt Nam',
    });
    setError('');
    setSuccess('');
    setShowPasswordFields(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setFieldErrors({});
  };

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const paginatedOrders = orders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Tab icon nav: chỉ hiện trên mobile */}
      <div className="w-full md:hidden flex justify-between items-center mb-4 px-2 bg-gray-50 rounded-b-xl shadow-md">
        <button onClick={() => setActiveTab('profile')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'}`} aria-label="Edit Profile">
          <User size={22} />
        </button>
        <button onClick={() => setActiveTab('orders')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'orders' ? 'text-blue-600' : 'text-gray-500'}`} aria-label="Lịch sử mua hàng">
          <Package size={22} />
        </button>
        <button onClick={() => setActiveTab('discounts')} className={`flex-1 flex flex-col items-center py-2 ${activeTab === 'discounts' ? 'text-blue-600' : 'text-gray-500'}`} aria-label="Mã giảm giá">
          <Tag size={22} />
        </button>
        <button onClick={() => { if(window.confirm('Bạn có chắc muốn đăng xuất?')) { navigate('/'); window.localStorage.removeItem('user'); window.location.reload(); } }} className="flex-1 flex flex-col items-center py-2 text-red-500" aria-label="Đăng xuất">
          <LogOut size={22} />
        </button>
      </div>
      {/* Tab nav: vertical on desktop */}
      <div className="hidden md:flex w-full md:w-64 flex-col bg-gray-50 py-4 md:py-10 px-2 md:px-6 border-b md:border-b-0 flex-shrink-0 items-center md:items-start rounded-xl shadow-md md:ml-4 md:mt-8">
        <button className="mb-2 md:mb-8 text-blue-600 font-semibold text-left w-auto md:w-full self-start md:self-auto" onClick={() => navigate(-1)}>&lt; Back</button>
        <div className="w-full flex-col gap-3 mb-2">
          <button
            className={`flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg border transition-all duration-150 w-full ${activeTab === 'profile' ? 'text-blue-600 bg-blue-50 border-blue-600 shadow' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700 border-transparent'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} /> Edit Profile
          </button>
          <button
            className={`flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg border transition-all duration-150 w-full ${activeTab === 'orders' ? 'text-blue-600 bg-blue-50 border-blue-600 shadow' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700 border-transparent'}`}
            onClick={() => setActiveTab('orders')}
          >
            <Package size={20} /> Lịch sử mua hàng
          </button>
          <button
            className={`flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg border transition-all duration-150 w-full ${activeTab === 'discounts' ? 'text-blue-600 bg-blue-50 border-blue-600 shadow' : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700 border-transparent'}`}
            onClick={() => setActiveTab('discounts')}
          >
            <Tag size={20} /> Mã giảm giá
          </button>
          <button
            className="flex items-center gap-2 font-semibold text-center px-4 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 transition-all duration-150 w-full"
            onClick={() => { if(window.confirm('Bạn có chắc muốn đăng xuất?')) { navigate('/'); window.localStorage.removeItem('user'); window.location.reload(); } }}
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col px-2 md:px-0 pt-4 md:pt-8 w-full max-w-5xl mx-auto">
        <div className="w-full max-w-5xl ml-0 md:ml-10 px-0 md:px-0">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h2 className="text-2xl font-bold mb-8">Edit profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <div className="relative">
                    <input type="email" value={user.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">&#10003;</span>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Họ tên</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Địa chỉ</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Quốc gia</label>
                  <select
                    name="country"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    {COUNTRY_LIST.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Thành phố</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleCityChange}
                    className="w-full border rounded px-3 py-2 max-h-32 overflow-y-auto"
                    required
                  >
                    <option value="">-- Chọn thành phố --</option>
                    {COUNTRY_CITY[selectedCountry].map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center mt-0 md:mt-6 w-full md:w-auto">
                  <label className="block mb-1 font-medium w-full md:w-32">Password</label>
                  <div className="flex w-full md:w-auto">
                    <input type="password" value={"***************"} disabled className="flex-1 border rounded px-3 py-2 bg-gray-100" />
                    <button type="button" className="ml-0 md:ml-2 mt-2 md:mt-0 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-semibold w-full md:w-auto" 
                      onClick={() => {
                        setShowPasswordFields(!showPasswordFields);
                        if (!showPasswordFields) {
                          setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                          setFieldErrors({});
                        }
                      }}
                    >EDIT</button>
                  </div>
                </div>
                {showPasswordFields && (
                  <>
                    <div>
                      <label className="block mb-1 font-medium">Nhập lại mật khẩu cũ</label>
                      <div className="relative">
                        <input type={showPassword.old ? 'text' : 'password'} name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2 pr-10" autoComplete="current-password" />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" tabIndex={-1} onClick={() => setShowPassword(s => ({ ...s, old: !s.old }))}>{showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      {fieldErrors.oldPassword && <div className="text-red-500 text-sm mt-1">{fieldErrors.oldPassword}</div>}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Mật khẩu mới</label>
                      <div className="relative">
                        <input type={showPassword.new ? 'text' : 'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2 pr-10" autoComplete="new-password" />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" tabIndex={-1} onClick={() => setShowPassword(s => ({ ...s, new: !s.new }))}>{showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      {fieldErrors.newPassword && <div className="text-red-500 text-sm mt-1">{fieldErrors.newPassword}</div>}
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                      <div className="relative">
                        <input type={showPassword.confirm ? 'text' : 'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full border rounded px-3 py-2 pr-10" autoComplete="new-password" />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" tabIndex={-1} onClick={() => setShowPassword(s => ({ ...s, confirm: !s.confirm }))}>{showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                      {fieldErrors.confirmPassword && <div className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</div>}
                    </div>
                  </>
                )}
              </div>
              {error && <div className="mb-4 text-red-500 mt-4">{error}</div>}
              {success && <div className="mb-4 text-green-600 mt-4">{success}</div>}
              <div className="flex justify-end space-x-4 mt-8">
                <button type="button" className="px-6 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-semibold" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700">Save</button>
              </div>
            </form>
          )}
          {activeTab === 'orders' && (
            <div className="flex flex-col items-center w-full pb-16">
              <h2 className="text-2xl font-bold mb-8 w-full max-w-3xl mx-auto">Lịch sử mua hàng</h2>
              {orders.length === 0 ? (
                <div className="text-gray-500">Bạn chưa có đơn hàng nào.</div>
              ) : (
                <div className="w-full flex flex-col items-center">
                  {paginatedOrders.map((order, idx) => (
                    <div key={order.id || idx} className="bg-gray-50 rounded-2xl shadow-lg border p-6 mb-8 w-full max-w-3xl mx-auto">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-base">Đơn hàng #{order.id || idx + 1}</div>
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">Đang xử lý</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <span className="mr-4">Ngày đặt: {order.date || '---'}</span>
                      </div>
                      {/* Danh sách sản phẩm */}
                      <div className="space-y-2 mb-2">
                        {order.items && order.items.length > 0 ? order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded border" />
                            )}
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{item.name}</div>
                              <div className="text-xs text-gray-500">{item.quantity} x {item.price.toLocaleString()}đ</div>
                            </div>
                          </div>
                        )) : <div className="text-gray-400 italic">Không có sản phẩm</div>}
                      </div>
                      <div className="flex justify-end items-center mt-2">
                        <span className="font-semibold text-base">Tổng cộng:&nbsp;</span>
                        <span className="font-bold text-lg text-blue-700">{order.total ? order.total.toLocaleString() : '---'}đ</span>
                      </div>
                    </div>
                  ))}
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <button
                        className={`px-3 py-1 rounded border ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &lt;
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          className={`px-3 py-1 rounded border ${currentPage === i + 1 ? 'bg-blue-600 text-white font-bold' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className={`px-3 py-1 rounded border ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeTab === 'discounts' && (
            <DiscountCodesPage />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 