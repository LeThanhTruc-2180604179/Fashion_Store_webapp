import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Truck, Clock, Eye } from 'lucide-react';

const OrderManager = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchOrderId, setSearchOrderId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 5;

  // Load all orders from all users
  useEffect(() => {
    const loadAllOrders = () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const allOrdersData = [];
      
      // Get orders from regular users
      users.forEach(user => {
        const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
        userOrders.forEach(order => {
          allOrdersData.push({
            ...order,
            customerName: user.name,
            customerEmail: user.email
          });
        });
      });
      
      // Sort by order date (newest first)
      allOrdersData.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setAllOrders(allOrdersData);
    };

    loadAllOrders();
    
    // Listen for order updates
    const handleOrderUpdate = () => {
      loadAllOrders();
    };
    
    window.addEventListener('order-updated', handleOrderUpdate);
    return () => {
      window.removeEventListener('order-updated', handleOrderUpdate);
    };
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    users.forEach(user => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
      const orderIndex = userOrders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        userOrders[orderIndex].status = newStatus;
        userOrders[orderIndex].updatedAt = new Date().toISOString();
        
        // Add status update timestamp
        if (!userOrders[orderIndex].statusHistory) {
          userOrders[orderIndex].statusHistory = [];
        }
        userOrders[orderIndex].statusHistory.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          updatedBy: 'admin'
        });
        
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(userOrders));
        
        // Add notification for user
        const statusMessages = {
          'confirmed': 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị! 📦',
          'shipped': 'Đơn hàng của bạn đã được gửi đi! 🚚',
          'delivered': 'Đơn hàng của bạn đã được giao thành công! ✅',
          'cancelled': 'Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ nếu có thắc mắc.'
        };
        
        if (statusMessages[newStatus]) {
          const notifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
          notifications.unshift({
            id: Date.now(),
            message: statusMessages[newStatus],
            link: `/orders?orderId=${orderId}`,
            read: false,
            time: new Date().toISOString(),
          });
          localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
        }
      }
    });
    
    // Update local state
    setAllOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
    
    // Trigger event for other components
    window.dispatchEvent(new CustomEvent('order-updated'));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-yellow-100 text-yellow-600';
      case 'confirmed': return 'bg-blue-100 text-blue-600';
      case 'shipped': return 'bg-purple-100 text-purple-600';
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing': return 'Đang xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  // Lọc theo search
  const filteredOrders = (filterStatus === 'all' ? allOrders : allOrders.filter(order => order.status === filterStatus))
    .filter(order => order.id.includes(searchOrderId));
  // Phân trang
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ORDERS_PER_PAGE, currentPage * ORDERS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={searchOrderId}
          onChange={e => { setSearchOrderId(e.target.value); setCurrentPage(1); }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 mr-4"
        />
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              &lt;
            </button>
            <span>Trang {currentPage}/{totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lọc Đơn Hàng</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tất cả ({allOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('processing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'processing' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đang xử lý ({allOrders.filter(o => o.status === 'processing').length})
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'confirmed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã xác nhận ({allOrders.filter(o => o.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'shipped' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã gửi hàng ({allOrders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'delivered' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Đã giao hàng ({allOrders.filter(o => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh Sách Đơn Hàng</h3>
        {paginatedOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Không có đơn hàng nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Đơn hàng #{order.id}</h4>
                    <p className="text-sm text-gray-600">
                      Khách hàng: {order.customerName} ({order.customerEmail})
                    </p>
                    <p className="text-sm text-gray-600">
                      Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {order.items.length} sản phẩm • Tổng: {(order.total - (order.discountValue || 0)).toLocaleString()}đ
                    {order.discountValue > 0 && order.discountCode ? (
                      <span className="text-xs text-green-700 ml-2">(Đã áp dụng mã {order.discountCode})</span>
                    ) : null}
                  </div>
                  <div className="flex space-x-2">
                    {order.status === 'processing' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          Xác nhận
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'shipped')}
                        className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        Gửi hàng
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Đã giao
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Chi tiết đơn hàng #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Thông tin khách hàng</h4>
                <p className="text-sm text-gray-600">Tên: {selectedOrder.customerName}</p>
                <p className="text-sm text-gray-600">Email: {selectedOrder.customerEmail}</p>
                <p className="text-sm text-gray-600">Địa chỉ: {selectedOrder.shippingAddress.address}</p>
                <p className="text-sm text-gray-600">Thành phố: {selectedOrder.shippingAddress.city}</p>
                <p className="text-sm text-gray-600">SĐT: {selectedOrder.shippingAddress.phone}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Sản phẩm</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center border-t border-gray-200 pt-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {item.price.toLocaleString()}đ • {item.color} • {item.size}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Giá gốc:</span>
                  <span>{selectedOrder.total.toLocaleString()}đ</span>
                </div>
                {selectedOrder.discountCode && selectedOrder.discountValue > 0 && (
                  <div className="flex justify-between text-sm text-green-700 font-semibold mt-2">
                    <span>Mã giảm giá ({selectedOrder.discountCode}):</span>
                    <span>-{selectedOrder.discountValue.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                  <span>Khách phải trả:</span>
                  <span className="text-blue-600">{(selectedOrder.total - (selectedOrder.discountValue || 0)).toLocaleString()}đ</span>
                </div>
              </div>
              
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lịch sử trạng thái</h4>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <span className="w-24">{getStatusText(history.status)}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(history.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager; 