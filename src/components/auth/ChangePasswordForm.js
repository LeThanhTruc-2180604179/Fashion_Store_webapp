import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, updateProfile } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới.';
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      // Kiểm tra mật khẩu hiện tại
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.id === user.id);
      if (!currentUser || currentUser.password !== formData.currentPassword) {
        setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng.' });
        setLoading(false);
        return;
      }
      // Cập nhật mật khẩu mới
      const result = await updateProfile({
        ...currentUser,
        password: formData.newPassword
      });
      if (result.success) {
        setSuccess('Mật khẩu đã được thay đổi thành công');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setErrors({ general: result.message });
      }
    } catch (err) {
      setErrors({ general: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thay Đổi Mật Khẩu</h2>
      {errors.general && (
        <div className="flex items-center bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span>{errors.general}</span>
        </div>
      )}
      {success && (
        <div className="flex items-center bg-green-100 text-green-600 p-3 rounded-lg mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span>{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật Khẩu Hiện Tại
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              onClick={() => setShowCurrent((v) => !v)}
            >
              {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.currentPassword && <div className="text-red-500 text-sm mt-1">{errors.currentPassword}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật Khẩu Mới
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              onClick={() => setShowNew((v) => !v)}
            >
              {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.newPassword && <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác Nhận Mật Khẩu Mới
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Đang xử lý...' : 'Thay Đổi Mật Khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm; 