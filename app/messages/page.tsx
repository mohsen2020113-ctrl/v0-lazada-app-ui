'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { ShoppingCart, MoreHorizontal, MessageCircle, Package, Bell, Tag, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('chats');
  const [showNotificationModal, setShowNotificationModal] = useState(true);
  const router = useRouter();

  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageCircle, badge: '99+' },
    { id: 'orders', label: 'Orders', icon: Package, badge: null },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: '4' },
    { id: 'promos', label: 'Promos', icon: Tag, hasDot: true },
  ];

  const productSuggestions = [
    { id: 1, title: '(1ลังมี 30ห่อ) ...', price: 'AED 85.00', image: 'https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=150&h=150&fit=crop' },
    { id: 2, title: 'แปรงขัดห้องน้ำ ...', price: 'AED 32.00', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=150&h=150&fit=crop' },
    { id: 3, title: 'ใหม่ ไม้กวาดยาง...', price: 'AED 37.00', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=150&h=150&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Message+</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/cart')} className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </button>
          <button>
            <MoreHorizontal className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 relative ${
                  isActive ? 'text-[#f85c98]' : 'text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.badge && (
                  <span className="bg-[#f85c98] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[18px]">
                    {tab.badge}
                  </span>
                )}
                {tab.hasDot && (
                  <span className="absolute top-2 right-4 w-2 h-2 bg-[#f85c98] rounded-full"></span>
                )}
                {isActive && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#f85c98]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar bg-gray-100">
        {/* Product Suggestions */}
        <div className="bg-white p-3">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {productSuggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => router.push(`/product/${product.id}`)}
                className="min-w-[140px] bg-gray-50 rounded-lg overflow-hidden"
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-700 truncate">{product.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[#f85c98] font-bold text-sm">{product.price}</span>
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <ShoppingCart className="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message History Divider */}
        <div className="flex items-center justify-center py-4">
          <div className="flex-1 h-px bg-gray-300 ml-4"></div>
          <span className="px-4 text-sm text-gray-400">Message history above</span>
          <div className="flex-1 h-px bg-gray-300 mr-4"></div>
        </div>

        {/* LEE Chat Bot */}
        <div className="bg-white mx-3 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg">
              <span>🤖</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">LEE Assistant</p>
              <div className="bg-gray-100 rounded-lg p-3 mt-1">
                <p className="text-sm text-gray-700">
                  Saw ไม้กวาดหยากไย่ยืดหดได้ 280 cm? —here&apos;s what else
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <button 
              onClick={() => setShowNotificationModal(false)}
              className="absolute top-4 right-4 text-gray-400"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
              Checking on your order?
            </h2>
            
            {/* Phone Mockup */}
            <div className="flex justify-center mb-6">
              <div className="w-48 h-32 bg-gray-100 rounded-xl border-4 border-gray-800 overflow-hidden relative">
                <div className="bg-gray-200 p-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500">← App notifications</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 bg-white rounded p-1.5">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-orange-500 rounded text-white text-[6px] flex items-center justify-center font-bold">LEE</div>
                      <span className="text-[8px] font-medium">LEE</span>
                    </div>
                    <div className="w-6 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="mt-1 text-[6px] text-gray-500">
                    <p>Regular notifications</p>
                    <p className="mt-0.5">Advanced</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-gray-600 mb-6">
              Stay updated on order progress by turning on<br />
              <span className="font-semibold">Order Notifications</span>
            </p>
            
            <button 
              onClick={() => setShowNotificationModal(false)}
              className="text-center w-full text-[#f85c98] font-semibold py-3"
            >
              Not now
            </button>
            
            <button 
              onClick={() => setShowNotificationModal(false)}
              className="w-full bg-[#f85c98] text-white font-bold py-4 rounded-lg"
            >
              Enable Order Notifications
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
