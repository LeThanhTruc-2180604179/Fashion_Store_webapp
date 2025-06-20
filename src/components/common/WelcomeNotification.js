import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, X, ArrowRight } from 'lucide-react';

const WelcomeNotification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (user && user.id !== 'admin') {
      // Kiểm tra xem người dùng đã có thông tin đầy đủ chưa
      const hasCompleteInfo = user.phone && user.address && user.city;
      if (!hasCompleteInfo) {
        // Kiểm tra xem đã hiển thị thông báo chào mừng chưa
        const hasShownWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
        if (!hasShownWelcome) {
          // Kiểm tra xem có thông báo chào mừng trong hệ thống không
          const notifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
          const hasWelcomeNotification = notifications.some(n => n.message.includes('Chào mừng bạn đến với ClothingStore'));
          if (hasWelcomeNotification) {
            setShowNotification(true);
            localStorage.setItem(`welcome_shown_${user.id}`, 'true');
          }
        }
      }
    }
  }, [user]);

  const handleClose = () => {
    setShowNotification(false);
  };

  const handleUpdateProfile = () => {
    setShowNotification(false);
    navigate('/profile');
  };

  if (!showNotification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Bell size={32} className="text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chào mừng bạn! 🎉
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Vui lòng cập nhật thêm thông tin địa chỉ và số điện thoại của bạn để dễ dàng đặt hàng và nhận được những ưu đãi tốt nhất từ chúng tôi.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleUpdateProfile}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Bổ sung thông tin</span>
            <ArrowRight size={18} />
          </button>
          <button
            onClick={handleClose}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeNotification; 