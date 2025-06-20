import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductDetail from '../components/product/ProductDetail';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { getProductById, products } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // Slider state (phải đặt ở đầu component)
  const [slideIdx, setSlideIdx] = useState(0);
  const SLIDES_TO_SHOW = 3;
  const progressBarRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, getProductById]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600">Sản phẩm không tồn tại.</p>
      </div>
    );
  }

  // Gợi ý sản phẩm cùng category hoặc brand
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 12);

  const maxIdx = Math.max(0, relatedProducts.length - SLIDES_TO_SHOW);
  const handlePrev = () => setSlideIdx(i => Math.max(0, i - 1));
  const handleNext = () => setSlideIdx(i => Math.min(maxIdx, i + 1));

  // Handler cho kéo/thả progress bar
  const handleBarDown = (e) => {
    isDragging.current = true;
    handleBarMove(e);
    document.addEventListener('mousemove', handleBarMove);
    document.addEventListener('mouseup', handleBarUp);
  };
  const handleBarUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleBarMove);
    document.removeEventListener('mouseup', handleBarUp);
  };
  const handleBarMove = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let percent = (clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const idx = Math.round(percent * maxIdx);
    setSlideIdx(idx);
  };
  // Touch events
  const handleBarTouchStart = (e) => {
    isDragging.current = true;
    handleBarMove(e);
    document.addEventListener('touchmove', handleBarMove);
    document.addEventListener('touchend', handleBarTouchEnd);
  };
  const handleBarTouchEnd = () => {
    isDragging.current = false;
    document.removeEventListener('touchmove', handleBarMove);
    document.removeEventListener('touchend', handleBarTouchEnd);
  };

  return (
    <>
      <ProductDetail product={product} />
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Gợi ý cho bạn</h2>
            <div className="flex gap-2">
              <button onClick={handlePrev} disabled={slideIdx === 0} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"><ChevronLeft size={24} /></button>
              <button onClick={handleNext} disabled={slideIdx === maxIdx} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"><ChevronRight size={24} /></button>
            </div>
          </div>
          <div className="overflow-hidden w-full">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${slideIdx * (100 / SLIDES_TO_SHOW)}%)` }}>
              {relatedProducts.map((item, idx) => (
                <div
                  key={item.id}
                  className="min-w-0 w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-2"
                  style={{ maxWidth: `${100 / SLIDES_TO_SHOW}%` }}
                >
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </div>
          {/* Thanh progress bar dưới slider */}
          <div className="flex justify-center items-center mt-4">
            <div
              ref={progressBarRef}
              className="w-2/3 h-2 bg-gray-200 rounded-full relative overflow-hidden cursor-pointer"
              onMouseDown={handleBarDown}
              onTouchStart={handleBarTouchStart}
            >
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${100 / (maxIdx + 1)}%`, left: `${(slideIdx * 100) / (maxIdx + 1)}%`, position: 'absolute' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;