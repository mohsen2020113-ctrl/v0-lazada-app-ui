'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LazlandPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center px-4 py-4 gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Lazland</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Game Display */}
        <div className="bg-gradient-to-br from-green-200 to-green-100 rounded-2xl p-8 text-center shadow-lg">
          <div className="text-7xl mb-4">🎁</div>
          <p className="text-sm text-gray-700 mb-2">Welcome to Lazland</p>
          <p className="text-2xl font-bold text-gray-900 mb-4">Get Free Prize!</p>
          <p className="text-xs text-gray-700">Spin the wheel and win amazing rewards</p>
        </div>

        {/* Play Button */}
        <button 
          onClick={() => router.push('/account')}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-lg transition-colors"
        >
          Play Now
        </button>

        {/* Prize Pool */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Prize Pool</h2>
          <div className="bg-white rounded-lg divide-y divide-gray-100">
            {[
              { prize: '₹500 Voucher', probability: 'Common', icon: '🎫' },
              { prize: '₹1000 Voucher', probability: 'Rare', icon: '🎫' },
              { prize: 'Free Shipping', probability: 'Common', icon: '🚚' },
              { prize: '10% Off Coupon', probability: 'Uncommon', icon: '💝' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.prize}</p>
                    <p className="text-xs text-gray-500">{item.probability}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Limit */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-bold text-gray-900 mb-2">Daily Spin Limit</p>
          <p className="text-xs text-gray-700">You have 3 spins remaining today</p>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-pink-500 h-full" style={{ width: '30%' }}></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Come back tomorrow for more spins!</p>
        </div>

        {/* How to Play */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">How to Play</h2>
          <div className="bg-white rounded-lg space-y-3">
            {[
              { step: '1', title: 'Spin the Wheel', desc: 'Click the play button to spin' },
              { step: '2', title: 'Win Prizes', desc: 'Land on any prize section' },
              { step: '3', title: 'Claim Reward', desc: 'Prize is added to your account' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-3 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-sm font-bold text-pink-600 flex-shrink-0">
                  {item.step}
                </div>
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
