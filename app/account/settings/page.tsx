'use client'

import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft className="w-6 h-6" /></Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Password */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Current Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
            </div>
          </div>
          <button className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors">Update Password</button>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={value} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="w-4 h-4 accent-pink-600" />
                <span className="font-bold text-gray-900 capitalize">{key} Notifications</span>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy & Security</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-pink-600" />
              <span className="font-bold text-gray-900">Make profile private</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-pink-600" />
              <span className="font-bold text-gray-900">Allow others to see my purchases</span>
            </label>
          </div>
          <button className="w-full mt-6 border border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
