import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartItem = ({ item, user }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-sm text-gray-500">{item.color} / {item.size}</div>
        <div className="text-sm text-gray-700">{item.price.toLocaleString()}đ</div>
      </div>
      {!(user && user.isAdmin) && (
        <div className="flex items-center space-x-2">
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
          <button onClick={() => removeFromCart(item.id)} className="ml-2 px-2 py-1 bg-red-200 rounded">X</button>
        </div>
      )}
    </div>
  );
};

export default CartItem;