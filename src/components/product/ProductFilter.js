import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Import category logos mapping
const categoryLogos = {
  'T-Shirts': 'https://cdn-icons-png.flaticon.com/512/106/106020.png',
  'Jeans': 'https://cdn-icons-png.flaticon.com/512/2589/2589973.png',
  'Jackets': 'https://cdn-icons-png.flaticon.com/512/2405/2405529.png',
  'Shorts': 'https://static.vecteezy.com/system/resources/previews/014/705/953/non_2x/shorts-icon-free-vector.jpg',
  'Hoodies': 'https://static.vecteezy.com/system/resources/previews/004/680/306/non_2x/hoodie-glyph-icon-free-vector.jpg',
  'Sweatshirts': 'https://static.vecteezy.com/system/resources/previews/044/795/881/non_2x/crewneck-sweatshirt-streetwear-cloth-fashion-glyph-icon-illustration-vector.jpg',
  'Pants': 'https://cdn-icons-png.flaticon.com/512/3531/3531748.png',
  'Dresses': 'https://i.pinimg.com/564x/87/81/4c/87814c16c27e4d6f953078ee5328915b.jpg',
  'Skirts': 'https://cdn-icons-png.flaticon.com/512/976/976228.png',
  'Accessories': 'https://cdn-icons-png.freepik.com/512/750/750738.png'
};

const ProductFilter = () => {
  const { filters, updateFilters, clearFilters, categories: mainCategories, genders, brands, colors, sizes } = useProducts();
  // State cho slider khoảng giá
  const [price, setPrice] = useState(filters.price || 100000000);
  // State cho ẩn/hiện mục
  const [openCategory, setOpenCategory] = useState(true);
  const [openGender, setOpenGender] = useState(true);

  // Lấy mainCategory hiện tại
  const mainCategory = filters.mainCategory || 'ALL';
  const currentMain = mainCategories.find((cat) => cat.id === mainCategory) || mainCategories[0];

  // Handler chọn mục
  const handleSelect = (key, value) => {
    updateFilters({ [key]: value });
  };
  // Handler checkbox
  const handleCheckbox = (key, value) => {
    const arr = filters[key] || [];
    if (arr.includes(value)) {
      updateFilters({ [key]: arr.filter((v) => v !== value) });
    } else {
      updateFilters({ [key]: [...arr, value] });
    }
  };
  // Handler price slider
  const handlePriceSlider = (val) => {
    setPrice(val);
    updateFilters({ price: val });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 w-full max-w-xs mx-auto md:mx-0 md:w-auto md:p-6 px-2">
      {/* Main Category */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Danh Mục Chính</h4>
        <div className="flex flex-wrap gap-2">
          {mainCategories.map((cat) => (
            <div
              key={cat.id}
              className={`cursor-pointer px-3 py-1 rounded-full border transition-colors ${mainCategory === cat.id ? 'text-blue-600 font-bold bg-blue-50 border-blue-500' : 'text-gray-800 hover:bg-gray-100 border-gray-300'}`}
              onClick={() => handleSelect('mainCategory', cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>
      {/* Subcategory - Loại Sản Phẩm */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer select-none group py-1" onClick={() => setOpenCategory(v => !v)}>
          <h4 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition">Loại Sản Phẩm</h4>
          <span className="text-gray-500 ml-2 transition-transform duration-200" style={{transform: openCategory ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
            {openCategory ? <ChevronDown size={20}/> : <ChevronRight size={20}/>} 
          </span>
        </div>
        {openCategory && (
          <div className="space-y-2">
            <div
              className={`cursor-pointer px-2 py-1 rounded transition-colors ${!filters.category ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => handleSelect('category', '')}
            >
              Tất cả
            </div>
            {currentMain.subcategories.map((sub) => (
              <div
                key={sub.id}
                className={`cursor-pointer px-2 py-1 rounded transition-colors flex items-center space-x-2 ${filters.category === sub.id ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-800 hover:bg-gray-100'}`}
                onClick={() => handleSelect('category', sub.id)}
              >
                <img 
                  src={categoryLogos[sub.id]} 
                  alt={sub.name} 
                  className="w-6 h-6 object-contain"
                />
                <span>{sub.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Giới Tính */}
      <div className="mb-4">
        <div className="flex items-center justify-between cursor-pointer select-none group py-1" onClick={() => setOpenGender(v => !v)}>
          <h4 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition">Giới Tính</h4>
          <span className="text-gray-500 ml-2 transition-transform duration-200" style={{transform: openGender ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
            {openGender ? <ChevronDown size={20}/> : <ChevronRight size={20}/>} 
          </span>
        </div>
        {openGender && (
          <div className="space-y-2">
            <div
              className={`cursor-pointer px-2 py-1 rounded transition-colors ${filters.gender === '' ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-800 hover:bg-gray-100'}`}
              onClick={() => handleSelect('gender', '')}
            >
              Tất cả
            </div>
            {genders.map((g) => (
              <div
                key={g.id}
                className={`cursor-pointer px-2 py-1 rounded transition-colors ${filters.gender === g.id ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-800 hover:bg-gray-100'}`}
                onClick={() => handleSelect('gender', g.id)}
              >
                {g.name}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Thương Hiệu */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Thương Hiệu</h4>
        <select
          value={filters.brand}
          onChange={(e) => handleSelect('brand', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2"
        >
          <option value="">Tất cả</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
      {/* Khoảng Giá */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Khoảng Giá</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-700 font-semibold">0đ</span>
          <input
            type="range"
            min="0"
            max="100000000"
            step="10000"
            value={price}
            onChange={(e) => handlePriceSlider(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <span className="text-xs text-blue-700 font-semibold">{price.toLocaleString()}đ</span>
        
        </div>
        <span className="text-xs text-gray-400 mt-1 block">Kéo để chọn giá tối đa</span>
      </div>
      {/* Màu Sắc */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Màu Sắc</h4>
        <div className="grid grid-cols-3 gap-2">
          {colors.map((color) => (
            <label key={color} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={() => handleCheckbox('colors', color)}
                className="mr-2 accent-blue-600"
              />
              {color}
            </label>
          ))}
        </div>
      </div>
      {/* Kích Cỡ */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Kích Cỡ</h4>
        <div className="grid grid-cols-3 gap-2">
          {sizes.clothing.map((size) => (
            <label key={size} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={() => handleCheckbox('sizes', size)}
                className="mr-2 accent-blue-600"
              />
              {size}
            </label>
          ))}
        </div>
      </div>
      {/* Nút xóa bộ lọc */}
      <button
        onClick={clearFilters}
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors mt-2"
      >
        Xóa Bộ Lọc
      </button>
    </div>
  );
};

export default ProductFilter;