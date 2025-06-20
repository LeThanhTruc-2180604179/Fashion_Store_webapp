import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      // Kiểm tra mật khẩu hiện tại
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.id === user.id);
      
      if (!currentUser || currentUser.password !== formData.currentPassword) {
        setError('Mật khẩu hiện tại không đúng');
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
        setError(result.message);
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Thay Đổi Mật Khẩu</h2>
      
      {error && (
        <div className="flex items-center bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
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
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật Khẩu Mới
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác Nhận Mật Khẩu Mới
          </label>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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