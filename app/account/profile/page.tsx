'use client'

import { Eye, Heart, MessageCircle, CreditCard, Store, Star, DollarSign, Gift, Settings } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-2 border-yellow-300 flex items-center justify-center text-white font-bold">MA</div>
            <h2 className="font-bold text-gray-900 text-lg">Mohsen Alattas</h2>
          </div>
          <Link href="/account/settings">
            <Settings className="w-6 h-6 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* My Channels */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-4">My Channels</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" alt="Stay trendy" className="w-full aspect-square object-cover rounded-lg" />
              <p className="text-xs font-bold text-gray-900 text-center py-2">Stay trendy...</p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop" alt="Share Link" className="w-full aspect-square object-cover rounded-lg" />
              <p className="text-xs font-bold text-gray-900 text-center py-2">Share Link t...</p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596462502278-af407b1564f7?w=200&h=200&fit=crop" alt="LazBEAUT" className="w-full aspect-square object-cover rounded-lg" />
              <p className="text-xs font-bold text-gray-900 text-center py-2">LazBEAUT...</p>
            </div>
          </div>
          <button className="w-full text-center py-2 text-gray-700 font-bold text-sm hover:bg-gray-50 rounded">View more channels ∨</button>
        </div>

        {/* Lazada Wallet */}
        <div className="border-t pt-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            Lazada Wallet <Eye className="w-5 h-5" />
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-700 font-bold text-sm mb-1">Lazada</p>
                <p className="text-gray-500 text-xs mb-2">Wallet (฿)</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">0.00</p>
                <button className="text-blue-600 font-bold text-xs hover:underline">Activate</button>
              </div>
              <div className="text-center">
                <p className="text-gray-700 font-bold text-sm mb-1">Payment</p>
                <p className="text-gray-500 text-xs mb-2">Options</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">2</p>
                <button className="text-blue-600 font-bold text-xs hover:underline">View</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900">Recently Viewed</h3>
            <button className="text-gray-700 font-bold text-sm hover:underline">View More {'>'}</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1545241045-f4e1a81ddccf?w=150&h=150&fit=crop" alt="Plant 1" className="w-full aspect-square object-cover rounded-lg" />
              <p className="font-bold text-red-600 text-sm mt-2">฿1,344.82</p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&h=150&fit=crop" alt="Plant 2" className="w-full aspect-square object-cover rounded-lg" />
              <p className="font-bold text-red-600 text-sm mt-2">฿94.31</p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img src="https://images.unsplash.com/photo-1520763185298-1b434c919eba?w=150&h=150&fit=crop" alt="Plant 3" className="w-full aspect-square object-cover rounded-lg" />
              <p className="font-bold text-red-600 text-sm mt-2">฿2,290.00</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <Heart className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900">WishList</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <MessageCircle className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900">My Reviews</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <MessageCircle className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900 leading-tight">Chat with<br/>Customer Care</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <CreditCard className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900 leading-tight">Bill Payment<br/>& Top Up</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <Store className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900 leading-tight">Followed<br/>Stores</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <Star className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900">Memberships</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <DollarSign className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900 leading-tight">Open shop<br/>on Lazada</p>
            </button>
            <button className="flex flex-col items-center gap-2 hover:opacity-70">
              <Gift className="w-6 h-6 text-gray-700" strokeWidth={1.5} />
              <p className="text-xs font-bold text-gray-900">Try & Buy</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
