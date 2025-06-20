import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const images = product.images || [];
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Xác định ảnh sẽ hiển thị
  const displayImgIdx = hovered && imgIdx === 0 && images.length > 1 ? 1 : imgIdx;

  return (
    <div
      className="bg-white cursor-pointer select-none rounded-xl"
      style={{ boxShadow: 'none', border: 'none' }}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full flex items-center justify-center" style={{ aspectRatio: '3/4', background: '#fff' }}>
        {images.length > 0 && (
          <img
            src={images[displayImgIdx]}
            key={displayImgIdx}
            alt={product.name}
            className={`w-full h-auto object-contain transition-transform duration-300 ${hovered ? 'scale-105' : 'scale-100'}`}
            style={{ maxHeight: 400, background: '#fff' }}
          />
        )}
        {/* Nút chuyển ảnh trái/phải */}
        {images.length > 1 && hovered && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-transparent hover:bg-gray-100 rounded-full transition-colors"
              style={{ border: 'none', boxShadow: 'none' }}
            >
              <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent hover:bg-gray-100 rounded-full transition-colors"
              style={{ border: 'none', boxShadow: 'none' }}
            >
              <svg width="24" height="24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </>
        )}
      </div>
      <div className="mt-3 px-1 text-left">
        <div className="font-bold text-base mb-1 truncate" style={{ fontFamily: 'monospace' }}>{product.name}</div>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-base" style={{ fontFamily: 'monospace' }}>
            {product.price.toLocaleString()}đ
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-gray-400 line-through" style={{ fontFamily: 'monospace' }}>
                {product.originalPrice.toLocaleString()}đ
              </span>
              <span className="text-xs text-blue-600 font-mono">(-{discount}%)</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;