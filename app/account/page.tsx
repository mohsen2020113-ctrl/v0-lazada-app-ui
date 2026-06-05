'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { ChevronRight, Heart, MessageSquare, Gift, Zap, Settings } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  
  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])
  return (
    <div className="min-h-screen bg-pink-50 pb-24">
      {/* Header with Profile */}
      <div className="bg-gradient-to-b from-pink-200 to-pink-100 px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/account/profile" className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mohsen Alattas</h1>
            </div>
          </Link>
          <Link href="/account/settings">
            <button className="p-2 rounded-full border-2 border-gray-300 hover:bg-white/50 transition-colors">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
        </div>

        {/* Vouchers Banner */}
        <div onClick={() => handleNavigate('/vouchers')} className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm border border-pink-100 cursor-pointer hover:bg-pink-50 transition-colors">
          <div className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-pink-600">52 vouchers | claim ₹1,000 vouc...</p>
          </div>
          <ChevronRight className="w-5 h-5 text-pink-500 flex-shrink-0" />
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* My Games Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Games</h2>
            <Link href="/missions" className="flex items-center gap-1 text-gray-600">
              <span className="text-sm">Mission Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Games - 2 Column */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Coins Card */}
            <div onClick={() => handleNavigate('/games/coins')} className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🪙</div>
              <h3 className="text-sm font-bold text-gray-900">Coins</h3>
              <p className="text-xs text-gray-700 mb-3">250 Free Coins</p>
              <button onClick={(e) => { e.stopPropagation(); handleNavigate('/games/coins'); }} className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                Collect
              </button>
            </div>

            {/* Lazland Card */}
            <div onClick={() => handleNavigate('/games/lazland')} className="bg-gradient-to-br from-green-200 to-green-100 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-sm font-bold text-gray-900">Lazland</h3>
              <p className="text-xs text-gray-700 mb-3">Get Free Prize!</p>
              <button onClick={(e) => { e.stopPropagation(); handleNavigate('/games/lazland'); }} className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                GO
              </button>
            </div>
          </div>

          {/* Game Icons Carousel */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {[
              { icon: '🎯', name: 'Biggest Sa...', path: '/games/biggest-sale' },
              { icon: '🔀', name: 'MergeBoss', path: '/games/mergeboss' },
              { icon: '🎮', name: 'GoGoMatch', path: '/games/gogomatch' },
              { icon: '🎲', name: 'LazFun', path: '/games/lazfun' },
              { icon: '💎', name: 'Crack', path: '/games/crack' },
            ].map((game, i) => (
              <button 
                key={i}
                onClick={() => handleNavigate(game.path)}
                className="flex-shrink-0 text-center hover:opacity-80 transition-opacity"
              >
                <div className="text-4xl mb-1">{game.icon}</div>
                <p className="text-xs text-gray-700 whitespace-nowrap">{game.name}</p>
              </button>
            ))}
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg p-4 mt-4 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-sm font-bold text-gray-900">Play to get ₹20 LazRewards!</p>
            <button 
              onClick={() => handleNavigate('/rewards')}
              className="border-2 border-pink-500 text-pink-500 text-xs font-bold px-4 py-1.5 rounded hover:bg-pink-50 transition-colors"
            >
              Go
            </button>
          </div>
        </div>

        {/* My Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
            <Link href="/orders" className="flex items-center gap-1 text-gray-600">
              <span className="text-sm">View All Orders</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: '💳', label: 'To Pay', path: '/orders/to-pay' },
              { icon: '📦', label: 'To Ship', path: '/orders/to-ship' },
              { icon: '📥', label: 'To Receive', path: '/orders/to-receive' },
              { icon: '⭐', label: 'To Review', path: '/orders/to-review' },
              { icon: '🔄', label: 'Returns &\nCancellations', path: '/orders/returns' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <div className="bg-pink-100 p-3 rounded-lg text-center hover:bg-pink-200 transition-colors w-full">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="text-xs text-gray-700 text-center font-medium leading-tight">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* My Channels Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">My Channels</h2>
              <span className="text-sm text-gray-500">✏️ Edit</span>
            </div>
            <Link href="/channels" className="flex items-center gap-1 text-gray-600">
              <span className="text-sm">All Channels</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Channel Cards */}
          <div className="space-y-3">
            {/* PAYDAY Card */}
            <button 
              onClick={() => handleNavigate('/channels/payday')}
              className="w-full bg-gradient-to-br from-pink-300 to-pink-200 rounded-lg p-4 hover:shadow-lg transition-shadow text-left"
            >
              <p className="text-xs font-bold text-pink-700 mb-3 bg-pink-500 text-white w-fit px-3 py-1 rounded">PAYDAY</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">🎉</div>
                </div>
                <p className="text-xs text-gray-700">Deals & Promotions</p>
              </div>
            </button>

            {/* Deals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleNavigate('/channels/biggest-sale')}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow text-left"
              >
                <p className="text-xs font-bold text-gray-900 mb-2">Biggest Sa...</p>
                <p className="text-2xl font-bold text-pink-500">15%</p>
                <p className="text-xs text-pink-500 font-bold">OFF</p>
                <p className="text-xs text-gray-600 mt-2">Min. spend ₹1,299</p>
              </button>
              <button
                onClick={() => handleNavigate('/channels/lazflash')}
                className="bg-gradient-to-br from-purple-300 to-purple-200 rounded-lg p-4 hover:shadow-lg transition-shadow text-left"
              >
                <p className="text-xs font-bold text-gray-900 mb-2">LazFlash</p>
                <p className="text-sm font-bold text-gray-800">17:24:19</p>
                <p className="text-xs text-gray-700 mt-2">Flash Sale</p>
              </button>
            </div>
          </div>
        </div>

        {/* Lazada Wallet Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Lazada Wallet</h2>
            <span className="text-lg">👁️</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-600 mb-1">Lazada Wallet (₹)</p>
                <p className="text-2xl font-bold text-gray-900">0.00</p>
              </div>
              <button 
                onClick={() => handleNavigate('/wallet/activate')}
                className="text-pink-500 text-xs font-bold hover:text-pink-600 transition-colors"
              >
                Activate
              </button>
            </div>
            <div className="border-t pt-4 flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Options</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <button 
                onClick={() => handleNavigate('/wallet/options')}
                className="text-pink-500 text-xs font-bold hover:text-pink-600 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
            <Link href="/recent" className="flex items-center gap-1 text-gray-600">
              <span className="text-sm">View More</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {[
              { emoji: '🌿', price: '₹1,344.82', id: '1' },
              { emoji: '🌴', price: '₹94.31', id: '2' },
              { emoji: '🎋', price: '₹2,290.00', id: '3' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(`/product/${item.id}`)}
                className="flex-shrink-0 w-28 hover:opacity-80 transition-opacity"
              >
                <div className="bg-gray-300 rounded-lg aspect-square flex items-center justify-center text-4xl mb-2 hover:shadow-lg transition-shadow">{item.emoji}</div>
                <p className="text-pink-600 font-bold text-sm">{item.price}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Menu Grid */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { icon: Heart, label: 'WishList', path: '/wishlist' },
            { icon: MessageSquare, label: 'My Reviews', path: '/reviews' },
            { icon: Gift, label: 'Chat with\nCustomer Care', path: '/chat' },
            { icon: Zap, label: 'Bill Payment\n& Top Up', path: '/payment' },
            { icon: Gift, label: 'Followed\nStores', path: '/stores' },
            { icon: Gift, label: 'Memberships', path: '/memberships' },
            { icon: Gift, label: 'Open shop\non Lazada', path: '/shop' },
            { icon: Gift, label: 'Try & Buy', path: '/try-and-buy' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <button 
                key={i}
                onClick={() => handleNavigate(item.path)}
                className="flex flex-col items-center gap-2 p-2 hover:bg-pink-100 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-500 transition-colors hover:bg-pink-50">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <p className="text-xs text-gray-700 text-center leading-tight font-medium">{item.label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
