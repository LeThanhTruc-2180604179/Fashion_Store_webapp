import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  const { getCartTotal, getCartItemCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm Tắt Đơn Hàng</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Số lượng sản phẩm:</span>
          <span className="font-medium">{getCartItemCount()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính:</span>
          <span className="font-medium">{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển:</span>
          <span className="font-medium">{shipping.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
          <span className="text-lg font-bold text-blue-600">{total.toLocaleString()}đ</span>
        </div>
      </div>
      <Link
        to="/checkout"
        className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition-colors mt-4"
      >
        Tiến Hành Thanh Toán
      </Link>
    </div>
  );
};

export default CartSummary;