'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useCallback } from 'react'
import { ChevronRight, Heart, MessageSquare, Gift, Zap, Settings, Bell, Lock, HelpCircle, ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const router = useRouter()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const handleNavigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-24">
      {/* Header with Profile */}
      <div className="bg-gradient-to-b from-pink-100 to-pink-50 px-4 pt-4 pb-6 border-b border-pink-200">
        <div className="flex items-center justify-between mb-6">
          <Link href="/account/profile" className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-full border-4 border-pink-300 bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mohsen Alattas</h1>
              <p className="text-sm text-gray-600">Premium Member</p>
            </div>
          </Link>
          <Link href="/account/settings">
            <button className="p-2 rounded-full border-2 border-pink-300 hover:bg-white/60 transition-colors hover:shadow-md">
              <Settings className="w-5 h-5 text-pink-600" />
            </button>
          </Link>
        </div>

        {/* Vouchers Banner */}
        <div onClick={() => handleNavigate('/vouchers')} className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm border border-pink-200 cursor-pointer hover:shadow-md hover:border-pink-300 transition-all">
          <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0">✓</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-pink-600">52 vouchers | claim AED 1,000</p>
            <p className="text-xs text-gray-500">Click to view and claim</p>
          </div>
          <ChevronRight className="w-5 h-5 text-pink-500 flex-shrink-0" />
        </div>
      </div>

      <div className="px-4 space-y-6 mt-6">
        {/* My Games Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">🎮 My Games</h2>
            <Link href="/account/missions" className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium">
              <span>Mission Center</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Games - 2 Column */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Coins Card */}
            <button onClick={() => handleNavigate('/account/games/coins')} className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-2xl p-4 hover:shadow-lg transition-shadow text-left border border-yellow-300">
              <div className="text-4xl mb-3">🪙</div>
              <h3 className="text-sm font-bold text-gray-900">Free Coins</h3>
              <p className="text-xs text-gray-700 mb-3 font-medium">250 Coins Available</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">Collect</button>
            </button>

            {/* Prize Card */}
            <button onClick={() => handleNavigate('/account/games/prizes')} className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-2xl p-4 hover:shadow-lg transition-shadow text-left border border-purple-300">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-sm font-bold text-gray-900">Free Prize</h3>
              <p className="text-xs text-gray-700 mb-3 font-medium">Daily Reward</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">GO</button>
            </button>
          </div>

          {/* Game Icons Carousel */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth">
            {[
              { icon: '🎯', name: 'MergeBoss', path: '/account/games/mergeboss' },
              { icon: '🎮', name: 'GoGoMatch', path: '/account/games/gogomatch' },
              { icon: '🎲', name: 'LazFun', path: '/account/games/lazfun' },
              { icon: '💎', name: 'Crack It', path: '/account/games/crack' },
              { icon: '🎰', name: 'LazSlot', path: '/account/games/slot' },
              { icon: '🏆', name: 'LazWin', path: '/account/games/win' },
            ].map((game) => (
              <button key={game.path} onClick={() => handleNavigate(game.path)} className="flex-shrink-0 text-center hover:opacity-80 transition-opacity">
                <div className="text-4xl mb-2 transform hover:scale-110 transition-transform">{game.icon}</div>
                <p className="text-xs text-gray-700 whitespace-nowrap font-medium">{game.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* My Orders Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">📦 My Orders</h2>
            <Link href="/account/orders" className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: '💳', label: 'To Pay', path: '/account/orders?status=to-pay', count: 2 },
              { icon: '📦', label: 'To Ship', path: '/account/orders?status=to-ship', count: 0 },
              { icon: '📥', label: 'To Receive', path: '/account/orders?status=to-receive', count: 1 },
              { icon: '⭐', label: 'To Review', path: '/account/orders?status=to-review', count: 3 },
              { icon: '🔄', label: 'Returns', path: '/account/orders?status=returns', count: 0 },
            ].map((item) => (
              <button key={item.path} onClick={() => handleNavigate(item.path)} className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
                <div className="bg-pink-100 p-3 rounded-lg text-center hover:bg-pink-200 transition-colors w-full relative">
                  <span className="text-xl block">{item.icon}</span>
                  {item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{item.count}</span>
                  )}
                </div>
                <p className="text-xs text-gray-700 text-center font-medium leading-tight">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Wishlist & Reviews */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => handleNavigate('/account/wishlist')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
            <div className="text-3xl mb-2">❤️</div>
            <p className="text-sm font-bold text-gray-900">Wishlist</p>
            <p className="text-xs text-gray-600">24 items saved</p>
          </button>
          <button onClick={() => handleNavigate('/account/reviews')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-center">
            <div className="text-3xl mb-2">⭐</div>
            <p className="text-sm font-bold text-gray-900">My Reviews</p>
            <p className="text-xs text-gray-600">12 reviews written</p>
          </button>
        </div>

        {/* 4LEEE Wallet Section */}
        <div className="bg-white border-2 border-pink-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">💳 4LEEE Wallet</h3>
            <Eye className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-600 mb-1">Balance (AED)</p>
                <p className="text-2xl font-bold text-pink-600">0.00</p>
              </div>
              <button onClick={() => handleNavigate('/account/wallet/activate')} className="text-pink-600 text-xs font-bold hover:text-pink-700 transition-colors bg-pink-50 px-3 py-1.5 rounded hover:bg-pink-100">
                Activate
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Methods</p>
                <p className="text-xl font-bold text-gray-900">2 Added</p>
              </div>
              <button onClick={() => handleNavigate('/account/payment-methods')} className="text-pink-600 text-xs font-bold hover:text-pink-700 transition-colors bg-pink-50 px-3 py-1.5 rounded hover:bg-pink-100">
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Recently Viewed Products */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">👀 Recently Viewed</h2>
            <Link href="/account/recent" className="flex items-center gap-1 text-pink-600 hover:text-pink-700 text-sm font-medium">
              <span>View More</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🌿', price: 'AED 1,344', sold: '156 sold' },
              { emoji: '🌴', price: 'AED 94', sold: '892 sold' },
              { emoji: '🎋', price: 'AED 2,290', sold: '34 sold' },
            ].map((item, i) => (
              <button key={i} onClick={() => handleNavigate(`/product/${i}`)} className="hover:opacity-80 transition-opacity">
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center text-3xl mb-2 hover:shadow-md transition-shadow">{item.emoji}</div>
                <p className="text-pink-600 font-bold text-sm">{item.price}</p>
                <p className="text-xs text-gray-500">{item.sold}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">📱 Services</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleNavigate('/account/addresses')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">📍</div>
              <p className="text-sm font-bold text-gray-900">Addresses</p>
              <p className="text-xs text-gray-600">Manage delivery addresses</p>
            </button>
            <button onClick={() => handleNavigate('/account/payment-methods')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-sm font-bold text-gray-900">Payment Methods</p>
              <p className="text-xs text-gray-600">Add or remove cards</p>
            </button>
            <button onClick={() => handleNavigate('/account/notifications')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">🔔</div>
              <p className="text-sm font-bold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-600">{notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
            </button>
            <button onClick={() => handleNavigate('/account/chat')} className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-sm font-bold text-gray-900">Customer Care</p>
              <p className="text-xs text-gray-600">Chat with support team</p>
            </button>
          </div>
        </div>

        {/* Quick Links Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">🔗 Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏪', label: 'Followed Stores', path: '/account/followed-stores' },
              { icon: '👑', label: 'Memberships', path: '/account/memberships' },
              { icon: '🛍️', label: 'Open Your Shop', path: '/account/vendor-registration' },
              { icon: '🧪', label: 'Try & Buy', path: '/account/try-and-buy' },
            ].map((item) => (
              <button key={item.path} onClick={() => handleNavigate(item.path)} className="bg-white border-2 border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-pink-200 transition-all text-left">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="text-xs font-bold text-gray-900">{item.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Help & Settings */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">❓ Help & Settings</h2>
          <div className="space-y-2">
            <button onClick={() => handleNavigate('/account/help')} className="w-full flex items-center gap-3 p-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Help Center</p>
                <p className="text-xs text-gray-600">FAQs, guides & support</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button onClick={() => handleNavigate('/account/settings')} className="w-full flex items-center gap-3 p-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
              <Settings className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Account Settings</p>
                <p className="text-xs text-gray-600">Profile, privacy & security</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
            <button onClick={() => handleNavigate('/account/privacy')} className="w-full flex items-center gap-3 p-3 hover:bg-pink-50 rounded-lg transition-colors text-left">
              <Lock className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-bold text-gray-900">Privacy & Security</p>
                <p className="text-xs text-gray-600">Manage your data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div className="flex gap-3 mt-8">
          <button onClick={() => handleNavigate('/account/feedback')} className="flex-1 bg-white border-2 border-pink-200 text-pink-600 font-bold py-3 rounded-lg hover:shadow-md transition-shadow">
            📝 Send Feedback
          </button>
          <button onClick={() => { localStorage.removeItem('lee_session'); router.push('/login'); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

// Import missing icon
function Eye({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

