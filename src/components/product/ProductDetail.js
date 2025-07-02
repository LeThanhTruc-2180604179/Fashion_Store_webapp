import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
// eslint-disable-next-line no-unused-vars
import { Heart, ShoppingCart, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductReviewSection from './ProductReviewSection';

const ProductDetail = ({ product }) => {
  const images = Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? product.images.split(',').map(i => i.trim()) : []);
  const colors = Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? product.colors.split(',').map(i => i.trim()) : []);
  const sizes = Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',').map(i => i.trim()) : []);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [quantity, setQuantity] = useState(1);
  const [descOpen, setDescOpen] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Lấy 2 ảnh lớn hiện tại
  const getVisibleImages = () => {
    if (window.innerWidth < 768) return [images[0]]; // mobile chỉ 1 ảnh
    if (images.length <= 2) return images;
    const idx1 = imgIdx % images.length;
    const idx2 = (imgIdx + 1) % images.length;
    return [images[idx1], images[idx2]];
  };
  const visibleImages = getVisibleImages();

  const handlePrev = () => {
    setImgIdx((prev) => (prev - 2 + images.length) % images.length);
  };
  const handleNext = () => {
    setImgIdx((prev) => (prev + 2) % images.length);
  };
  // Khi click thumbnail, hiển thị cặp ảnh bắt đầu từ index đó
  const handleThumbClick = (i) => {
    if (i === images.length - 1 && images.length > 1) {
      setImgIdx(images.length - 1); // Hiện ảnh cuối và ảnh đầu
    } else {
      setImgIdx(i);
    }
  };

  const handleAddToCart = () => {
    try {
      setError('');
      if (!selectedSize) {
        setError('Vui lòng chọn size');
        return;
      }
      if (!user) {
        navigate('/login', { state: { from: location } });
        return;
      }
      addToCart(product, selectedColor, selectedSize, quantity);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleWishlistToggle = () => {
    try {
      setError('');
      if (!user) {
        navigate('/login', { state: { from: location } });
        return;
      }
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Danh sách mapping tên màu sang mã màu hex
  const COLOR_MAP = {
    'Đỏ': '#FF0000',
    'Xanh dương': '#0074D9',
    'Xanh lá': '#2ECC40',
    'Vàng': '#FFDC00',
    'Cam': '#FF851B',
    'Tím': '#B10DC9',
    'Hồng': '#FF69B4',
    'Đen': '#111111',
    'Trắng': '#FFFFFF',
    'Xám': '#AAAAAA',
    'Nâu': '#8B4513',
    'Bạc': '#C0C0C0',
    'Vàng đồng': '#B8860B',
    'Xanh navy': '#001F3F',
    'Be': '#F5F5DC',
    'Rêu': '#556B2F',
    'Xanh ngọc': '#00CED1',
    'Đỏ đô': '#800000',
    'Xanh mint': '#AAF0D1',
    'Vàng chanh': '#FFF700',
    'Xanh cobalt': '#0047AB',
    'Xanh pastel': '#B2FFFF',
    'Hồng pastel': '#FFD1DC',
    'Tím pastel': '#CBC3E3',
    'Cam pastel': '#FFD8B1',
    'Xám lông chuột': '#A9A9A9',
    'Xám tro': '#808080',
    'Xám bạc': '#D3D3D3',
    'Xanh than': '#003366',
    'Xanh biển': '#4682B4',
    'Vàng nghệ': '#FFD700',
    'Đen nhám': '#222222',
    'Trắng ngà': '#FFFFF0',
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8" style={{ fontFamily: 'monospace' }}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* 2 ảnh lớn */}
        <div className="col-span-2 flex flex-col items-center">
          <div
            className="relative flex items-center justify-center w-full"
            style={{ maxWidth: 900, minHeight: 500 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hovered && images.length > 2 && window.innerWidth >= 768 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 hover:bg-gray-200 rounded-full z-10"
                style={{ border: 'none' }}
              >
                <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 22 12 16 18 10" /></svg>
              </button>
            )}
            <div className="flex flex-row justify-center items-center w-full space-x-8">
              {visibleImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={product.name}
                  className="object-contain mx-auto"
                  style={{ maxHeight: 500, maxWidth: 400, background: '#fff' }}
                />
              ))}
            </div>
            {hovered && images.length > 2 && window.innerWidth >= 768 && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 hover:bg-gray-200 rounded-full z-10"
                style={{ border: 'none' }}
              >
                <svg width="28" height="28" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="10 6 16 12 10 18" /></svg>
              </button>
            )}
          </div>
          {/* Thumbnails */}
          {images.length > 1 && window.innerWidth >= 768 && (
            <div className="flex justify-center items-center mt-4 space-x-2 overflow-x-auto max-w-full">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={product.name}
                  onClick={() => handleThumbClick(i)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${imgIdx === i || (imgIdx + 1) % images.length === i ? 'border-blue-600' : 'border-transparent'}`}
                  style={{ background: '#fff' }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Thông tin sản phẩm */}
        <div className="space-y-4 min-w-[320px]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'monospace' }}>{product.name}</h1>
            {!isAdmin && (
              <button onClick={handleWishlistToggle} className="ml-2">
                <Heart size={22} className={isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'} />
              </button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg" style={{ fontFamily: 'monospace' }}>
              {product.price.toLocaleString()}đ
            </span>
            {discount > 0 && (
              <>
                <span className="text-base text-gray-400 line-through" style={{ fontFamily: 'monospace' }}>
                  {product.originalPrice.toLocaleString()}đ
                </span>
                <span className="text-xs text-blue-600 font-mono">(-{discount}%)</span>
              </>
            )}
          </div>
          {/* Màu sắc */}
          {colors.length > 0 && (
            <div className="mb-2">
              <span>MÀU SẮC: {selectedColor}</span>
              <div className="flex space-x-2 mt-2">
                {colors.map((color, idx) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${selectedColor === color ? 'border-blue-600 scale-110' : 'border-gray-300'}`}
                    style={{ backgroundColor: COLOR_MAP[color] || color.toLowerCase(), border: color === 'Trắng' || color === 'Trắng ngà' ? '2px solid #ccc' : undefined }}
                    title={color}
                  >
                    {selectedColor === color && <span className="block w-3 h-3 bg-white rounded-full border border-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Size chọn */}
          {sizes.length > 0 && (
            <div className="mb-2">
              <button
                type="button"
                className="text-blue-600 underline mb-1 disabled:text-gray-400"
                style={{ cursor: product.sizeGuideImageUrl ? 'pointer' : 'not-allowed' }}
                onClick={() => product.sizeGuideImageUrl && setShowSizeGuide(true)}
                disabled={!product.sizeGuideImageUrl}
              >
                SIZE GUIDE
              </button>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full border border-black rounded-none px-3 py-2 mb-2 font-mono"
              >
                <option value="">SELECT SIZE</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          )}
          {/* Nút mua */}
          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full py-3 bg-black text-white font-bold text-base rounded-none mb-2 hover:bg-gray-900 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              style={{ fontFamily: 'monospace' }}
            >
              ADD TO BAG
            </button>
          )}
          {/* Mô tả */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer select-none border-t border-black pt-2 mt-2"
              onClick={() => setDescOpen(v => !v)}
            >
              <span className="font-bold text-base">MÔ TẢ </span>
              <span className="text-gray-600 transition-transform duration-200">
                {descOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
              </span>
            </div>
            {descOpen && (
              <div className="text-sm mt-2" style={{ whiteSpace: 'pre-line' }}>{product.description}</div>
            )}
          </div>
          {/* Section đánh giá sản phẩm */}
          <ProductReviewSection product={product} />
        </div>
      </div>
      {showSizeGuide && product.sizeGuideImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setShowSizeGuide(false)}
            >
              &times;
            </button>
            <img src={product.sizeGuideImageUrl} alt="Size Guide" className="w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;