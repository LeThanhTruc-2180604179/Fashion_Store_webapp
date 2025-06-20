import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

function getReviews(productId) {
  return JSON.parse(localStorage.getItem(`reviews_${String(productId)}`) || '[]');
}
function saveReviews(productId, reviews) {
  localStorage.setItem(`reviews_${String(productId)}`, JSON.stringify(reviews));
}

const ReviewModal = ({ open, onClose, product, user }) => {
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' });
  const [error, setError] = useState('');
  const [myReview, setMyReview] = useState(null);

  useEffect(() => {
    if (product && user) {
      const reviews = getReviews(product.id);
      setMyReview(reviews.find(r => r.userId === user.id) || null);
    }
  }, [product, user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rating || !form.title.trim() || !form.comment.trim()) {
      setError('Vui lòng nhập đủ thông tin và chọn số sao!');
      return;
    }
    const reviews = getReviews(product.id);
    const newReview = {
      userId: user.id,
      userName: user.name || user.email,
      rating: form.rating,
      title: form.title,
      comment: form.comment,
      date: new Date().toISOString(),
    };
    const updated = myReview
      ? reviews.map(r => r.userId === user.id ? newReview : r)
      : [newReview, ...reviews];
    saveReviews(product.id, updated);
    window.dispatchEvent(new Event('review-updated'));
    setMyReview(newReview);
    setForm({ rating: 0, title: '', comment: '' });
    onClose();
  };

  if (!open || !product) return null;

  // Nếu user đã review, chỉ hiển thị lại review cũ, không cho nhập/sửa
  if (myReview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
          <div className="text-center mb-4">
            <div className="font-bold text-xl mt-2">Đánh giá của bạn</div>
            <div className="flex justify-center mb-2">
              {[1,2,3,4,5].map(i => (
                <Star
                  key={i}
                  size={28}
                  className={i <= myReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-100'}
                />
              ))}
            </div>
          </div>
          <div className="mb-2 text-left">
            <div className="font-semibold text-base mb-1">{myReview.title}</div>
            <div className="text-gray-700 mb-2">{myReview.comment}</div>
            <div className="text-xs text-gray-500">{myReview.userName} - {new Date(myReview.date).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu chưa review, cho nhập và submit
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
        <div className="text-center mb-4">
          <div className="font-bold text-xl mb-2">Viết đánh giá sản phẩm</div>
          <div className="flex justify-center mb-2">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                size={28}
                className={i <= form.rating ? 'text-yellow-400 fill-yellow-400 cursor-pointer' : 'text-gray-300 fill-gray-100 cursor-pointer'}
                onClick={() => setForm(f => ({ ...f, rating: i }))}
              />
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Tiêu đề (ví dụ: Chất lượng tuyệt vời)"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            maxLength={50}
            required
          />
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Nhận xét của bạn về sản phẩm này..."
            value={form.comment}
            onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
            rows={4}
            maxLength={300}
            required
          />
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold"
          >
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal; 