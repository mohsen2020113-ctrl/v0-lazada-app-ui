'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Search, MoreVertical, Send, ImageIcon, Smile, Mic, Phone, Video, ShoppingBag, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const conversations = [
  { id: 'assistant', name: 'LEE Assistant', avatar: null, isBot: true, lastMessage: 'How can I help you today?', time: 'Now', unread: 0, pinned: true },
  { id: '1', name: 'TechGadget Store', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', lastMessage: 'Your order has been shipped!', time: '2m', unread: 2, pinned: false },
  { id: '2', name: 'Fashion Hub', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80', lastMessage: 'Thank you for your purchase!', time: '1h', unread: 0, pinned: false },
  { id: '3', name: 'Home Essentials', avatar: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80', lastMessage: 'We have a special offer for you', time: '3h', unread: 1, pinned: false },
  { id: '4', name: 'Beauty Paradise', avatar: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&q=80', lastMessage: 'Your refund has been processed', time: 'Yesterday', unread: 0, pinned: false },
  { id: '5', name: 'Sports World', avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&q=80', lastMessage: 'New arrivals just for you!', time: 'Yesterday', unread: 0, pinned: false },
];

const chatMessages = [
  { id: 1, sender: 'seller', text: 'Hello! Thank you for your interest in our products. How can I help you today?', time: '10:30 AM' },
  { id: 2, sender: 'user', text: 'Hi! I want to know if the blue variant is still available?', time: '10:31 AM' },
  { id: 3, sender: 'seller', text: 'Yes, the blue variant is in stock! Would you like me to reserve one for you?', time: '10:32 AM' },
  { id: 4, sender: 'seller', type: 'product', product: { name: 'Wireless Bluetooth Earbuds Pro', price: 'AED 1,299', originalPrice: 'AED 2,499', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&q=80' }, time: '10:32 AM' },
  { id: 5, sender: 'user', text: 'That looks great! Can I get a discount if I buy 2?', time: '10:35 AM' },
  { id: 6, sender: 'seller', text: 'Absolutely! I can offer you 15% off if you purchase 2 units. Would you like to proceed?', time: '10:36 AM' },
];

const quickReplies = [
  'Is this available?',
  'What are the sizes?',
  'Can I get a discount?',
  'When will it ship?',
];

export default function MessagePage() {
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(chatMessages);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }]);
      setMessage('');
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const selectedConvo = conversations.find(c => c.id === activeChat);

  // Chat View
  if (activeChat) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setActiveChat(null)} className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          {selectedConvo?.isBot ? (
            <div className="w-10 h-10 bg-gradient-to-br from-[#E31C79] to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
              <Image src={selectedConvo?.avatar || ''} alt="" fill className="object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-bold text-gray-900">{selectedConvo?.name}</h2>
            <p className="text-xs text-green-600">Online</p>
          </div>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {msg.type === 'product' && msg.product ? (
                  <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                        <Image src={msg.product.image} alt="" fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{msg.product.name}</p>
                        <p className="text-[#E31C79] font-bold">{msg.product.price}</p>
                        <p className="text-xs text-gray-400 line-through">{msg.product.originalPrice}</p>
                      </div>
                    </div>
                    <button className="w-full mt-2 bg-[#E31C79] text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      View Product
                    </button>
                  </div>
                ) : (
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-[#E31C79] text-white rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                )}
                <p className={`text-[10px] text-gray-400 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto hide-scrollbar">
          {quickReplies.map((reply, index) => (
            <button
              key={index}
              onClick={() => setMessage(reply)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-all"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600">
            <ImageIcon className="w-6 h-6" />
          </button>
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="text-gray-400 hover:text-gray-600 ml-2">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          {message ? (
            <button onClick={handleSend} className="w-10 h-10 bg-[#E31C79] rounded-full flex items-center justify-center text-white">
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Conversation List
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <button className="text-gray-600">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
        
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="divide-y divide-gray-100">
        {conversations.map((convo) => (
          <button
            key={convo.id}
            onClick={() => setActiveChat(convo.id)}
            className="w-full bg-white px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-all"
          >
            {/* Avatar */}
            {convo.isBot ? (
              <div className="w-14 h-14 bg-gradient-to-br from-[#E31C79] to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg relative flex-shrink-0">
                AI
                {convo.pinned && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-[10px]">!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full overflow-hidden relative flex-shrink-0">
                <Image src={convo.avatar || ''} alt="" fill className="object-cover" />
                {convo.unread > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E31C79] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {convo.unread}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className={`font-semibold truncate ${convo.unread > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
                  {convo.name}
                </h3>
                <span className={`text-xs ${convo.unread > 0 ? 'text-[#E31C79] font-semibold' : 'text-gray-400'}`}>
                  {convo.time}
                </span>
              </div>
              <p className={`text-sm truncate ${convo.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {convo.lastMessage}
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-gray-300" />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
