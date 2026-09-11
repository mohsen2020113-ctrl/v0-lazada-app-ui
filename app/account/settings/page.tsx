'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Dark Header */}
      <div className="sticky top-0 z-40 bg-gray-900 text-white px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/account/profile">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="bg-white">
        {/* Account Information */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Account Information</p>
        </button>

        {/* Payment Setting */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Payment Setting</p>
        </button>

        {/* Address Book */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Address Book</p>
        </button>

        {/* Messages Section */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Messages</p>
          <p className="text-sm text-gray-600 mt-1">Receive exclusive offers and personal updates</p>
        </button>

        {/* Country Subsection */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
          <span className="text-3xl">🇹🇭</span>
          <div>
            <p className="font-bold text-lg text-gray-900">Country</p>
            <p className="text-sm text-gray-600">Thailand is your current country</p>
          </div>
        </div>

        {/* Language Subsection */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">เปลี่ยนภาษา - Language</p>
          <p className="text-sm text-gray-600 mt-1">English</p>
        </button>

        {/* Dark Mode */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Dark Mode</p>
        </button>

        {/* Account Security */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Account Security</p>
        </button>

        {/* Policies */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Policies</p>
        </button>

        {/* Help */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Help</p>
        </button>

        {/* Feedback */}
        <button className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 active:bg-gray-100">
          <p className="font-bold text-lg text-gray-900">Feedback</p>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-12 text-center">
        {/* Logo Circle */}
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">T</div>

        {/* Logout Button */}
        <button className="text-red-600 font-bold text-2xl hover:text-red-700 mb-12">
          Logout
        </button>
      </div>

      {/* Bottom Navigation Bar - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-700 h-16 flex items-center justify-around">
        <button className="text-blue-400 text-xl">⊡</button>
        <button className="text-white text-xl">↗</button>
        <button className="text-white text-xl">#</button>
        <button className="text-white text-xl">📝</button>
        <button className="text-white text-xl">✕</button>
      </div>
    </div>
  )
}
