import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CreditCard, Truck } from 'lucide-react';
import { isDiscountCodeValid, getDiscountValue, markDiscountCodeUsed } from '../utils/helpers';

const CheckoutPage = () => {
  const { cartItems, placeOrder, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
    paymentMethod: 'cod',
  });
  const [error, setError] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountError, setDiscountError] = useState('');
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        address: user.address || '',
        phone: user.phone || '',
        city: user.city || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyDiscount = () => {
    setDiscountError('');
    if (!discountCode) {
      setDiscountError('Vui lòng nhập mã giảm giá');
      setDiscountValue(0);
      return;
    }
    if (!isDiscountCodeValid(user.id, discountCode)) {
      setDiscountError('Mã giảm giá không hợp lệ hoặc đã hết hạn/đã dùng');
      setDiscountValue(0);
      return;
    }
    const value = getDiscountValue(user.id, discountCode);
    setDiscountValue(value);
    setDiscountError('Áp dụng mã thành công!');
  };

  const handleCheckout = () => {
    setError('');
    if (!formData.fullName || !formData.address || !formData.city || !formData.phone) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    if (cartItems.length === 0) {
      setError('Giỏ hàng của bạn đang trống');
      return;
    }
    try {
      const order = placeOrder({
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
        },
        discountCode: discountCode && discountValue > 0 ? discountCode : undefined,
        discountValue: discountValue || 0,
      });
      if (discountCode && discountValue > 0) {
        markDiscountCodeUsed(user.id, discountCode);
      }
      navigate('/orders');
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 500000 ? 0 : 30000;
  const total = subtotal + shipping - discountValue;

  if (user && user.isAdmin) {
    return <div className="text-center text-red-600 font-bold text-xl py-20">Admin không thể đặt hàng hoặc thanh toán!</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
        <a
          href="/shop"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Tiếp Tục Mua Sắm
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Thanh Toán</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Truck size={20} className="mr-2" />
                Thông Tin Giao Hàng
              </h3>
              {error && (
                <div className="flex items-center bg-red-100 text-red-600 p-3 rounded-lg mb-4">
                  <AlertCircle size={20} className="mr-2" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Họ Tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Địa Chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Thành Phố *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Số Điện Thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CreditCard size={20} className="mr-2" />
                Phương Thức Thanh Toán
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Thẻ tín dụng/Thẻ ghi nợ
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm Tắt Đơn Hàng</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">{shipping.toLocaleString()}đ</span>
                </div>
                {/* Discount code input */}
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Áp dụng
                  </button>
                </div>
                {discountError && (
                  <div className={`text-sm mt-1 ${discountError.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{discountError}</div>
                )}
                {discountValue > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Giảm giá:</span>
                    <span>-{discountValue.toLocaleString()}đ</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Tổng cộng:</span>
                  <span className="text-lg font-bold text-blue-600">{total.toLocaleString()}đ</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
              >
                Đặt Hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;