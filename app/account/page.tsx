'use client'

import { Settings, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const games = [
    { id: 1, name: 'Biggest Sa...', icon: '🎯' },
    { id: 2, name: 'MergeBoss', icon: '🎲' },
    { id: 3, name: 'GoGoMatch', icon: '🎮' },
    { id: 4, name: 'LazFun', icon: '🎪' },
    { id: 5, name: 'Crack & Win', icon: '💎' },
    { id: 6, name: 'More...', icon: '◀' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white pb-24">
      {/* Pink Gradient Header */}
      <div className="bg-gradient-to-br from-pink-100 via-pink-50 to-white px-4 pt-4 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-700 border-4 border-yellow-300 flex items-center justify-center text-white font-bold text-lg">MA</div>
            <h2 className="font-bold text-xl text-gray-900">Mohsen Alattas</h2>
          </div>
          <Link href="/account/settings">
            <Settings className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
        
        {/* Voucher Badge */}
        <div className="bg-white rounded-lg p-3 flex items-center gap-2 shadow-sm">
          <span className="text-pink-600 font-bold">✓</span>
          <span className="font-bold text-gray-900 flex-1 text-sm">52 vouchers | claim ฿1,000 vouc...</span>
          <ChevronRight className="w-5 h-5 text-pink-600" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* My Games */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-gray-900">My Games</h3>
            <button className="text-gray-700 font-bold text-sm hover:underline">Mission Center {'>'}</button>
          </div>

          {/* Coins & Prize Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Coins */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <span className="text-3xl mb-2 block">🎯</span>
              <p className="font-bold text-gray-900 text-sm mb-1">Coins</p>
              <p className="text-xs mb-3"><span className="font-bold text-gray-900">250</span> <span className="text-gray-600">Free Coins</span></p>
              <div className="flex gap-2 mb-2">
                <button className="bg-pink-600 text-white font-bold px-2 py-1 rounded text-xs">CHECK IN</button>
              </div>
              <button className="w-full bg-pink-600 text-white font-bold py-2 rounded text-sm hover:bg-pink-700">Collect</button>
            </div>

            {/* Prize */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="bg-red-500 text-white font-bold px-2 py-1 rounded inline-block text-xs mb-2">FREE PRIZE</div>
              <p className="font-bold text-gray-900 text-sm mb-1">Lazland</p>
              <p className="text-xs text-gray-600 mb-3">Get Free Prize!</p>
              <button className="w-full bg-pink-600 text-white font-bold py-2 rounded text-sm hover:bg-pink-700">GO</button>
            </div>
          </div>

          {/* Mini Games Grid */}
          <div className="grid grid-cols-3 gap-3">
            {games.map((game) => (
              <button key={game.id} className="text-center hover:shadow-md transition-shadow">
                <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2 flex items-center justify-center h-16">
                  <span className="text-3xl">{game.icon}</span>
                </div>
                <p className="text-xs font-bold text-gray-900 line-clamp-2">{game.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Play Rewards Banner */}
        <div className="bg-white border-2 border-pink-200 rounded-lg p-4 flex items-center justify-between">
          <p className="font-bold text-gray-900">Play to get <span className="text-pink-600">฿20</span> LazRewards!</p>
          <button className="border-2 border-pink-600 text-pink-600 font-bold px-4 py-1 rounded text-sm hover:bg-pink-50">Go</button>
        </div>

        {/* My Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xl text-gray-900">My Orders</h3>
            <button className="text-gray-700 font-bold text-sm hover:underline">View All Orders {'>'}</button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: 'To Pay', icon: '💳' },
              { label: 'To Ship', icon: '📦' },
              { label: 'To Receive', icon: '🚚' },
              { label: 'To Review', icon: '⭐' },
              { label: 'Returns &\nCancellations', icon: '↩️' },
            ].map((item, idx) => (
              <button key={idx} className="text-center hover:shadow-md transition-shadow">
                <div className="bg-pink-600 rounded-lg p-3 mb-2 flex items-center justify-center h-12">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* My Channels */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl text-gray-900">My Channels</h3>
              <button className="text-blue-600 font-bold text-sm">✎ Edit</button>
            </div>
            <button className="text-gray-700 font-bold text-sm hover:underline">All Channels {'>'}</button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* PAYDAY */}
            <div className="bg-pink-200 rounded-lg overflow-hidden">
              <div className="bg-pink-600 text-white font-bold px-2 py-1 text-xs">PAYDAY</div>
              <div className="bg-pink-300 h-24 flex items-center justify-center text-4xl">🎪</div>
              <p className="text-xs font-bold text-gray-900 p-2">PAYDAY</p>
            </div>

            {/* Biggest Sale */}
            <div className="bg-pink-100 rounded-lg p-3 text-center flex flex-col items-center justify-center h-32">
              <p className="text-2xl font-bold text-pink-600 mb-1">15%OFF</p>
              <p className="text-xs text-pink-600 font-bold">Min. spend</p>
              <p className="text-xs text-pink-600 font-bold">฿1,299</p>
            </div>

            {/* LazFlash */}
            <div className="bg-blue-100 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white font-bold px-2 py-1 text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                17:24:19
              </div>
              <div className="bg-blue-200 h-24 flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <p className="text-xs font-bold text-gray-900 p-2 text-center">LazFlash</p>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3 text-white">
            <span className="text-2xl">✈️</span>
            <div className="flex-1">
              <p className="font-bold text-sm">200.-OFF ✨ for PayDay booking</p>
              <p className="text-xs text-gray-300">Check flight & hotel...</p>
            </div>
            <button className="bg-orange-500 text-white font-bold px-3 py-1 rounded text-xs hover:bg-orange-600">GO</button>
          </div>
        </div>
      </div>
    </div>
  )
}
