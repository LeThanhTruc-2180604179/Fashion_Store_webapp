import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import OrderManager from '../components/admin/OrderManager';
import { Package, BarChart2, ShoppingBag, MessageCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import RevenueStatsPage from './RevenueStatsPage';
import NotFoundPage from './NotFoundPage';
import AdminChatPage from './AdminChatPage';

// Hàm đếm tổng số tin nhắn chưa đọc
function getUnreadMessagesCount() {
  const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
  let total = 0;
  Object.values(histories).forEach(msgs => {
    total += msgs.filter(msg => msg.from === 'user' && msg.seen === false).length;
  });
  return total;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('admin-switch-tab', handler);
    return () => window.removeEventListener('admin-switch-tab', handler);
  }, []);

  // Cập nhật số tin nhắn chưa đọc
  useEffect(() => {
    const updateUnreadCount = () => {
      setUnreadCount(getUnreadMessagesCount());
    };

    // Cập nhật lần đầu
    updateUnreadCount();

    // Lắng nghe sự thay đổi trong localStorage
    window.addEventListener('storage', updateUnreadCount);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', updateUnreadCount);
    };
  }, []);

  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold p-4">Dashboard Admin - Administrator</h1>
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center px-4 py-3 space-x-2 border-b-2 ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <ShoppingBag size={20} />
              <span>Quản Lý Đơn Hàng</span>
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center px-4 py-3 space-x-2 border-b-2 ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Package size={20} />
              <span>Quản Lý Sản Phẩm</span>
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center px-4 py-3 space-x-2 border-b-2 ${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <BarChart2 size={20} />
              <span>Thống Kê Doanh Thu</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-4 py-3 space-x-2 border-b-2 relative ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <MessageCircle size={20} />
              <span>Quản Lý Chat</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'revenue' && <RevenueStatsPage />}
        {activeTab === 'chat' && <AdminChatPage />}
      </div>
    </div>
  );
};

export default AdminDashboard;