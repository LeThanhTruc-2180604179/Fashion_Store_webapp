import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const { user } = useAuth();

  // Load cart data when user changes
  useEffect(() => {
    if (user) {
      try {
        const savedCart = localStorage.getItem(`cart_${user.id}`);
        const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        const savedOrders = localStorage.getItem(`orders_${user.id}`);
        
        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
        if (savedOrders) setOrderHistory(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading cart data:', error);
        // Reset to empty state if there's an error
        setCartItems([]);
        setWishlistItems([]);
        setOrderHistory([]);
      }
    } else {
      setCartItems([]);
      setWishlistItems([]);
      setOrderHistory([]);
    }
    // Lắng nghe sự kiện cập nhật wishlist
    const reloadWishlist = () => {
      if (user) {
        const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
      }
    };
    window.addEventListener('wishlist-updated', reloadWishlist);
    return () => {
      window.removeEventListener('wishlist-updated', reloadWishlist);
    };
  }, [user]);

  // Save cart to localStorage
  const saveCartToStorage = (items) => {
    if (user) {
      try {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  };

  // Save wishlist to localStorage
  const saveWishlistToStorage = (items) => {
    if (user) {
      try {
        localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving wishlist:', error);
      }
    }
  };

  // Save orders to localStorage
  const saveOrdersToStorage = (orders) => {
    if (user) {
      try {
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders:', error);
      }
    }
  };

  // Add item to cart
  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    if (!product || !selectedColor || !selectedSize || quantity <= 0) {
      throw new Error('Thông tin sản phẩm không hợp lệ');
    }

    const cartItem = {
      id: `${product.id}_${selectedColor}_${selectedSize}`,
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      addedAt: new Date().toISOString()
    };

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItem.id);
      let updatedItems;
      
      if (existingItem) {
        updatedItems = prevItems.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prevItems, cartItem];
      }
      
      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    if (!itemId) {
      throw new Error('ID sản phẩm không hợp lệ');
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== itemId);
      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (!itemId) {
      throw new Error('ID sản phẩm không hợp lệ');
    }

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      saveCartToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    if (user) {
      try {
        localStorage.removeItem(`cart_${user.id}`);
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  // Add to wishlist
  const addToWishlist = (product) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
    }

    if (!product) {
      throw new Error('Thông tin sản phẩm không hợp lệ');
    }

    setWishlistItems(prevItems => {
      const isAlreadyInWishlist = prevItems.find(item => item.id === product.id);
      if (isAlreadyInWishlist) {
        return prevItems;
      }
      
      const updatedItems = [...prevItems, { ...product, addedAt: new Date().toISOString() }];
      saveWishlistToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Remove from wishlist
  const removeFromWishlist = (productId) => {
    if (!productId) {
      throw new Error('ID sản phẩm không hợp lệ');
    }

    setWishlistItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      saveWishlistToStorage(updatedItems);
      return updatedItems;
    });
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Place order
  const placeOrder = (orderData) => {
    if (!user) {
      throw new Error('Vui lòng đăng nhập để đặt hàng');
    }
    if (!orderData || !orderData.shippingAddress || !orderData.paymentMethod) {
      throw new Error('Thông tin đơn hàng không hợp lệ');
    }
    const { fullName, address, city, phone } = orderData.shippingAddress;
    if (!fullName || !address || !city || !phone) {
      throw new Error('Vui lòng nhập đầy đủ thông tin giao hàng');
    }
    if (cartItems.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    const order = {
      id: Date.now().toString(),
      userId: user.id,
      items: cartItems,
      total: getCartTotal(),
      status: 'processing',
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      statusHistory: [
        {
          status: 'processing',
          timestamp: new Date().toISOString(),
          updatedBy: 'system'
        }
      ],
      ...(orderData.discountValue > 0 ? {
        discountCode: orderData.discountCode || '',
        discountValue: orderData.discountValue
      } : {})
    };

    setOrderHistory(prevOrders => {
      const updatedOrders = [order, ...prevOrders];
      saveOrdersToStorage(updatedOrders);
      return updatedOrders;
    });

    // Gửi notification cho admin
    try {
      const adminNotifications = JSON.parse(localStorage.getItem('notifications_admin') || '[]');
      adminNotifications.unshift({
        id: Date.now(),
        message: `Đơn hàng mới #${order.id} vừa được đặt bởi ${user.name || user.email}.`,
        link: '/admin?tab=orders',
        read: false,
        time: new Date().toISOString(),
      });
      localStorage.setItem('notifications_admin', JSON.stringify(adminNotifications));
    } catch (e) {}

    clearCart();
    return order;
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    wishlistItems,
    orderHistory,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    placeOrder,
    getCartTotal,
    getCartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};