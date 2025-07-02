import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12 text-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* About Section */}
          <div className="mb-6 sm:mb-0">
            <Link to="/" className="flex items-center space-x-2 mb-3 sm:mb-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <span className="font-bold text-lg">CS</span>
              </div>
              <span className="font-bold text-base sm:text-xl text-white hidden xs:inline">ClothingStore</span>
            </Link>
            <p className="text-xs sm:text-sm">
              ClothingStore mang đến những sản phẩm thời trang chất lượng với phong cách hiện đại và giá cả hợp lý.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <Link to="/shop" className="hover:text-blue-400 transition-colors">
                  Cửa Hàng
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition-colors">
                  Giỏ Hàng
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-400 transition-colors">
                  Yêu Thích
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-blue-400 transition-colors">
                  Lịch Sử Đơn Hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-6 sm:mb-0">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">Liên Hệ</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>123 Đường Thời Trang, TP.HCM</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={14} />
                <span>(+84) 123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={14} />
                <span>support@clothingstore.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-4">Theo Dõi Chúng Tôi</h3>
            <div className="flex space-x-3 sm:space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} ClothingStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;