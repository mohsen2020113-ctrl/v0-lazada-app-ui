'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Package, Tag, Bell, Settings, Trash2, Check } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

type NotificationType = 'order' | 'promo' | 'system';
type TabType = 'all' | 'orders' | 'promotions' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  image?: string;
}

const notifications: Notification[] = [
  { id: '1', type: 'order', title: 'Order Delivered', description: 'Your order #TH2024031500012345 has been delivered successfully', time: '2h ago', read: false },
  { id: '2', type: 'promo', title: 'Flash Sale Starting Now!', description: 'Up to 70% off on Electronics. Limited time only!', time: '3h ago', read: false },
  { id: '3', type: 'order', title: 'Order Shipped', description: 'Your order #TH2024031400012344 is on the way', time: '5h ago', read: true },
  { id: '4', type: 'system', title: 'Account Security', description: 'New login detected from Bangkok, Thailand', time: '1d ago', read: true },
  { id: '5', type: 'promo', title: 'Exclusive Voucher', description: 'You have received a AED 100 off voucher. Valid until March 20', time: '1d ago', read: false },
  { id: '6', type: 'order', title: 'Payment Confirmed', description: 'Payment for order #TH2024031300012343 confirmed', time: '2d ago', read: true },
  { id: '7', type: 'system', title: 'Profile Updated', description: 'Your profile information has been updated successfully', time: '3d ago', read: true },
  { id: '8', type: 'promo', title: 'Double Coins Weekend', description: 'Earn 2x LEE Coins on all purchases this weekend', time: '4d ago', read: true },
];

const tabs: { id: TabType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'orders', label: 'Orders' },
  { id: 'promotions', label: 'Promos' },
  { id: 'system', label: 'System' },
];

const typeToTab: Record<NotificationType, TabType> = {
  order: 'orders',
  promo: 'promotions',
  system: 'system',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [items, setItems] = useState(notifications);
  const [swipingId, setSwipingId] = useState<string | null>(null);

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(item => typeToTab[item.type] === activeTab);

  const unreadCount = items.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setItems(prev => prev.map(item => ({ ...item, read: true })));
  };

  const deleteNotification = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSwipingId(null);
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'order': return <Package className="w-5 h-5 text-white" />;
      case 'promo': return <Tag className="w-5 h-5 text-white" />;
      case 'system': return <Bell className="w-5 h-5 text-white" />;
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
      case 'order': return 'bg-green-500';
      case 'promo': return 'bg-[#E31C79]';
      case 'system': return 'bg-blue-500';
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Bell className="w-12 h-12 text-gray-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
      <p className="text-gray-500 text-center text-sm">
        {activeTab === 'all' 
          ? "You're all caught up! Check back later for updates."
          : `No ${activeTab} notifications yet.`}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-[#E31C79] text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-[#E31C79] font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => {
            const tabCount = tab.id === 'all' 
              ? items.filter(n => !n.read).length
              : items.filter(n => typeToTab[n.type] === tab.id && !n.read).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium relative transition-colors ${
                  activeTab === tab.id ? 'text-[#E31C79]' : 'text-gray-600'
                }`}
              >
                {tab.label}
                {tabCount > 0 && (
                  <span className="absolute top-2 right-1/4 w-2 h-2 bg-[#E31C79] rounded-full" />
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-[#E31C79]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      {filteredItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`relative bg-white overflow-hidden ${!item.read ? 'border-l-4 border-l-[#E31C79]' : ''}`}
            >
              {/* Swipe to Delete Background */}
              {swipingId === item.id && (
                <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-white" />
                </div>
              )}
              
              <div
                className={`flex gap-3 p-4 transition-transform ${
                  swipingId === item.id ? '-translate-x-20' : 'translate-x-0'
                }`}
                onClick={() => setSwipingId(swipingId === item.id ? null : item.id)}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm ${!item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {item.title}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">{item.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>

                {/* Unread Dot */}
                {!item.read && (
                  <div className="w-2 h-2 bg-[#E31C79] rounded-full flex-shrink-0 mt-2" />
                )}
              </div>

              {/* Delete Button (shown when swiped) */}
              {swipingId === item.id && (
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center"
                >
                  <Trash2 className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
