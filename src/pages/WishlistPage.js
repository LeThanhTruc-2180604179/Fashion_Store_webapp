import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/product/ProductCard';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const WishlistPage = () => {
  const { wishlistItems } = useCart();
  const user = useCart().user;

  if (user && user.isAdmin) {
    return <div className="text-center text-red-600 font-bold text-xl py-20">Admin không thể sử dụng wishlist!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <Heart size={28} className="mr-2 text-red-500 fill-red-500" />
        Danh Sách Yêu Thích
      </h2>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">Danh sách yêu thích của bạn đang trống.</p>
          <Link
            to="/shop"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Tiếp Tục Mua Sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;