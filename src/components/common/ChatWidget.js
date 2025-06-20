import React, { useState } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Tạo client ID dựa trên user đang đăng nhập
function getClientId() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.id) {
    return `user_${user.id}`;
  }
  // Nếu chưa đăng nhập, tạo ID tạm thời
  let guestId = localStorage.getItem('chat_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chat_guest_id', guestId);
  }
  return guestId;
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'));
}

// Lưu yêu cầu chat vào localStorage
function saveChatRequest(request) {
  const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
  const clientId = getClientId();
  const user = getCurrentUser();
  
  if (!histories[clientId]) {
    histories[clientId] = [];
  }
  
  histories[clientId].push({
    ...request,
    from: 'user',
    text: `Yêu cầu: Kiểm tra đơn hàng #${request.orderId} (${request.email})`,
    time: new Date().toISOString(),
    userId: user ? user.id : null,
    userName: user ? user.name || user.email : 'Khách',
    seen: false
  });
  
  localStorage.setItem('chat_histories', JSON.stringify(histories));
}

// Lấy phản hồi admin (nếu có)
function getAdminReply(clientId) {
  const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
  const messages = histories[clientId] || [];
  const lastAdminMessage = messages.filter(msg => msg.from === 'admin').pop();
  return lastAdminMessage ? lastAdminMessage.text : null;
}

// Lấy lịch sử chat của khách
function getClientChatHistory(clientId) {
  const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
  return histories[clientId] || [];
}

const ChatWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: chọn chức năng, 1: nhập thông tin, 2: đã gửi
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [adminReply, setAdminReply] = useState(null);
  const [history, setHistory] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const clientId = getClientId();

  // Tính số tin nhắn chưa đọc
  React.useEffect(() => {
    const interval = setInterval(() => {
      const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
      const messages = histories[clientId] || [];
      const unread = messages.filter(msg => msg.from === 'admin' && !msg.seen).length;
      setUnreadCount(unread);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [clientId]);

  // Đánh dấu tin nhắn đã đọc khi mở chat
  React.useEffect(() => {
    if (open) {
      const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
      if (histories[clientId]) {
        histories[clientId] = histories[clientId].map(msg => ({
          ...msg,
          seen: msg.from === 'admin' ? true : msg.seen
        }));
        localStorage.setItem('chat_histories', JSON.stringify(histories));
      }
    }
  }, [open, clientId]);

  React.useEffect(() => {
    if (open) {
      // Load chat history when widget is opened
      setHistory(getClientChatHistory(clientId));
      
      // Set up interval to check for new messages
      const interval = setInterval(() => {
        setHistory(getClientChatHistory(clientId));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [open, sent, clientId]);

  const handleSend = () => {
    setError('');
    if (!orderId.trim()) {
      setError('Vui lòng nhập mã đơn hàng!');
      return;
    }
    setLoading(true);
    // Lưu yêu cầu vào localStorage với email của user đang đăng nhập
    saveChatRequest({
      id: Date.now(),
      clientId,
      type: 'order_check',
      orderId,
      email: user.email,  // Sử dụng email của user đang đăng nhập
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setStep(2);
    }, 700);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const histories = JSON.parse(localStorage.getItem('chat_histories') || '{}');
    const user = getCurrentUser();
    
    if (!histories[clientId]) {
      histories[clientId] = [];
    }
    
    histories[clientId].push({
      from: 'user',
      text: message,
      time: new Date().toISOString(),
      userId: user ? user.id : null,
      userName: user ? user.name || user.email : 'Khách',
      seen: false
    });
    
    localStorage.setItem('chat_histories', JSON.stringify(histories));
    setMessage('');
  };

  // Nếu chưa đăng nhập hoặc là admin, không hiển thị chat widget
  if (!user || user.id === 'admin') {
    return null;
  }

  // UI
  return (
    <>
      {/* Nút chat nổi */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center px-4 py-3 transition-all relative"
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={28} className="mr-2" />
            <span className="font-semibold">Chat</span>
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Popup chat */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 max-w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-fadeIn flex flex-col" style={{ height: '500px' }}>
          {/* Header cố định */}
          <div className="flex items-center justify-between bg-orange-500 text-white rounded-t-2xl px-4 py-3">
            <span className="font-bold text-lg">Hỗ trợ khách hàng</span>
            <button onClick={() => setOpen(false)} className="hover:bg-orange-600 rounded-full p-1">
              <X size={22} />
            </button>
          </div>

          {/* Container chính với flexbox */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Phần kiểm tra đơn hàng - luôn ở đầu */}
            {step === 0 && (
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="mb-3 text-gray-700 font-medium">Bạn cần hỗ trợ gì?</div>
                <button
                  className="w-full flex items-center justify-between bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold px-4 py-3 rounded-lg mb-2 transition"
                  onClick={() => setStep(1)}
                >
                  Kiểm tra đơn hàng của tôi <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Phần nhập thông tin đơn hàng */}
            {step === 1 && (
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="mb-3 text-gray-700 font-medium">Vui lòng nhập mã đơn hàng:</div>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-900"
                  placeholder="Mã đơn hàng"
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  disabled={loading}
                />
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
                  onClick={handleSend}
                  disabled={loading}
                >
                  {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
                <button
                  className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                  onClick={() => setStep(0)}
                  disabled={loading}
                >
                  Quay lại
                </button>
              </div>
            )}

            {/* Phần lịch sử chat - có thể scroll */}
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              <div className="flex flex-col space-y-2">
                {history.map((msg) => (
                  <div key={msg.time} className="w-full flex">
                    <div className={`max-w-[80%] ${msg.from === 'admin' ? 'mr-auto' : 'ml-auto'}`}>
                      <div className={`rounded-lg px-3 py-2 text-sm ${
                        msg.from === 'admin' 
                          ? 'bg-gray-200 text-gray-800' 
                          : 'bg-[#0084ff] text-white'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input chat - cố định ở dưới */}
            {(step === 2 || history.length > 0) && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-[#0084ff] hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 