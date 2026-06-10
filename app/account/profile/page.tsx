'use client'

import { ChevronLeft, Edit2, Heart, MessageSquare, Gift, DollarSign, ShoppingBag, Star, Eye, Settings } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const channels = [
    { name: 'Stay trendy...', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop', color: 'from-yellow-100 to-yellow-50' },
    { name: 'Share Link t...', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop', color: 'from-pink-100 to-pink-50' },
    { name: 'LazBEAUT...', image: 'https://images.unsplash.com/photo-1596462502278-af407b1564f7?w=200&h=200&fit=crop', color: 'from-purple-100 to-purple-50' },
  ]

  const recentlyViewed = [
    { name: 'Plant', price: '฿1,344.82', image: '🪴' },
    { name: 'Plant', price: '฿94.31', image: '🌿' },
    { name: 'Plant', price: '฿2,290.00', image: '🌴' },
  ]

  const quickActions = [
    { icon: Heart, label: 'WishList' },
    { icon: MessageSquare, label: 'My Reviews' },
    { icon: Gift, label: 'Chat with Customer Care' },
    { icon: DollarSign, label: 'Bill Payment & Top Up' },
    { icon: ShoppingBag, label: 'Followed Stores' },
    { icon: Star, label: 'Memberships' },
    { icon: DollarSign, label: 'Open shop on Lazada' },
    { icon: Gift, label: 'Try & Buy' },
  ]

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Mohsen Alattas</h1>
        </div>
        <Link href="/account/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5 text-gray-600" />
        </Link>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-2xl border-4 border-yellow-200">👤</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Mohsen Alattas</h2>
          </div>
        </div>

        {/* My Channels */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">My Channels</h3>
          <div className="grid grid-cols-3 gap-3 mb-2">
            {channels.map((channel, idx) => (
              <div key={idx} className="rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="bg-gray-200 aspect-square flex items-center justify-center">
                  {channel.image ? (
                    <img src={channel.image} alt={channel.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">📸</span>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-900 text-center py-2">{channel.name}</p>
              </div>
            ))}
          </div>
          <button className="w-full text-center py-2 text-gray-700 font-bold hover:bg-gray-50 rounded">View more channels ∨</button>
        </div>

        {/* Lazada Wallet */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-5 h-5 text-gray-900" />
            <h3 className="font-bold text-lg text-gray-900">Lazada Wallet</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Lazada Wallet (฿)</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">0.00</p>
              <button className="w-full text-xs font-bold text-gray-700 hover:bg-gray-100 rounded py-1">Activate</button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Payment Options</p>
              <p className="text-2xl font-bold text-blue-600 mb-2">2</p>
              <button className="w-full text-xs font-bold text-blue-600 hover:bg-blue-100 rounded py-1">View</button>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900">Recently Viewed</h3>
            <a href="#" className="text-gray-600 text-sm font-bold">View More &gt;</a>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentlyViewed.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-100 h-20 flex items-center justify-center text-3xl">{item.image}</div>
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-900 mb-1">Product</p>
                  <p className="text-sm font-bold text-pink-600">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <button key={idx} className="flex flex-col items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <Icon className="w-5 h-5 text-gray-900" />
                  <p className="text-xs font-bold text-gray-900 text-center line-clamp-2">{action.label}</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
