'use client'

import { ChevronRight, User, MapPin, ShoppingBag, Settings, LogOut, Bell } from 'lucide-react'
import Link from 'next/link'

const menuItems = [
  { icon: User, label: 'My Profile', href: '/account/profile' },
  { icon: MapPin, label: 'Addresses', href: '/account/addresses' },
  { icon: ShoppingBag, label: 'My Orders', href: '/account/orders' },
  { icon: Bell, label: 'Notifications', href: '/account/notifications' },
  { icon: Settings, label: 'Settings', href: '/account/settings' },
]

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-3xl">👤</div>
            <div>
              <h1 className="text-2xl font-bold">John Doe</h1>
              <p className="text-pink-100">Premium Member</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center"><p className="text-pink-100 text-sm">Total Orders</p><p className="text-3xl font-bold">24</p></div>
            <div className="text-center"><p className="text-pink-100 text-sm">Points</p><p className="text-3xl font-bold">1,250</p></div>
            <div className="text-center"><p className="text-pink-100 text-sm">Rewards</p><p className="text-3xl font-bold">฿450</p></div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="space-y-2">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link key={idx} href={item.href} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-pink-600" />
                  <span className="font-bold text-gray-900">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <button className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  )
}
