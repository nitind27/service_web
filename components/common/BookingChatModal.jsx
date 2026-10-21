'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, RefreshCw, User, ShieldCheck, Wrench } from 'lucide-react';

export default function BookingChatModal({ bookingId, bookingNumber, isOpen, onClose, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    if (!bookingId) return;
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true);
      fetchMessages().finally(() => setLoading(false));

      // Auto-poll every 5 seconds while chat drawer is open
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!newMsg.trim() || sending) return;

    const messageText = newMsg.trim();
    setSending(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewMsg('');
        setMessages((prev) => [...prev, data.data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg h-[90vh] sm:h-[620px] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        {/* Chat Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-brand-royal to-brand-navy text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Live Booking Chat</h3>
              <p className="text-xs text-white/80">Booking #{bookingNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={fetchMessages}
              title="Refresh messages"
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Direct Connect Banner */}
        <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Direct chat with assigned partner & customer. Keep discussions on-platform.</span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {loading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-brand-royal" />
              <p className="text-xs">Loading secure message history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 stroke-1 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No messages yet</p>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                You can clarify doorstep arrival time, exact location landmarks, or special requirements here.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {isMe ? 'You' : msg.sender_name}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        msg.sender_role === 'customer'
                          ? 'bg-blue-100 text-blue-700'
                          : msg.sender_role === 'provider'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {msg.sender_role === 'provider' ? 'Technician' : msg.sender_role}
                    </span>
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-brand-royal text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                    }`}
                  >
                    <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isMe ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal focus:border-brand-royal transition-all"
          />
          <button
            type="submit"
            disabled={!newMsg.trim() || sending}
            className="p-2.5 bg-brand-royal hover:bg-brand-navy disabled:opacity-40 text-white rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
