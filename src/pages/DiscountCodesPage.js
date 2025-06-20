import React, { useEffect, useState } from 'react';
import { getDiscountCodes } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

const DiscountCodesPage = () => {
  const [codes, setCodes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) setCodes(getDiscountCodes(user.id));
  }, [user]);

  const now = new Date();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Mã giảm giá của bạn</h2>
      {codes.length === 0 ? (
        <p>Bạn chưa có mã giảm giá nào.</p>
      ) : (
        <ul className="space-y-4">
          {codes.map((c) => {
            const expired = new Date(c.expiresAt) < now;
            const used = c.used;
            const isActive = !used && !expired;
            return (
              <li
                key={c.code}
                className={`border rounded p-4 flex flex-col md:flex-row md:items-center justify-between transition-opacity ${!isActive ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
              >
                <div>
                  <div className="font-mono text-lg font-semibold">{c.code}</div>
                  <div>Giá trị: <span className="font-bold">{c.discountValue.toLocaleString()}đ</span></div>
                  <div>Hạn sử dụng: {formatDate(c.expiresAt)}</div>
                </div>
                <div className="mt-2 md:mt-0">
                  {used ? (
                    <span className="text-gray-500">Đã sử dụng</span>
                  ) : expired ? (
                    <span className="text-red-500">Hết hạn</span>
                  ) : (
                    <span className="text-green-600 font-bold">Còn hiệu lực</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DiscountCodesPage; 