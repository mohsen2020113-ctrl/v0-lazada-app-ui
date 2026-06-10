'use client'

import { ChevronLeft, Edit2, Heart, MessageSquare, Gift, DollarSign, ShoppingBag, Star, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Mohsen Alattas</h1>
          <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl border-4 border-yellow-200">👤</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mohsen Alattas</h2>
              <p className="text-sm text-gray-600">Premium Member</p>
            </div>
          </div>
        </div>

        {/* My Channels */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-3">My Channels</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { name: 'Stay trendy...', color: 'from-pink-200 to-pink-300' },
              { name: 'Share Link t...', color: 'from-pink-300 to-pink-400' },
              { name: '4LEEE BEAUT...', color: 'from-purple-200 to-purple-300' },
            ].map((channel, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${channel.color} rounded-lg p-4 text-center hover:shadow-lg transition-shadow cursor-pointer`}>
                <div className="text-4xl mb-2">{'👗💄🎀'[idx]}</div>
                <p className="text-xs font-bold text-gray-800 line-clamp-2">{channel.name}</p>
              </div>
            ))}
          </div>
          <button className="w-full text-center py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">View more channels ∨</button>
        </div>

        {/* 4LEEE Wallet */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-gray-900" />
            <h3 className="font-bold text-lg text-gray-900">4LEEE Wallet</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
              <p className="text-sm text-gray-600 mb-1">4LEEE Wallet (฿)</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">0.00</p>
              <button className="w-full text-sm font-bold text-gray-600 hover:bg-gray-200 rounded py-1">Activate</button>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-300">
              <p className="text-sm text-gray-600 mb-1">Payment Options</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">2</p>
              <button className="w-full text-sm font-bold text-gray-600 hover:bg-gray-200 rounded py-1">View</button>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900">Recently Viewed</h3>
            <Link href="#" className="text-gray-600 text-sm font-medium">View More &gt;</Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Plant 1', price: '฿1,344.82', emoji: '🪴' },
              { name: 'Plant 2', price: '฿94.31', emoji: '🌿' },
              { name: 'Plant 3', price: '฿2,290.00', emoji: '🌴' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-100 h-24 flex items-center justify-center text-4xl">{item.emoji}</div>
                <div className="p-3">
                  <p className="text-sm font-bold text-gray-900 mb-1">Product Name</p>
                  <p className="text-lg font-bold text-pink-600">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Heart, label: 'WishList' },
              { icon: MessageSquare, label: 'My Reviews' },
              { icon: Gift, label: 'Chat with Customer Care' },
              { icon: DollarSign, label: 'Bill Payment' },
              { icon: ShoppingBag, label: 'Followed Stores' },
              { icon: Star, label: 'Memberships' },
              { icon: DollarSign, label: 'Open shop' },
              { icon: Gift, label: 'Try & Buy' },
            ].map((action, idx) => {
              const Icon = action.icon
              return (
                <button key={idx} className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <Icon className="w-5 h-5 text-gray-700" />
                  <p className="text-xs font-bold text-gray-900 text-center line-clamp-2">{action.label}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
            <div>
              <label className="block text-sm text-gray-600 mb-2">First Name</label>
              <input type="text" defaultValue="Mohsen" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Last Name</label>
              <input type="text" defaultValue="Alattas" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input type="email" defaultValue="mohsen@example.com" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Phone</label>
              <input type="tel" defaultValue="+66 12 345 6789" disabled className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
