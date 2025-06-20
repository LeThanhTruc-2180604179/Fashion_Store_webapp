import React, { useState, useEffect } from 'react';

// Lấy tất cả lịch sử chat từ localStorage
function getAllChatHistories() {
  const all = JSON.parse(localStorage.getItem('chat_histories') || '{}');
  return all;
}
// Lưu lịch sử chat
function saveChatHistories(histories) {
  localStorage.setItem('chat_histories', JSON.stringify(histories));
}

const AdminChatPage = () => {
  const [histories, setHistories] = useState(getAllChatHistories());
  const [selectedClient, setSelectedClient] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  // Cập nhật histories khi có thay đổi
  useEffect(() => {
    setHistories(getAllChatHistories());
  }, []);

  // Danh sách khách hàng (clientId, email, lastMsg, lastTime, unreadCount)
  const clients = Object.entries(histories).map(([clientId, msgs]) => {
    const lastMsg = msgs[msgs.length - 1];
    const userMsg = msgs.find(msg => msg.from === 'user');
    const unreadCount = msgs.filter(msg => msg.from === 'user' && msg.seen === false).length;
    return {
      clientId,
      email: userMsg?.email || lastMsg?.userName || 'Khách',
      userName: lastMsg?.userName || 'Khách',
      lastMsg: lastMsg?.text || '',
      lastTime: lastMsg ? new Date(lastMsg.time) : null,
      unreadCount,
    };
  }).sort((a, b) => b.lastTime - a.lastTime);

  // Lọc theo search
  const filteredClients = clients.filter(c => c.email.toLowerCase().includes(search.toLowerCase()));

  // Lấy lịch sử chat của khách đang chọn
  const chat = selectedClient ? histories[selectedClient] || [] : [];

  // Gửi tin nhắn admin
  const handleSend = () => {
    if (!message.trim() || !selectedClient) return;
    const newMsg = {
      from: 'admin',
      text: message,
      time: new Date().toISOString(),
    };
    const updated = { ...histories };
    updated[selectedClient] = [...(updated[selectedClient] || []), newMsg];
    setHistories(updated);
    saveChatHistories(updated);
    setMessage('');
  };

  // Khi chọn khách, đánh dấu các tin nhắn user chưa đọc thành đã xem
  const handleSelectClient = (clientId) => {
    setSelectedClient(clientId);
    const histories = getAllChatHistories();
    const msgs = histories[clientId] || [];
    let updated = false;
    const newMsgs = msgs.map(msg => {
      if (msg.from === 'user' && msg.seen === false) {
        updated = true;
        return { ...msg, seen: true };
      }
      return msg;
    });
    if (updated) {
      histories[clientId] = newMsgs;
      saveChatHistories(histories);
      setHistories({ ...histories });
    }
  };

  // Hiệu ứng tự động scroll xuống cuối khi chat thay đổi
  useEffect(() => {
    const el = document.getElementById('admin-chat-messages');
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat]);

  return (
    <div className="w-full h-[70vh] bg-white rounded-2xl shadow-lg flex overflow-hidden">
      {/* Sidebar khách hàng */}
      <div className="w-1/3 border-r border-gray-200 p-4 flex flex-col">
        <input
          className="mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tìm email khách..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-1 overflow-y-auto">
          {filteredClients.length === 0 && <div className="text-gray-400 text-sm">Không có khách nào.</div>}
          {filteredClients.map(c => (
            <div
              key={c.clientId}
              className={`p-3 rounded-lg mb-2 cursor-pointer flex items-center space-x-2 transition ${selectedClient === c.clientId ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleSelectClient(c.clientId)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-lg relative">
                {c.userName ? c.userName[0].toUpperCase() : 'K'}
                {c.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                    {c.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-sm truncate">{c.email || c.clientId}</div>
                <div className="text-xs text-gray-500 truncate">{c.lastMsg}</div>
              </div>
              <div className="text-xs text-gray-400 ml-2 min-w-[60px] text-right">
                {c.lastTime && c.lastTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Khung chat chính */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
          {selectedClient ? (
            <>
              <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-lg">
                {filteredClients.find(c => c.clientId === selectedClient)?.userName?.[0]?.toUpperCase() || 'K'}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-base">{filteredClients.find(c => c.clientId === selectedClient)?.userName || selectedClient}</div>
                <div className="text-xs text-green-600">Online</div>
              </div>
            </>
          ) : <div className="text-gray-400">Chọn khách để chat</div>}
        </div>
        {/* Lịch sử chat */}
        <div id="admin-chat-messages" className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {selectedClient ? (
            chat.length === 0 ? <div className="text-gray-400 text-sm">Chưa có tin nhắn nào.</div> : (
              chat.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div className={`rounded-2xl px-4 py-2 max-w-[60%] text-sm ${msg.from === 'admin' ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    {msg.text}
                    <div className="text-[10px] text-right mt-1 opacity-60">{new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              ))
            )
          ) : <div className="text-gray-400 text-sm">Chưa chọn khách nào.</div>}
        </div>
        {/* Input gửi tin nhắn */}
        {selectedClient && (
          <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
            <input
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              Gửi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage; 