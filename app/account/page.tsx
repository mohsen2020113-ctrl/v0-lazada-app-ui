'use client'

import { ChevronRight, Settings, LogOut, Gamepad2, Heart, MessageSquare, Gift, Star, DollarSign, Zap, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AccountPage() {
  const [activeOrderTab, setActiveOrderTab] = useState('to-pay')

  const orderTabs = [
    { id: 'to-pay', label: 'To Pay', icon: '💳' },
    { id: 'to-ship', label: 'To Ship', icon: '📦' },
    { id: 'to-receive', label: 'To Receive', icon: '📮' },
    { id: 'to-review', label: 'To Review', icon: '⭐' },
    { id: 'returns', label: 'Returns & Cancellations', icon: '↩️' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Voucher */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-pink-100 to-pink-50 border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-2xl border-4 border-yellow-200">👤</div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">Mohsen Alattas</h2>
              </div>
            </div>
            <Link href="/account/settings" className="p-2 hover:bg-white rounded-lg transition-colors">
              <Settings className="w-6 h-6 text-gray-600" />
            </Link>
          </div>
          <div className="bg-white border-2 border-pink-400 rounded-lg p-3 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-bold text-pink-700">52 vouchers | claim ฿1,000 vouc...</p>
            </div>
            <ChevronRight className="w-5 h-5 text-pink-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* My Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl text-gray-900">My Games</h3>
            <Link href="#" className="text-gray-500 font-medium text-sm">Mission Center &gt;</Link>
          </div>
          
          {/* Game Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">💰</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg">Coins</p>
                  <p className="text-sm text-gray-600">250 Free Coins</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-pink-600 text-white py-2 rounded font-bold text-sm hover:bg-pink-700 transition-colors">CHECK IN</button>
                <button className="flex-1 bg-pink-600 text-white py-2 rounded font-bold text-sm hover:bg-pink-700 transition-colors">Collect</button>
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🎁</span>
                <div>
                  <p className="font-bold text-gray-900 text-lg">4LEEE Prize</p>
                  <p className="text-sm text-gray-600">Get Free Prize!</p>
                </div>
              </div>
              <button className="w-full bg-pink-600 text-white py-2 rounded font-bold text-sm hover:bg-pink-700 transition-colors">GO</button>
            </div>
          </div>

          {/* Mini Games Grid */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            {[
              { name: 'Biggest Sa...', emoji: '🎯' },
              { name: 'MergeBoss', emoji: '🔗' },
              { name: 'GoGoMatch', emoji: '🎮' },
              { name: '4LEEEFun', emoji: '🎪' },
              { name: 'Crack & Win', emoji: '🏆' }
            ].map((game, idx) => (
              <button key={idx} className="text-center hover:shadow-lg transition-shadow">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-center h-16">
                  <span className="text-3xl">{game.emoji}</span>
                </div>
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{game.name}</p>
              </button>
            ))}
          </div>

          {/* Rewards Banner */}
          <div className="text-center p-4 bg-pink-50 border-2 border-pink-200 rounded-lg">
            <p className="font-bold text-gray-900 mb-2">Play to get ฿20 4LEEERewards!</p>
            <button className="px-8 py-2 border-2 border-pink-600 text-pink-600 font-bold rounded hover:bg-pink-100 transition-colors">Go</button>
          </div>
        </div>

        {/* My Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl text-gray-900">My Orders</h3>
            <Link href="#" className="text-gray-500 font-medium text-sm">View All Orders &gt;</Link>
          </div>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {orderTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveOrderTab(tab.id)}
                className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg transition-all"
              >
                <span className="text-3xl">{tab.icon}</span>
                <p className="font-bold text-sm text-gray-900 text-center">{tab.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* My Channels Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-2xl text-gray-900">My Channels</h3>
              <span className="text-xs text-gray-600 font-medium">Edit</span>
            </div>
            <Link href="#" className="text-gray-500 font-medium text-sm">All Channels &gt;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              { name: 'PAYDAY', emoji: '💝', discount: '15%OFF', color: 'from-pink-400 to-pink-600' },
              { name: 'Biggest Sa...', emoji: '💛', discount: '15%OFF', color: 'from-yellow-200 to-yellow-400' },
              { name: '4LEEEFlash', emoji: '⚡', discount: '15%OFF', color: 'from-purple-400 to-purple-600' }
            ].map((channel, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${channel.color} rounded-lg p-4 text-white relative overflow-hidden hover:shadow-lg transition-shadow h-32`}>
                <div className="relative z-10">
                  <p className="font-bold text-sm mb-1">{channel.name}</p>
                  <p className="text-2xl font-bold">{channel.discount}</p>
                  <p className="text-xs">Min. spend ฿1,299</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-white border-2 border-gray-300 rounded-lg py-3 font-bold text-gray-900 hover:bg-gray-50 transition-colors">View more channels ∨</button>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="font-bold text-2xl text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Heart, label: 'WishList' },
              { icon: MessageSquare, label: 'My Reviews' },
              { icon: Gift, label: 'Chat with Customer Care' },
              { icon: DollarSign, label: 'Bill Payment & Top Up' },
              { icon: ShoppingBag, label: 'Followed Stores' },
              { icon: Star, label: 'Memberships' },
              { icon: DollarSign, label: 'Open shop' },
              { icon: Gift, label: 'Try & Buy' }
            ].map((action, idx) => {
              const Icon = action.icon
              return (
                <button key={idx} className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <Icon className="w-6 h-6 text-gray-700" />
                  <p className="text-xs font-bold text-gray-900 text-center line-clamp-2">{action.label}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-8">
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  )
}
