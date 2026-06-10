'use client'

import { ChevronRight, Settings, LogOut, Gamepad2, ShoppingBag, Heart, MessageSquare, Gift, Star, DollarSign, Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AccountPage() {
  const [activeOrderTab, setActiveOrderTab] = useState('to-pay')

  const orderTabs = [
    { id: 'to-pay', label: 'To Pay', count: 2, icon: '💳' },
    { id: 'to-ship', label: 'To Ship', count: 1, icon: '📦' },
    { id: 'to-receive', label: 'To Receive', count: 3, icon: '📮' },
    { id: 'to-review', label: 'To Review', count: 0, icon: '⭐' },
    { id: 'returns', label: 'Returns', count: 0, icon: '↩️' },
  ]

  const games = [
    { name: 'Coins', icon: '💰', reward: '250 Free Coins', action: 'CHECK IN' },
    { name: 'Lazland', icon: '🎁', reward: 'Get Free Prize!', action: 'GO' },
  ]

  const channels = [
    { name: 'PAYDAY', color: 'from-pink-300 to-pink-600', discount: '15%OFF', minSpend: '฿1,299' },
    { name: 'Biggest Sale', color: 'from-yellow-200 to-yellow-400', discount: '15%OFF', minSpend: '฿1,299' },
    { name: 'LazFlash', color: 'from-purple-300 to-purple-600', discount: '15%OFF', minSpend: '฿1,299' },
  ]

  const quickActions = [
    { icon: Heart, label: 'WishList' },
    { icon: MessageSquare, label: 'My Reviews' },
    { icon: Gift, label: 'Chat with Customer Care' },
    { icon: DollarSign, label: 'Bill Payment' },
    { icon: ShoppingBag, label: 'Followed Stores' },
    { icon: Star, label: 'Memberships' },
    { icon: Zap, label: 'Open shop' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Voucher */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-red-600 rounded-full flex items-center justify-center text-xl border-2 border-white">👤</div>
              <div>
                <h2 className="font-bold text-gray-900">Mohsen Alattas</h2>
                <p className="text-xs text-gray-600">Premium Member</p>
              </div>
            </div>
            <Link href="/account/settings" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 flex items-center justify-between">
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
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-pink-600" /> My Games
            </h3>
            <Link href="#" className="text-pink-600 font-bold text-sm">Mission Center &gt;</Link>
          </div>
          
          {/* Game Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {games.map((game, idx) => (
              <div key={idx} className={idx === 0 ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-green-50 border-2 border-green-300'} className="rounded-lg p-4">
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
          <div className="grid grid-cols-5 gap-2">
            {['Biggest Sa...', 'MergeBoss', 'GoGoMatch', 'LazFun', 'Crack & Win'].map((name, idx) => (
              <button key={idx} className="text-center hover:shadow-lg transition-shadow">
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-1">
                  <span className="text-2xl">🎮</span>
                </div>
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{name}</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-4 p-3 bg-white border border-gray-200 rounded-lg">
            <p className="font-bold text-gray-900 mb-2">Play to get ฿20 LazRewards!</p>
            <button className="px-6 py-2 border-2 border-pink-600 text-pink-600 font-bold rounded hover:bg-pink-50">Go</button>
          </div>
        </div>

        {/* My Orders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">My Orders</h3>
            <Link href="/account/orders" className="text-gray-600 text-sm">View All Orders &gt;</Link>
          </div>
          
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {orderTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveOrderTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-lg whitespace-nowrap transition-all ${
                  activeOrderTab === tab.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <p className="font-bold text-sm">{tab.label}</p>
                {tab.count > 0 && <span className="text-xs">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* My Channels Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">My Channels <span className="text-xs text-gray-600 font-normal">Edit</span></h3>
            <Link href="#" className="text-gray-600 text-sm">All Channels &gt;</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {channels.map((channel, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${channel.color} rounded-lg p-4 text-white relative overflow-hidden hover:shadow-lg transition-shadow`}>
                <div className="relative z-10">
                  <p className="font-bold text-lg mb-2">{channel.name}</p>
                  <p className="text-2xl font-bold mb-1">{channel.discount}</p>
                  <p className="text-xs">Min. spend {channel.minSpend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* View more channels */}
          <button className="w-full bg-white border border-gray-200 rounded-lg py-3 font-bold text-gray-900 hover:bg-gray-50">View more channels ∨</button>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <button key={idx} className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                  <Icon className="w-6 h-6 text-pink-600" />
                  <p className="text-xs font-bold text-gray-900 text-center line-clamp-2">{action.label}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-8">
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  )
}
