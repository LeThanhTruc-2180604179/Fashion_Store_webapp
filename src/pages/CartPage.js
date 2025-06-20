import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const CartPage = () => {
  const { cartItems } = useCart();
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.isAdmin) {
    return <div className="text-center text-red-600 font-bold text-xl py-20">Admin không thể sử dụng giỏ hàng!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <ShoppingCart size={28} className="mr-2" />
        Giỏ Hàng
      </h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Giỏ hàng của bạn đang trống.</p>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;