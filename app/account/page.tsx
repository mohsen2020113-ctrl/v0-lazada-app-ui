import Link from 'next/link'
import { ChevronRight, Heart, MessageSquare, Gift, Zap, Settings } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-pink-50 pb-24">
      {/* Header with Profile */}
      <div className="bg-gradient-to-b from-pink-200 to-pink-100 px-4 pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mohsen Alattas</h1>
            </div>
          </div>
          <Link href="/account/settings">
            <button className="p-2 rounded-full border-2 border-gray-300 hover:bg-white/50">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </Link>
        </div>

        {/* Vouchers Banner */}
        <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-sm border border-pink-100">
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
            <div className="bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-2xl p-4">
              <div className="text-4xl mb-3">🪙</div>
              <h3 className="text-sm font-bold text-gray-900">Coins</h3>
              <p className="text-xs text-gray-700 mb-3">250 Free Coins</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                Collect
              </button>
            </div>

            {/* Lazland Card */}
            <div className="bg-gradient-to-br from-green-200 to-green-100 rounded-2xl p-4">
              <div className="text-4xl mb-3">🎁</div>
              <h3 className="text-sm font-bold text-gray-900">Lazland</h3>
              <p className="text-xs text-gray-700 mb-3">Get Free Prize!</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded transition-colors">
                GO
              </button>
            </div>
          </div>

          {/* Game Icons Carousel */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {[
              { icon: '🎯', name: 'Biggest Sa...' },
              { icon: '🔀', name: 'MergeBoss' },
              { icon: '🎮', name: 'GoGoMatch' },
              { icon: '🎲', name: 'LazFun' },
              { icon: '💎', name: 'Crack' },
            ].map((game, i) => (
              <div key={i} className="flex-shrink-0 text-center">
                <div className="text-4xl mb-1">{game.icon}</div>
                <p className="text-xs text-gray-700 whitespace-nowrap">{game.name}</p>
              </div>
            ))}
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg p-4 mt-4 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">Play to get ₹20 LazRewards!</p>
            <button className="border-2 border-pink-500 text-pink-500 text-xs font-bold px-4 py-1.5 rounded hover:bg-pink-50 transition-colors">
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
              { icon: '💳', label: 'To Pay' },
              { icon: '📦', label: 'To Ship' },
              { icon: '📥', label: 'To Receive' },
              { icon: '⭐', label: 'To Review' },
              { icon: '🔄', label: 'Returns &\nCancellations' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="bg-pink-100 p-3 rounded-lg text-center">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <p className="text-xs text-gray-700 text-center font-medium leading-tight">{item.label}</p>
              </div>
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
            <div className="bg-gradient-to-br from-pink-300 to-pink-200 rounded-lg p-4">
              <p className="text-xs font-bold text-pink-700 mb-3 bg-pink-500 text-white w-fit px-3 py-1 rounded">PAYDAY</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl mb-2">🎉</div>
                </div>
                <p className="text-xs text-gray-700">Deals & Promotions</p>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-bold text-gray-900 mb-2">Biggest Sa...</p>
                <p className="text-2xl font-bold text-pink-500">15%</p>
                <p className="text-xs text-pink-500 font-bold">OFF</p>
                <p className="text-xs text-gray-600 mt-2">Min. spend ₹1,299</p>
              </div>
              <div className="bg-gradient-to-br from-purple-300 to-purple-200 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-900 mb-2">LazFlash</p>
                <p className="text-sm font-bold text-gray-800">17:24:19</p>
                <p className="text-xs text-gray-700 mt-2">Flash Sale</p>
              </div>
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
              <button className="text-pink-500 text-xs font-bold hover:text-pink-600">Activate</button>
            </div>
            <div className="border-t pt-4 flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-600 mb-1">Payment Options</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <button className="text-pink-500 text-xs font-bold hover:text-pink-600">View</button>
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
              { emoji: '🌿', price: '₹1,344.82' },
              { emoji: '🌴', price: '₹94.31' },
              { emoji: '🎋', price: '₹2,290.00' },
            ].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-28">
                <div className="bg-gray-300 rounded-lg aspect-square flex items-center justify-center text-4xl mb-2">{item.emoji}</div>
                <p className="text-pink-600 font-bold text-sm">{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Menu Grid */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { icon: Heart, label: 'WishList' },
            { icon: MessageSquare, label: 'My Reviews' },
            { icon: Gift, label: 'Chat with\nCustomer Care' },
            { icon: Zap, label: 'Bill Payment\n& Top Up' },
            { icon: Gift, label: 'Followed\nStores' },
            { icon: Gift, label: 'Memberships' },
            { icon: Gift, label: 'Open shop\non Lazada' },
            { icon: Gift, label: 'Try & Buy' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <button key={i} className="flex flex-col items-center gap-2 p-2 hover:bg-pink-100 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-pink-500 transition-colors">
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
