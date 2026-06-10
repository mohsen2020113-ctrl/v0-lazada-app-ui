'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      status: 'To Pay',
      items: 2,
      total: '฿1,299.00',
      date: '2025-03-08',
    },
    {
      id: 2,
      status: 'To Ship',
      items: 1,
      total: '฿549.99',
      date: '2025-03-07',
    },
    {
      id: 3,
      status: 'To Receive',
      items: 3,
      total: '฿2,499.99',
      date: '2025-03-05',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-bold">{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{order.items} items</p>
                <p className="font-bold text-gray-900">{order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
