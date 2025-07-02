import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductFilter from '../components/product/ProductFilter';
import ProductList from '../components/product/ProductList';

const ShopPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const { updateFilters, getFilteredProducts, loading, filters } = useProducts();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const isSale = searchParams.get('sale') === 'true';
  const sort = searchParams.get('sort');
  const mainCategory = searchParams.get('main') || '';
  const subCategory = searchParams.get('category') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;

  useEffect(() => {
    // Ưu tiên đồng bộ mainCategory và category từ URL
    const newFilters = {};
    if (mainCategory) newFilters.mainCategory = mainCategory;
    if (subCategory) newFilters.category = subCategory;
    if (!mainCategory && !subCategory) {
      // Nếu không có gì trên URL thì reset filter
      newFilters.mainCategory = 'ALL';
      newFilters.category = '';
    }
    updateFilters(newFilters);
    // eslint-disable-next-line
  }, [mainCategory, subCategory]);

  // Lọc theo search input (ưu tiên input trên trang, sau đó mới đến query trên URL)
  let products = getFilteredProducts();
  if (searchInput) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
        p.description.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  // Phân trang
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Khi search hoặc filter thay đổi thì về trang 1
  useEffect(() => {
    setPage(1);
  }, [searchInput, mainCategory, subCategory, filters]);

  if (isSale) {
    products = products.filter((p) => p.originalPrice > p.price);
  }

  if (sort === 'newest') {
    products = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
        {category ? `Sản Phẩm: ${category}` : 'Tất Cả Sản Phẩm'}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 items-start">
        <div className="lg:col-span-1 w-full md:w-auto hidden lg:block">
          <ProductFilter />
        </div>
        <div className="lg:col-span-3 w-full md:w-auto">
          <ProductList
            products={paginatedProducts}
            loading={loading}
            showSaleBadge={isSale}
            showNewBadge={sort === 'newest'}
          />
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-6 md:mt-8 space-x-1 md:space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-2 md:px-3 py-1 rounded-lg font-semibold border text-xs md:text-base ${page === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;