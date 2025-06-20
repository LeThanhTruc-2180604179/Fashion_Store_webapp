import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
      <AlertTriangle size={64} className="text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Không tìm thấy trang</h1>
      <p className="text-lg text-gray-600 mb-6">Trang bạn truy cập không tồn tại hoặc bạn không có quyền truy cập.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        Quay về trang chủ
      </button>
    </div>
  );
};

export default NotFoundPage; 