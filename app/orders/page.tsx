'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Search, Package, Truck, Star, X, RotateCcw, MessageCircle, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'to-pay', label: 'To Pay' },
  { id: 'to-ship', label: 'To Ship' },
  { id: 'to-receive', label: 'To Receive' },
  { id: 'to-review', label: 'To Review' },
  { id: 'cancelled', label: 'Cancelled' },
];

const orders = [
  {
    id: 'LEE2026050001',
    status: 'to-receive',
    statusLabel: 'Shipping',
    statusColor: 'bg-blue-100 text-blue-700',
    date: '3 May 2026',
    seller: 'TechStore Official',
    items: [
      { id: 1, name: 'Wireless Bluetooth Earbuds Pro', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop', price: 1299, qty: 1 },
    ],
    total: 1329,
  },
  {
    id: 'LEE2026040085',
    status: 'completed',
    statusLabel: 'Delivered',
    statusColor: 'bg-green-100 text-green-700',
    date: '28 Apr 2026',
    seller: 'Fashion Hub',
    items: [
      { id: 1, name: 'Premium Cotton T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop', price: 450, qty: 2 },
      { id: 2, name: 'Classic Denim Jeans', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop', price: 890, qty: 1 },
    ],
    total: 1790,
  },
  {
    id: 'LEE2026040012',
    status: 'to-review',
    statusLabel: 'To Review',
    statusColor: 'bg-yellow-100 text-yellow-700',
    date: '20 Apr 2026',
    seller: 'Beauty Paradise',
    items: [
      { id: 1, name: 'Hydrating Face Serum 30ml', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&h=100&fit=crop', price: 750, qty: 1 },
    ],
    total: 780,
  },
  {
    id: 'LEE2026030088',
    status: 'cancelled',
    statusLabel: 'Cancelled',
    statusColor: 'bg-red-100 text-red-700',
    date: '15 Mar 2026',
    seller: 'Home Essentials',
    items: [
      { id: 1, name: 'Smart LED Desk Lamp', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop', price: 599, qty: 1 },
    ],
    total: 629,
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    if (activeTab !== 'all' && order.status !== activeTab && !(activeTab === 'to-receive' && order.status === 'completed')) {
      return false;
    }
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getActionButtons = (status: string) => {
    switch (status) {
      case 'to-receive':
        return [
          { label: 'Track', icon: Truck, action: 'track' },
          { label: 'Contact', icon: MessageCircle, action: 'contact' },
        ];
      case 'to-review':
        return [
          { label: 'Review', icon: Star, action: 'review' },
          { label: 'Reorder', icon: RotateCcw, action: 'reorder' },
        ];
      case 'completed':
        return [
          { label: 'Reorder', icon: RotateCcw, action: 'reorder' },
          { label: 'Review', icon: Star, action: 'review' },
        ];
      case 'cancelled':
        return [
          { label: 'Reorder', icon: RotateCcw, action: 'reorder' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button onClick={() => router.back()}>
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="flex-1 text-center font-bold text-lg">My Orders</h1>
          <div className="w-6" />
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent ml-2 text-sm outline-none"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium relative ${
                activeTab === tab.id ? 'text-[#E31C79]' : 'text-gray-500'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E31C79]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-20 h-20 text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No orders found</p>
            <p className="text-gray-400 text-sm">Your orders will appear here</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 bg-[#E31C79] text-white px-8 py-3 rounded-full font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{order.date}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${order.statusColor}`}>
                    {order.statusLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{order.seller}</span>
                  <span className="text-xs text-gray-400">{order.id}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex gap-3 mb-3 last:mb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.qty}</p>
                    </div>
                    <p className="text-sm font-bold text-[#E31C79]">AED {item.price}</p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                <span className="text-sm text-gray-600">{order.items.length} item(s)</span>
                <span className="font-bold">Total: <span className="text-[#E31C79]">AED {order.total}</span></span>
              </div>

              {/* Action Buttons */}
              <div className="p-4 flex gap-2">
                {getActionButtons(order.status).map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button
                      key={btn.action}
                      onClick={() => {
                        if (btn.action === 'track') router.push(`/orders/${order.id}/track`);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:border-[#E31C79] hover:text-[#E31C79] transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
