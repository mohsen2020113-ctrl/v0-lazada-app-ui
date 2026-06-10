'use client'

import { ChevronLeft, Package, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function OrdersPage() {
  const [orders] = useState([
    { id: '#ORD-001', date: '2024-06-01', status: 'Delivered', total: '฿150.00', items: 3 },
    { id: '#ORD-002', date: '2024-05-28', status: 'Shipped', total: '฿299.50', items: 5 },
    { id: '#ORD-003', date: '2024-05-20', status: 'Processing', total: '฿89.99', items: 2 },
    { id: '#ORD-004', date: '2024-05-15', status: 'Delivered', total: '฿450.00', items: 8 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700'
      case 'Shipped': return 'bg-blue-100 text-blue-700'
      case 'Processing': return 'bg-yellow-100 text-yellow-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href="#" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Package className="w-8 h-8 text-pink-600" />
                <div>
                  <p className="font-bold text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-600">{order.date} • {order.items} items</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>{order.status}</span>
                  <p className="font-bold text-gray-900 mt-1">{order.total}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
