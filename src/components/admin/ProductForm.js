import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import { AlertCircle } from 'lucide-react';
import Select from 'react-select';

const ProductForm = ({ product, onClose }) => {
  const { addProduct, updateProduct, categories, genders, brands, colors, sizes } = useProducts();
  const mainCategories = [
    { id: 'MEN', name: 'Men' },
    { id: 'WOMEN', name: 'Women' },
    { id: 'KIDS', name: 'Kids' },
    { id: 'SALE', name: 'Sale' },
    { id: 'ALL', name: 'All' },
  ];
  const COLOR_OPTIONS = [
    { label: 'Đỏ', value: 'Đỏ', color: '#FF0000' },
    { label: 'Xanh dương', value: 'Xanh dương', color: '#0074D9' },
    { label: 'Xanh lá', value: 'Xanh lá', color: '#2ECC40' },
    { label: 'Vàng', value: 'Vàng', color: '#FFDC00' },
    { label: 'Cam', value: 'Cam', color: '#FF851B' },
    { label: 'Tím', value: 'Tím', color: '#B10DC9' },
    { label: 'Hồng', value: 'Hồng', color: '#FF69B4' },
    { label: 'Đen', value: 'Đen', color: '#111111' },
    { label: 'Trắng', value: 'Trắng', color: '#FFFFFF', border: '#ccc' },
    { label: 'Xám', value: 'Xám', color: '#AAAAAA' },
    { label: 'Nâu', value: 'Nâu', color: '#8B4513' },
    { label: 'Bạc', value: 'Bạc', color: '#C0C0C0' },
    { label: 'Vàng đồng', value: 'Vàng đồng', color: '#B8860B' },
    { label: 'Xanh navy', value: 'Xanh navy', color: '#001F3F' },
    { label: 'Be', value: 'Be', color: '#F5F5DC' },
    { label: 'Rêu', value: 'Rêu', color: '#556B2F' },
    { label: 'Xanh ngọc', value: 'Xanh ngọc', color: '#00CED1' },
    { label: 'Đỏ đô', value: 'Đỏ đô', color: '#800000' },
    { label: 'Xanh mint', value: 'Xanh mint', color: '#AAF0D1' },
    { label: 'Vàng chanh', value: 'Vàng chanh', color: '#FFF700' },
    { label: 'Xanh cobalt', value: 'Xanh cobalt', color: '#0047AB' },
    { label: 'Xanh pastel', value: 'Xanh pastel', color: '#B2FFFF' },
    { label: 'Hồng pastel', value: 'Hồng pastel', color: '#FFD1DC' },
    { label: 'Tím pastel', value: 'Tím pastel', color: '#CBC3E3' },
    { label: 'Cam pastel', value: 'Cam pastel', color: '#FFD8B1' },
    { label: 'Xám lông chuột', value: 'Xám lông chuột', color: '#A9A9A9' },
    { label: 'Xám tro', value: 'Xám tro', color: '#808080' },
    { label: 'Xám bạc', value: 'Xám bạc', color: '#D3D3D3' },
    { label: 'Xanh than', value: 'Xanh than', color: '#003366' },
    { label: 'Xanh biển', value: 'Xanh biển', color: '#4682B4' },
    { label: 'Vàng nghệ', value: 'Vàng nghệ', color: '#FFD700' },
    { label: 'Đen nhám', value: 'Đen nhám', color: '#222222' },
    { label: 'Trắng ngà', value: 'Trắng ngà', color: '#FFFFF0' },
  ];
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    colors: [],
    sizes: [],
    images: ['', '', '', ''],
    mainCategory: '',
    category: '',
    gender: '',
    description: '',
    inStock: true,
    rating: 0,
    reviews: 0,
    sizeGuideImageUrl: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        colors: product.colors,
        sizes: product.sizes,
        images: product.images.length === 4 ? product.images : [...product.images, ...Array(4 - product.images.length).fill('')],
        mainCategory: product.mainCategory || '',
        category: product.category,
        gender: product.gender,
        description: product.description,
        inStock: product.inStock,
        rating: product.rating,
        reviews: product.reviews,
        sizeGuideImageUrl: product.sizeGuideImageUrl || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const notifyWishlistUsers = (product) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.forEach(u => {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${u.id}`) || '[]');
      if (wishlist.some(item => item.id === product.id)) {
        const key = `notifications_${u.id}`;
        const notifications = JSON.parse(localStorage.getItem(key) || '[]');
        notifications.unshift({
          id: Date.now(),
          message: `Sản phẩm "${product.name}" trong wishlist của bạn vừa được giảm giá!`,
          link: `/product/${product.id}`,
          read: false,
          time: new Date().toISOString(),
        });
        localStorage.setItem(key, JSON.stringify(notifications));
      }
    });
  };

  const updateWishlistProductPrice = (product) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.forEach(u => {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${u.id}`) || '[]');
      let changed = false;
      const newWishlist = wishlist.map(item => {
        if (item.id === product.id && item.price !== product.price) {
          changed = true;
          return { ...item, price: product.price };
        }
        return item;
      });
      if (changed) {
        localStorage.setItem(`wishlist_${u.id}`, JSON.stringify(newWishlist));
      }
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.price || !formData.mainCategory || !formData.category || !formData.gender) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    if (formData.images.some((img) => !img)) {
      setError('Vui lòng cung cấp đủ 4 hình ảnh');
      return;
    }
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || Number(formData.price),
        rating: Number(formData.rating),
        reviews: Number(formData.reviews),
      };
      let oldPrice = product ? product.price : null;
      if (product) {
        await updateProduct(product.id, productData);
        if (oldPrice && productData.price < oldPrice) {
          notifyWishlistUsers(productData);
        }
        updateWishlistProductPrice(productData);
        window.dispatchEvent(new Event('wishlist-updated'));
      } else {
        await addProduct(productData);
      }
      onClose();
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const subCategories = formData.mainCategory
    ? (categories.find((cat) => cat.id === formData.mainCategory)?.subcategories || [])
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</h3>
      {error && (
        <div className="flex items-center bg-red-100 text-red-600 p-3 rounded-lg mb-4">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cột trái */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên Sản Phẩm *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thương Hiệu *</label>
            <select name="brand" value={formData.brand} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2">
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (<option key={brand} value={brand}>{brand}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá Bán *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Giá Gốc</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh Mục Chính *</label>
            <select name="mainCategory" value={formData.mainCategory} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required>
              <option value="">Chọn danh mục chính</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Loại Sản Phẩm *</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required>
              <option value="">Chọn loại sản phẩm</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giới Tính *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2">
              <option value="">Chọn giới tính</option>
              {genders.map((gender) => (<option key={gender.id} value={gender.id}>{gender.name}</option>))}
            </select>
          </div>
        </div>
        {/* Cột phải */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Màu Sắc</label>
            <Select
              isMulti
              name="colors"
              options={COLOR_OPTIONS}
              className="basic-multi-select"
              classNamePrefix="select"
              value={COLOR_OPTIONS.filter(opt => formData.colors.includes(opt.value))}
              onChange={selected => setFormData(prev => ({ ...prev, colors: selected.map(opt => opt.value) }))}
              placeholder="Chọn màu sắc..."
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              isOptionDisabled={option => formData.colors.length >= 7 && !formData.colors.includes(option.value)}
              styles={{
                control: (styles) => ({
                  ...styles,
                  maxHeight: 72,
                  overflowY: 'auto',
                  overflowX: 'auto',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }),
                valueContainer: (styles) => ({
                  ...styles,
                  maxHeight: 72,
                  overflowY: 'auto',
                  overflowX: 'auto',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }),
                option: (styles, { data, isFocused, isSelected }) => ({
                  ...styles,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: isSelected ? '#e0e7ff' : isFocused ? '#f3f4f6' : undefined,
                  color: '#222',
                }),
                multiValue: (styles, { data }) => ({
                  ...styles,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 16,
                  paddingLeft: 4,
                  paddingRight: 4,
                  display: 'flex',
                  alignItems: 'center',
                }),
              }}
              formatOptionLabel={option => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: option.color,
                    border: option.value === 'Trắng' || option.value === 'Trắng ngà' ? '1px solid #ccc' : 'none',
                    marginRight: 8,
                  }} />
                  {option.label}
                </div>
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kích Cỡ</label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.clothing.map((size) => (
                <label key={size} className="flex items-center">
                  <input type="checkbox" name="sizes" value={size} checked={formData.sizes.includes(size)} onChange={handleChange} className="mr-2" />
                  {size}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hình Ảnh (4 URL) *</label>
            <div className="grid grid-cols-2 gap-2">
              {formData.images.map((image, index) => (
                <input key={index} type="url" value={image} onChange={(e) => handleImageChange(index, e.target.value)} placeholder={`Hình ảnh ${index + 1}`} className="w-full border border-gray-300 rounded-lg p-2" required />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" rows={2} />
          </div>
          <div className="flex items-center mt-2">
            <input type="checkbox" name="inStock" checked={formData.inStock} onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.checked }))} className="mr-2" />
            <label className="text-sm font-medium text-gray-700">Còn Hàng</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ảnh Size Guide (URL, tuỳ chọn)</label>
            <input type="url" name="sizeGuideImageUrl" value={formData.sizeGuideImageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" placeholder="https://..." />
          </div>
        </div>
        {/* Nút action */}
        <div className="md:col-span-2 flex space-x-4 mt-2">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">{product ? 'Cập Nhật' : 'Thêm Sản Phẩm'}</button>
          <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors">Hủy</button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;