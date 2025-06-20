import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductForm from './ProductForm';
import { Trash2, Edit, Plus } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const ProductManager = () => {
  const { products, deleteProduct, loading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;

  // Lọc sản phẩm theo searchInput
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchInput.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchInput.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  // Khi search thay đổi thì về trang 1
  React.useEffect(() => {
    setPage(1);
  }, [searchInput]);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await deleteProduct(id);
    }
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h2>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Thêm Sản Phẩm
        </button>
      </div>
      {/* Thanh tìm kiếm */}
      <form className="mb-4 max-w-md" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm theo tên, thương hiệu..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ProductForm
            product={selectedProduct}
            onClose={() => setShowForm(false)}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Hình Ảnh</th>
              <th className="p-4 text-left">Tên</th>
              <th className="p-4 text-left">Thương Hiệu</th>
              <th className="p-4 text-left">Giá</th>
              <th className="p-4 text-left">Danh Mục</th>
              <th className="p-4 text-left">Danh Mục Chính</th>
              <th className="p-4 text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.brand}</td>
                <td className="p-4">{product.price.toLocaleString()}đ</td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.mainCategory}</td>
                <td className="p-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg font-semibold border ${page === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;