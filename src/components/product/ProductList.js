import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';

const ProductList = ({ products, loading, showNewBadge = false, showSaleBadge = false }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <img 
          src="/assetss/no-buying.gif" 
          alt="No products found" 
          className="w-64 h-64 object-contain opacity-80 mb-4" 
        />
        <p className="text-lg text-gray-600">Không tìm thấy sản phẩm nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-1">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showNewBadge={showNewBadge}
          showSaleBadge={showSaleBadge}
        />
      ))}
    </div>
  );
};

export default ProductList;