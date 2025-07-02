import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';
// eslint-disable-next-line no-unused-vars
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Package, ChevronDown, Lock, Bell, Moon, Sun } from 'lucide-react';

// Category logos mapping
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [searchResults, setSearchResults] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFreeShip, setShowFreeShip] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [showCategoryBar, setShowCategoryBar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount, wishlistItems } = useCart();
  const { products, categories: mainCategories } = useProducts();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const hide = localStorage.getItem('hideFreeShip');
    if (hide === '1') setShowFreeShip(false);
  }, []);

  useEffect(() => {
    if (user) {
      const notiData = localStorage.getItem(`notifications_${user.id}`);
      setNotifications(notiData ? JSON.parse(notiData) : []);
    }
  }, [user]);

  // Lắng nghe thay đổi trong localStorage để cập nhật thông báo real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key && e.key.startsWith('notifications_') && user) {
        const notiData = localStorage.getItem(`notifications_${user.id}`);
        setNotifications(notiData ? JSON.parse(notiData) : []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user]);

  useEffect(() => {
    function updateUnread() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) return setUnreadCount(0);
      let notiData;
      if (user.id === 'admin') {
        notiData = localStorage.getItem('notifications_admin');
      } else {
        notiData = localStorage.getItem(`notifications_${user.id}`);
      }
      const notifications = notiData ? JSON.parse(notiData) : [];
      setUnreadCount(notifications.filter(n => !n.read).length);
    }
    updateUnread();
    window.addEventListener('notification-updated', updateUnread);
    return () => window.removeEventListener('notification-updated', updateUnread);
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleCloseFreeShip = () => {
    setShowFreeShip(false);
    localStorage.setItem('hideFreeShip', '1');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Lọc sản phẩm theo searchQuery
  const filteredSuggestions = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleSuggestionClick = (id) => {
    setShowSuggestions(false);
    setSearchQuery('');
    navigate(`/product/${id}`);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top bar */}
      {showFreeShip && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 relative transition-all duration-300 w-full">
          <div className="px-4 text-center text-sm flex items-center justify-center w-full">
            <span className="mr-2">🚚 Miễn phí vận chuyển cho đơn hàng từ 500.000đ</span>
            <button onClick={handleCloseFreeShip} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"><X size={18} /></button>
          </div>
        </div>
      )}

      {/* Main header */}
      <div className="w-full px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between w-full gap-2">
          {/* Hamburger menu - Mobile */}
          <button className="block md:hidden mr-2" onClick={() => setDrawerOpen(true)} aria-label="Mở menu">
            <Menu size={28} />
          </button>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-w-[40px]">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <span className="font-bold text-lg sm:text-xl">CS</span>
            </div>
            <span className="font-bold text-base sm:text-xl text-gray-800 hidden xs:inline">ClothingStore</span>
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-4 sm:mx-8 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => {
                  handleSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
              {/* Dropdown gợi ý sản phẩm */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {filteredSuggestions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-50"
                      onMouseDown={() => handleSuggestionClick(p.id)}
                    >
                      <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded mr-3" />
                      <div>
                        <div className="font-semibold text-sm">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.brand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
          {/* Search bar - Mobile */}
          <div className="flex-1 md:hidden max-w-[160px] xs:max-w-[220px] mx-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => {
                  handleSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Tìm kiếm"
              >
                <Search size={18} />
              </button>
              {/* Gợi ý sản phẩm mobile */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-xs">
                  {filteredSuggestions.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center px-2 py-1 cursor-pointer hover:bg-blue-50"
                      onMouseDown={() => handleSuggestionClick(p.id)}
                    >
                      <img src={p.images[0]} alt={p.name} className="w-7 h-7 object-cover rounded mr-2" />
                      <div>
                        <div className="font-semibold text-xs line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-gray-500 line-clamp-1">{p.brand}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Danh mục sản phẩm dạng bar xổ ngang dưới header */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8 mx-auto text-sm lg:text-base">
            {mainCategories.map((cat) => (
              <div key={cat.id} className="relative group">
                <Link
                  to={cat.id === 'ALL' ? '/shop' : `/shop?main=${cat.id}`}
                  className="px-4 py-2 font-semibold text-gray-800 hover:text-blue-600 border-b-2 border-transparent group-hover:border-blue-600 transition-all"
                >
                  {cat.name}
                </Link>
                {/* Mega menu xổ xuống */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max min-w-[500px] bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="grid grid-cols-2 gap-6 p-6">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        to={`/shop?main=${cat.id}&category=${sub.id}`}
                        className="flex items-center space-x-2 px-2 py-1 text-gray-700 hover:text-blue-600 hover:font-bold rounded"
                      >
                        <img 
                          src={categoryLogos[sub.id]} 
                          alt={sub.name} 
                          className="w-6 h-6 object-contain"
                        />
                        <span>{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* User actions - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <button
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setDarkMode((v) => !v)}
              title={darkMode ? 'Chuyển sang Light mode' : 'Chuyển sang Dark mode'}
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            {user ? (
              <>
                <Link
                  to="/notifications"
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Bell size={24} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {!isAdmin && (
                  <>
                    <Link
                      to="/wishlist"
                      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Heart size={24} />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/cart"
                      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <ShoppingCart size={24} />
                      {getCartItemCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                  </>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <User size={24} />
                    <span className="font-medium">{user.name}</span>
                  </button>
                  
                  {/* User dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin ? (
                      <>
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Package size={16} className="mr-2" />
                          Dashboard Admin
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut size={16} className="mr-2" />
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Package size={16} className="mr-2" />
                          Lịch sử đơn hàng
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <User size={16} className="mr-2" />
                          Your profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut size={16} className="mr-2" />
                          Đăng xuất
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ml-8"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>

          {/* User actions - Mobile */}
          <div className="flex md:hidden items-center space-x-1 xs:space-x-2">
            <Link to="/notifications" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
            {/* Wishlist chỉ hiện khi user đã đăng nhập và không phải admin */}
            {user && !isAdmin && (
              <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Heart size={20} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            )}
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={20} />
            </Link>
            {user ? (
              <Link to="/profile" className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User size={20} />
              </Link>
            ) : (
              <Link to="/login" className="flex items-center px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-semibold">
                <User size={16} className="mr-1" />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Drawer menu - Mobile */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50" onClick={() => { setDrawerOpen(false); setSelectedMainCategory(null); }}></div>
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-lg z-50 flex flex-col p-4 animate-slideIn">
            <button className="self-end mb-2" onClick={() => { setDrawerOpen(false); setSelectedMainCategory(null); }}><X size={24} /></button>
            {/* Nếu chưa chọn main category thì hiển thị danh sách main */}
            {!selectedMainCategory ? (
              <nav className="flex flex-col gap-2">
                {mainCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className="px-2 py-2 font-semibold text-left text-gray-800 hover:text-blue-600 border-b border-gray-100 text-sm"
                    onClick={() => {
                      if (cat.subcategories && cat.subcategories.length > 0 && cat.id !== 'ALL') {
                        setSelectedMainCategory(cat);
                      } else {
                        setDrawerOpen(false);
                        navigate(cat.id === 'ALL' ? '/shop' : `/shop?main=${cat.id}`);
                      }
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            ) : (
              <>
                <button className="mb-2 text-blue-600 text-xs text-left" onClick={() => setSelectedMainCategory(null)}>&lt; Quay lại</button>
                <div className="font-bold mb-2 text-base">{selectedMainCategory.name}</div>
                <nav className="flex flex-col gap-2">
                  {selectedMainCategory.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      className="flex items-center gap-2 px-2 py-2 text-gray-800 hover:text-blue-600 border-b border-gray-100 text-left text-xs"
                      onClick={() => {
                        setDrawerOpen(false);
                        setSelectedMainCategory(null);
                        navigate(`/shop?main=${selectedMainCategory.id}&category=${sub.id}`);
                      }}
                    >
                      {categoryLogos[sub.id] && (
                        <img src={categoryLogos[sub.id]} alt={sub.name} className="w-5 h-5 object-contain" />
                      )}
                      <span>{sub.name}</span>
                    </button>
                  ))}
                </nav>
              </>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;