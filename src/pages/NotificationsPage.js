import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCircle, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';
import OrderHistoryPage from './OrderHistoryPage';

const NotificationsPage = () => {
  const { user } = useAuth();
  const { orderHistory } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      let notiData;
      if (user.id === 'admin') {
        notiData = localStorage.getItem('notifications_admin');
      } else {
        notiData = localStorage.getItem(`notifications_${user.id}`);
      }
      setNotifications(notiData ? JSON.parse(notiData) : []);
    }
  }, [user]);

  if (!user) return null;

  const markNotificationRead = (id) => {
    if (!user) return;
    let key = user.id === 'admin' ? 'notifications_admin' : `notifications_${user.id}`;
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('notification-updated'));
  };

  const markAllAsRead = () => {
    if (!user) return;
    let key = user.id === 'admin' ? 'notifications_admin' : `notifications_${user.id}`;
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('notification-updated'));
  };

  const deleteNotification = (id) => {
    if (!user) return;
    let key = user.id === 'admin' ? 'notifications_admin' : `notifications_${user.id}`;
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('notification-updated'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const isWelcomeNotification = (msg) =>
    msg && msg.includes('Chào mừng bạn đến với ClothingStore');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-3">
                <Bell size={24} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                    {unreadCount} mới
                  </span>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có thông báo nào</h3>
            <p className="text-gray-500">Chúng tôi sẽ thông báo cho bạn khi có tin tức mới</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border p-6 transition-all duration-200 ${
                  notification.read 
                    ? 'opacity-75 border-gray-200' 
                    : 'border-blue-200 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        notification.read ? 'bg-gray-300' : 'bg-blue-500'
                      }`} />
                      <span className={`font-medium ${
                        notification.read ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.message}
                      </span>
                      {!notification.read && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Mới
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 ml-5">
                      {new Date(notification.time).toLocaleString('vi-VN')}
                    </div>
                    {/* Nếu là thông báo chào mừng thì hiển thị nút bổ sung thông tin */}
                    {isWelcomeNotification(notification.message) && (
                      <div className="mt-4 ml-5">
                        <button
                          onClick={() => navigate('/profile')}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          Bổ sung thông tin
                        </button>
                      </div>
                    )}
                    {notification.link && notification.link.startsWith('/orders?orderId=') ? (
                      <div className="mt-3 ml-5">
                        <button
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => {
                            // Lấy orderId từ link
                            const url = new URL('http://dummy' + notification.link);
                            const orderId = url.searchParams.get('orderId');
                            navigate(`/orders?orderId=${orderId}`);
                          }}
                        >
                          Xem chi tiết
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    ) : notification.link && user.id === 'admin' && notification.link.startsWith('/admin') ? (
                      <div className="mt-3 ml-5">
                        <button
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                          onClick={() => {
                            if (location.pathname === '/admin') {
                              // Gửi sự kiện custom để AdminDashboard chuyển tab
                              window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: { tab: 'orders' } }));
                            } else {
                              navigate('/admin?tab=orders');
                            }
                          }}
                        >
                          Xem chi tiết
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    ) : notification.link ? (
                      <div className="mt-3 ml-5">
                        <a
                          href={notification.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Xem chi tiết
                          <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markNotificationRead(notification.id)}
                        className="p-1 hover:bg-green-50 rounded transition-colors"
                        title="Đánh dấu đã đọc"
                      >
                        <CheckCircle size={16} className="text-green-600" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600"
                      title="Xóa thông báo"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal chi tiết đơn hàng nếu có */}
      {selectedOrder && (
        <OrderHistoryPage selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} isModal />
      )}
    </div>
  );
};

export default NotificationsPage; 