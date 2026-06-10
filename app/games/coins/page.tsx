'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CoinsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center px-4 py-4 gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Coins</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Coins Display */}
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-2xl p-8 text-center shadow-lg">
          <div className="text-7xl mb-4">🪙</div>
          <p className="text-sm text-gray-700 mb-2">Available Coins</p>
          <p className="text-5xl font-bold text-gray-900 mb-4">250</p>
          <p className="text-xs text-gray-700">Free Coins for today</p>
        </div>

        {/* Collect Button */}
        <button 
          disabled
          className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed"
        >
          Collect Coins
        </button>

        {/* Coin History */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Coin History</h2>
          <div className="bg-white rounded-lg divide-y divide-gray-100">
            {[
              { label: 'Daily Check-in', amount: '+50', date: 'Today' },
              { label: 'Purchase Reward', amount: '+100', date: 'Yesterday' },
              { label: 'Spin & Win', amount: '+25', date: '2 days ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <p className="text-sm font-bold text-pink-600">{item.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">How to Earn Coins</h2>
          <div className="bg-white rounded-lg space-y-3">
            {[
              { icon: '✓', title: 'Daily Check-in', desc: '50 coins per day' },
              { icon: '🛒', title: 'Make a Purchase', desc: '1 coin per ₹10 spent' },
              { icon: '🎁', title: 'Referral', desc: '200 coins per friend' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 border border-gray-200 rounded-lg">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
