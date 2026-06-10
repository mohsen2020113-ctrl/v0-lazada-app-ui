'use client'

import { ChevronRight, Settings, LogOut, Gamepad2, ShoppingBag, Heart, MessageSquare, Gift, Star, DollarSign, Zap, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AccountPage() {
  const [activeOrderTab, setActiveOrderTab] = useState('to-pay')

  const orderTabs = [
    { id: 'to-pay', label: 'To Pay', count: 2, icon: '💳' },
    { id: 'to-ship', label: 'To Ship', count: 1, icon: '📦' },
    { id: 'to-receive', label: 'To Receive', count: 3, icon: '📮' },
    { id: 'to-review', label: 'To Review', count: 0, icon: '⭐' },
    { id: 'returns', label: 'Returns & Cancellations', count: 0, icon: '↩️' },
  ]

  const games = [
    { name: 'Coins', icon: '💰', reward: '250 Free Coins', action: 'CHECK IN', color: 'bg-yellow-50 border-2 border-yellow-300' },
    { name: 'Lazland', icon: '🎁', reward: 'Get Free Prize!', action: 'GO', color: 'bg-green-50 border-2 border-green-300' },
  ]

  const channels = [
    { name: 'PAYDAY', badge: 'PAYDAY', color: 'from-pink-400 to-pink-600', discount: '15%OFF', minSpend: '฿1,299' },
    { name: 'Biggest Sa...', color: 'from-yellow-100 to-pink-50', discount: '15%OFF', minSpend: '฿1,299' },
    { name: 'LazFlash', color: 'from-purple-400 to-purple-600', discount: 'Timed', minSpend: '฿1,299' },
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
      {/* Pink Gradient Header */}
      <div className="bg-gradient-to-b from-pink-100 to-pink-50 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-xl border-4 border-yellow-200">👤</div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Mohsen Alattas</h2>
            </div>
          </div>
          <Link href="/account/settings" className="p-2 hover:bg-white/50 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-gray-900" />
          </Link>
        </div>
        <div className="bg-white border-2 border-pink-400 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-pink-600 font-bold">✓</span>
            <p className="text-sm font-bold text-gray-900">52 vouchers | claim ฿1,000 vouc...</p>
          </div>
          <ChevronRight className="w-5 h-5 text-pink-600" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* My Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">My Games</h3>
            <a href="#" className="text-gray-600 font-bold text-sm">Mission Center &gt;</a>
          </div>
          
          {/* Game Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {games.map((game, idx) => (
              <div key={idx} className={`${game.color} rounded-lg p-4`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{game.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{game.name}</p>
                    <p className="text-xs text-gray-600">{game.reward}</p>
                  </div>
                </div>
                <button className="w-full bg-pink-600 text-white py-2 rounded font-bold text-sm hover:bg-pink-700 transition-colors">{game.action}</button>
              </div>
            ))}
          </div>

          {/* Mini Games Grid */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[
              { name: 'Biggest Sa...', icon: '💥' },
              { name: 'MergeBoss', icon: '🎮' },
              { name: 'GoGoMatch', icon: '🎯' },
              { name: 'LazFun', icon: '🎲' },
              { name: 'Crack & Win', icon: '🎪' },
            ].map((game, idx) => (
              <button key={idx} className="text-center hover:shadow-lg transition-shadow">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-1 flex items-center justify-center h-12">
                  <span className="text-2xl">{game.icon}</span>
                </div>
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{game.name}</p>
              </button>
            ))}
          </div>

          {/* Rewards Banner */}
          <div className="text-center p-4 bg-pink-50 border-2 border-pink-200 rounded-lg">
            <p className="font-bold text-gray-900 mb-2">Play to get ฿20 LazRewards!</p>
            <button className="px-6 py-2 border-2 border-pink-600 text-pink-600 font-bold rounded hover:bg-pink-50">Go</button>
          </div>
        </div>

        {/* My Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">My Orders</h3>
            <a href="#" className="text-gray-600 text-sm">View All Orders &gt;</a>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {orderTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveOrderTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeOrderTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <p className="font-bold text-xs">{tab.label}</p>
                {tab.count > 0 && <span className="text-xs">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* My Channels Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">My Channels <span className="text-xs text-gray-600 font-normal">Edit</span></h3>
            <a href="#" className="text-gray-600 text-sm">All Channels &gt;</a>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {channels.map((channel, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${channel.color} rounded-lg p-3 text-white relative overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className="relative z-10">
                  {channel.badge && <p className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded inline-block mb-1">{channel.badge}</p>}
                  <p className="font-bold text-sm mb-1">{channel.name}</p>
                  <p className="text-lg font-bold">{channel.discount}</p>
                  <p className="text-xs">Min. spend {channel.minSpend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Promotional Banner */}
          <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3 mb-4 text-white">
            <span className="text-2xl">✈️</span>
            <div className="flex-1">
              <p className="font-bold text-xs">200.-OFF ✨ for PayDay</p>
              <p className="text-xs">booking* Check flight & hote...</p>
            </div>
            <button className="bg-orange-500 text-white px-3 py-1 rounded font-bold text-xs">GO</button>
          </div>
        </div>
      </div>
    </div>
  )
}
