'use client'

import Link from 'next/link'
import { ChevronRight, Heart, MessageSquare, Gift, Zap, Settings, User } from 'lucide-react'
import Image from 'next/image'

function GameCard({ icon, title, action }: { icon: string; title: string; action?: string }) {
  return (
    <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-2xl p-4 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      {action && <button className="text-xs text-white bg-pink-500 px-3 py-1 rounded mt-2 font-bold">{action}</button>}
    </div>
  )
}

function OrderStatusButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-pink-100 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-pink-500" />
      </div>
      <p className="text-xs text-gray-700 text-center font-medium">{label}</p>
    </div>
  )
}

function MenuGridItem({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
      <p className="text-xs text-gray-700 text-center font-medium">{label}</p>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 pt-4 pb-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mohsen Alattas</h2>
            </div>
          </div>
          <Link href="/account/settings">
            <button className="p-2 rounded-full border-2 border-gray-300 hover:bg-gray-50">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
        </div>

        {/* Vouchers Banner */}
        <div className="bg-white rounded-lg p-3 flex items-center gap-3 shadow-sm">
          <div className="bg-pink-500 text-white rounded px-2 py-1 text-xs font-bold">✓</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-pink-500">52 vouchers | claim ₹1,000 vouc...</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-24">
        {/* My Games Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Games</h3>
            <Link href="/missions">
              <p className="text-sm text-gray-600 flex items-center gap-1">Mission Center <ChevronRight className="w-4 h-4" /></p>
            </Link>
          </div>

          {/* Featured Games */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-yellow-100 rounded-2xl p-4 relative overflow-hidden">
              <div className="text-3xl mb-2">🪙</div>
              <p className="text-sm font-bold text-gray-900">Coins</p>
              <p className="text-xs text-gray-700">250 Free Coins</p>
              <button className="mt-2 bg-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded">Collect</button>
            </div>
            <div className="bg-green-100 rounded-2xl p-4 relative overflow-hidden">
              <div className="text-3xl mb-2">🎁</div>
              <p className="text-sm font-bold text-gray-900">Lazland</p>
              <p className="text-xs text-gray-700">Get Free Prize!</p>
              <button className="mt-2 bg-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded">GO</button>
            </div>
          </div>

          {/* Game Icons */}
          <div className="flex gap-3 overflow-x-auto pb-3">
            {[
              { icon: '🎯', name: 'Biggest Sa...' },
              { icon: '🔀', name: 'MergeBoss' },
              { icon: '🎮', name: 'GoGoMatch' },
              { icon: '🎲', name: 'LazFun' },
              { icon: '💎', name: 'Crack' },
            ].map((game, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
                <div className="text-4xl">{game.icon}</div>
                <p className="text-xs text-gray-700 text-center whitespace-nowrap">{game.name}</p>
              </div>
            ))}
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 flex items-center justify-between mt-3">
            <p className="text-sm font-bold text-gray-900">Play to get ₹20 LazRewards!</p>
            <button className="border-2 border-pink-500 text-pink-500 text-xs font-bold px-4 py-1.5 rounded">Go</button>
          </div>
        </div>

        {/* My Orders Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Orders</h3>
            <Link href="/orders">
              <p className="text-sm text-gray-600 flex items-center gap-1">View All Orders <ChevronRight className="w-4 h-4" /></p>
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <OrderStatusButton icon={Zap} label="To Pay" />
            <OrderStatusButton icon={Gift} label="To Ship" />
            <OrderStatusButton icon={Gift} label="To Receive" />
            <OrderStatusButton icon={Gift} label="To Review" />
            <OrderStatusButton icon={Gift} label="Returns &" />
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">& Cancellations</p>
        </div>

        {/* My Channels Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">My Channels <span className="text-xs text-gray-500 font-normal">✏️ Edit</span></h3>
            <Link href="/channels">
              <p className="text-sm text-gray-600 flex items-center gap-1">All Channels <ChevronRight className="w-4 h-4" /></p>
            </Link>
          </div>

          <div className="space-y-2">
            <div className="bg-pink-200 rounded-lg p-3">
              <p className="text-xs font-bold text-pink-600 mb-2">PAYDAY</p>
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-xs text-gray-700">Deals & Promotions</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">Biggest Sa...</p>
                <p className="text-xl font-bold text-pink-500">15%OFF</p>
                <p className="text-xs text-gray-600 mt-1">Min. spend ₹1,299</p>
              </div>
              <div className="bg-purple-200 rounded-lg p-3 text-center">
                <p className="text-sm font-bold text-gray-900 mb-2">LazFlash</p>
                <div className="text-xs font-bold text-gray-700">17:24:19</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lazada Wallet Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900">Lazada Wallet</h3>
            <span className="text-lg">👁️</span>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Lazada Wallet (₹)</p>
                <p className="text-2xl font-bold text-gray-900">0.00</p>
              </div>
              <button className="text-pink-500 text-xs font-bold">Activate</button>
            </div>
            <div className="border-t pt-3 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-600">Payment Options</p>
                <p className="text-lg font-bold text-gray-900">2</p>
              </div>
              <button className="text-pink-500 text-xs font-bold">View</button>
            </div>
          </div>
        </div>

        {/* Recently Viewed Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
            <Link href="/recent">
              <p className="text-sm text-gray-600 flex items-center gap-1">View More <ChevronRight className="w-4 h-4" /></p>
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-3">
            {[
              { price: '₹1,344.82', emoji: '🌿' },
              { price: '₹94.31', emoji: '🌴' },
              { price: '₹2,290.00', emoji: '🎋' },
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-24">
                <div className="bg-gray-200 rounded-lg aspect-square flex items-center justify-center text-3xl mb-2">{item.emoji}</div>
                <p className="text-pink-500 font-bold text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Menu Grid */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <MenuGridItem icon={Heart} label="WishList" />
          <MenuGridItem icon={MessageSquare} label="My Reviews" />
          <MenuGridItem icon={Gift} label="Chat with Customer Care" />
          <MenuGridItem icon={Zap} label="Bill Payment & Top Up" />
          <MenuGridItem icon={Gift} label="Followed Stores" />
          <MenuGridItem icon={Gift} label="Memberships" />
          <MenuGridItem icon={Gift} label="Open shop on Lazada" />
          <MenuGridItem icon={Gift} label="Try & Buy" />
        </div>
      </div>
    </div>
  )
}
