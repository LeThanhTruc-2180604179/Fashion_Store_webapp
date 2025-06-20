import React from 'react';
import { CheckCircle, Package, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSuccessModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Đặt hàng thành công!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua sắm tại ClothingStore. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Mã đơn hàng:</span>
              <span className="text-sm font-semibold text-gray-800">#{order.id}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Tổng tiền:</span>
              <span className="text-sm font-semibold text-blue-600">{order.total.toLocaleString()}đ</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
              <span className="text-sm font-medium text-yellow-600">Đang xử lý</span>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start space-x-3">
              <Package size={16} className="text-gray-500 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Đơn hàng đã được tạo</p>
                <p className="text-xs text-gray-600">Chúng tôi đã nhận được đơn hàng của bạn</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock size={16} className="text-gray-500 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Dự kiến giao hàng</p>
                <p className="text-xs text-gray-600">
                  {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <MapPin size={16} className="text-gray-500 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Địa chỉ giao hàng</p>
                <p className="text-xs text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Link
              to="/orders"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Xem đơn hàng
            </Link>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal; 