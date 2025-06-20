import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import ReviewModal from './ReviewModal';

function getReviews(productId) {
  return JSON.parse(localStorage.getItem(`reviews_${String(productId)}`) || '[]');
}
function saveReviews(productId, reviews) {
  localStorage.setItem(`reviews_${String(productId)}`, JSON.stringify(reviews));
}

const StarRating = ({ value, size = 20 }) => (
  <div className="flex items-center">
    {[1,2,3,4,5].map(i => (
      <Star
        key={i}
        size={size}
        className={i <= value ? 'text-black fill-black' : 'text-white fill-white stroke-black'}
        style={{ filter: i > value ? 'drop-shadow(0 0 1px #000)' : undefined }}
      />
    ))}
  </div>
);

function averageRating(reviews) {
  if (!reviews.length) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
}

const ProductReviewSection = ({ product }) => {
  const { user } = useAuth();
  const { orderHistory } = useCart();
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const [reviews, setReviews] = useState(() => getReviews(product.id));
  const [myReview, setMyReview] = useState(() => reviews.find(r => r.userId === user?.id) || null);
  const [form, setForm] = useState({ rating: 0, title: '', comment: '' });
  const [error, setError] = useState('');
  const canReview = user && orderHistory.some(o => o.items.some(i => i.productId === product.id));
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    const loadedReviews = getReviews(product.id);
    setReviews(loadedReviews);
    setMyReview(loadedReviews.find(r => r.userId === user?.id) || null);
  }, [modalOpen, expanded, user]);

  useEffect(() => {
    if (canReview && !myReview) {
      setModalOpen(true);
    }
  }, [canReview, myReview]);

  useEffect(() => {
    const reloadReviews = () => {
      const loadedReviews = getReviews(product.id);
      setReviews(loadedReviews);
      setMyReview(loadedReviews.find(r => r.userId === user?.id) || null);
    };
    window.addEventListener('review-updated', reloadReviews);
    return () => window.removeEventListener('review-updated', reloadReviews);
  }, [product.id, user]);

  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.rating || !form.title.trim() || !form.comment.trim()) {
      setError('Vui lòng nhập đủ thông tin và chọn số sao!');
      return;
    }
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
    setReviews(updated);
    setMyReview(newReview);
    saveReviews(product.id, updated);
    setForm({ rating: 0, title: '', comment: '' });
    setModalOpen(false);
  };

  const latestReviews = reviews.slice(0, 4);

  return (
    <div className="mt-8">
      <div className="border-t border-black/80 mb-2" />
      <div
        className="flex items-center gap-3 py-2 cursor-pointer select-none hover:bg-gray-100 rounded transition"
        onClick={() => setExpanded(v => !v)}
        style={{ userSelect: 'none' }}
      >
        <span className="font-bold text-lg">Reviews</span>
        <StarRating value={averageRating(reviews)} size={20} />
        <span className="text-gray-600">({reviews.length} lượt đánh giá)</span>
        <span className="ml-auto flex items-center">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </div>
      {expanded && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
          {latestReviews.length === 0 && <div className="text-gray-500">Chưa có đánh giá nào.</div>}
          {latestReviews.map((r, idx) => (
            <div key={idx} className="mb-4 border-b border-gray-200 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <StarRating value={r.rating} size={18} />
                <span className="font-semibold text-sm">{r.title}</span>
                <span className="text-xs text-gray-500 ml-auto">
                  {r.userId === user?.id ? 'Đánh giá của bạn' : r.userName} - {new Date(r.date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-700">{r.comment}</div>
            </div>
          ))}
          {reviews.length > 4 && (
            <button className="text-blue-600 hover:underline mt-2" onClick={() => setShowAllReviews(true)}>More Reviews</button>
          )}
          {canReview && !myReview && (
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={() => setModalOpen(true)}
            >
              Viết đánh giá
            </button>
          )}
        </div>
      )}
      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={product}
        user={user}
      />
      {showAllReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAllReviews(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            <div className="text-center mb-4">
              <div className="font-bold text-2xl">Tất cả đánh giá ({reviews.length})</div>
              <div className="flex justify-center mb-2"><StarRating value={averageRating(reviews)} size={24} /></div>
              <div className="text-gray-500 text-sm mb-2">{averageRating(reviews)} stars</div>
            </div>
            <div className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
              {reviews.map((r, idx) => (
                <div key={idx} className="py-4">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating value={r.rating} size={18} />
                    <span className="font-semibold text-sm">{r.title}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {r.userId === user?.id ? 'Đánh giá của bạn' : r.userName} - {new Date(r.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviewSection; 