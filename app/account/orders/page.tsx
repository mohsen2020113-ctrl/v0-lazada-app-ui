'use client';

import { Header } from '@/components/lee/header';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { Package, ChevronRight } from 'lucide-react';

const orders = [
  {
    id: 'ORD-001',
    date: '2024-03-15',
    total: 5,
    status: 'Delivered',
    items: 3,
    statusColor: 'bg-green-100 text-green-800',
  },
  {
    id: 'ORD-002',
    date: '2024-03-10',
    total: 12,
    status: 'In Transit',
    items: 2,
    statusColor: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'ORD-003',
    date: '2024-03-05',
    total: 8,
    status: 'Processing',
    items: 4,
    statusColor: 'bg-yellow-100 text-yellow-800',
  },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header title="My Orders" showBack />

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        <div className="max-w-2xl mx-auto">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Package className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h2>
              <p className="text-gray-600 text-center">Orders you place will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{order.id}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{order.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{order.items} items</p>
                      <p className="text-base sm:text-lg font-bold text-[#f85c98]">AED {order.total * 1000}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
