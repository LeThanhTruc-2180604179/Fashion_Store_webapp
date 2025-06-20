import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, MapPin, Star } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { addDiscountCode, generateDiscountCode, getDiscountCodes } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/product/ReviewModal';

const OrderHistoryPage = (props) => {
  const { orderHistory } = useCart();
  const [selectedOrderState, setSelectedOrderState] = useState(null);
  const selectedOrder = props.selectedOrder || selectedOrderState;
  const setSelectedOrder = props.setSelectedOrder || setSelectedOrderState;
  const [showDiscountMsg, setShowDiscountMsg] = useState(null);
  const { user } = useAuth();
  const [orderHistoryState, setOrderHistoryState] = useState([]);
  const [reviewModal, setReviewModal] = useState({ open: false, product: null });
  const [activeReviewProduct, setActiveReviewProduct] = useState(null);

  useEffect(() => {
    if (user) {
      const orders = localStorage.getItem(`orders_${user.id}`);
      setOrderHistoryState(orders ? JSON.parse(orders) : []);
    }
  }, [user]);

  useEffect(() => {
    orderHistoryState.forEach(order => {
      handleGenerateDiscount(order);
    });
    // eslint-disable-next-line
  }, [orderHistoryState]);

  if (!user) return <Navigate to="/login" />;

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

  const getStatusDescription = (status) => {
    switch (status) {
      case 'processing': return 'Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ xác nhận sớm nhất có thể.';
      case 'confirmed': return 'Đơn hàng đã được xác nhận và đang được chuẩn bị để gửi hàng.';
      case 'shipped': return 'Đơn hàng đã được gửi đi và đang trên đường đến bạn.';
      case 'delivered': return 'Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!';
      case 'cancelled': return 'Đơn hàng đã bị hủy. Vui lòng liên hệ hỗ trợ nếu có thắc mắc.';
      default: return '';
    }
  };

  const getEstimatedDelivery = (orderDate) => {
    const order = new Date(orderDate);
    const estimated = new Date(order.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return estimated.toLocaleDateString('vi-VN');
  };

  // Hàm kiểm tra và sinh mã giảm giá khi đơn giao thành công
  const handleGenerateDiscount = (order) => {
    // Kiểm tra nếu user đã từng có mã giảm giá 20tr thì không sinh nữa
    const existed20MDiscount = getDiscountCodes(user.id).some(c => c.discountValue === 1000000);
    if (existed20MDiscount) return;

    // Lấy lại userOrders mới nhất từ localStorage
    const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`) || '[]');
    const currentOrder = userOrders.find(o => o.id === order.id);
    if (order.status === 'delivered' && order.total >= 20000000 && (!currentOrder || !currentOrder.discountGenerated)) {
      const code = generateDiscountCode();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 tháng
      addDiscountCode(user.id, {
        code,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        used: false,
        discountValue: 1000000 // ví dụ giảm 1 triệu
      });
      setShowDiscountMsg({ code, expiresAt });
      // Đánh dấu đơn đã sinh mã để không lặp lại
      if (currentOrder) {
        currentOrder.discountGenerated = true;
        const idx = userOrders.findIndex(o => o.id === order.id);
        if (idx !== -1) {
          userOrders[idx] = currentOrder;
          localStorage.setItem(`orders_${user.id}`, JSON.stringify(userOrders));
        }
      }
    }
  };

  // Thêm hướng dẫn cho user nếu không có đơn hàng nào đủ điều kiện sinh mã giảm giá
  const hasDeliveredBigOrder = orderHistoryState.some(order => order.status === 'delivered' && order.total >= 20000000);

  function getReviews(productId) {
    return JSON.parse(localStorage.getItem(`reviews_${String(productId)}`) || '[]');
  }
  function saveReviews(productId, reviews) {
    localStorage.setItem(`reviews_${String(productId)}`, JSON.stringify(reviews));
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <Package size={28} className="mr-2" />
        Lịch Sử Đơn Hàng
      </h2>
      
      {showDiscountMsg && (
        <div className="mb-4 p-4 bg-green-50 border border-green-400 text-green-700 rounded">
          Chúc mừng! Bạn vừa nhận được mã giảm giá <span className="font-mono font-bold">{showDiscountMsg.code}</span> (trị giá 1.000.000đ, hạn đến {showDiscountMsg.expiresAt.toLocaleDateString && new Date(showDiscountMsg.expiresAt).toLocaleDateString('vi-VN')}) cho đơn hàng trên 20 triệu!
          <Link to="/discount-codes" className="ml-2 underline text-blue-600">Xem mã giảm giá</Link>
        </div>
      )}
      
      {orderHistoryState.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      ) : (
        <>
          {!hasDeliveredBigOrder && (
            <div className="text-center py-8 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded mb-6">
              <p className="text-lg font-semibold mb-2">Bạn cần có đơn hàng trên 20 triệu và đã giao thành công để nhận mã giảm giá!</p>
              <p className="text-sm">Sau khi đặt hàng, hãy chuyển trạng thái đơn hàng sang "Đã giao hàng" để nhận mã giảm giá.</p>
            </div>
          )}
          <div className="space-y-6">
            {orderHistoryState.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Ngày đặt: {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </p>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <p className="text-sm text-gray-600">
                        Dự kiến giao: {getEstimatedDelivery(order.orderDate)}
                      </p>
                    )}
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

                {/* Status Description */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{getStatusDescription(order.status)}</p>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 2).map((item) => {
                    const reviewed = getReviews(String(item.productId)).some(r => r.userId === user.id);
                    return (
                      <div key={item.id} className="flex items-center border-t border-gray-200 pt-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} x {item.price.toLocaleString()}đ • {item.color} • {item.size}
                          </p>
                        </div>
                        {order.status === 'delivered' && !reviewed && (
                          <Link
                            to={`/product/${item.productId}`}
                            className="ml-2 px-3 py-1 text-blue-600 underline hover:text-blue-800 text-sm"
                          >
                            Đánh giá sản phẩm
                          </Link>
                        )}
                        {order.status === 'delivered' && reviewed && (
                          <span className="ml-2 text-green-600 text-xs font-semibold">Đã đánh giá</span>
                        )}
                      </div>
                    );
                  })}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Tổng cộng:</span>
                  <span className="font-bold text-gray-900">
                    {(order.total - (order.discountValue || 0)).toLocaleString()}đ
                    {order.discountValue > 0 && order.discountCode ? (
                      <span className="text-xs text-green-700 ml-2">(Đã áp dụng mã {order.discountCode})</span>
                    ) : null}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50${props.isModal ? '' : ''}`}>
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
            
            <div className="space-y-6">
              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Trạng thái đơn hàng</h4>
                  <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    <span className="ml-1">{getStatusText(selectedOrder.status)}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{getStatusDescription(selectedOrder.status)}</p>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <MapPin size={16} className="mr-2" />
                  Địa chỉ giao hàng
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress.city}</p>
                  <p className="text-sm text-gray-700">SĐT: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Sản phẩm đã đặt</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center border border-gray-200 rounded-lg p-3">
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

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá gốc:</span>
                    <span>{selectedOrder.total.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{selectedOrder.total >= 500000 ? 'Miễn phí' : '30,000đ'}</span>
                  </div>
                  {selectedOrder.discountCode && selectedOrder.discountValue > 0 && (
                    <div className="flex justify-between text-sm text-green-700 font-semibold">
                      <span>Mã giảm giá ({selectedOrder.discountCode}):</span>
                      <span>-{selectedOrder.discountValue.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{(selectedOrder.total - (selectedOrder.discountValue || 0)).toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lịch sử trạng thái</h4>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                        <span className="w-24 font-medium">{getStatusText(history.status)}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(history.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Phương thức thanh toán</h4>
                <p className="text-sm text-gray-600">
                  {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Thẻ tín dụng/Thẻ ghi nợ'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;