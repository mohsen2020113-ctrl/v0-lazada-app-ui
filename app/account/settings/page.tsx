'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const settingsItems = [
    { label: 'Account Information' },
    { label: 'Payment Setting' },
    { label: 'Address Book' },
    { 
      label: 'Messages',
      description: 'Receive exclusive offers and personal updates',
      subsections: [
        { label: 'Country', value: 'Thailand is your current country', icon: '🇹🇭' },
        { label: 'เปลี่ยนภาษา - Language', value: 'English' },
      ]
    },
    { label: 'Dark Mode' },
    { label: 'Account Security' },
    { label: 'Policies' },
    { label: 'Help' },
    { label: 'Feedback' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white">
        {settingsItems.map((item, idx) => (
          <div key={idx}>
            <button className="w-full px-4 py-4 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0">
              <p className="font-bold text-gray-900">{item.label}</p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              )}
            </button>
            
            {/* Subsections */}
            {item.subsections && item.subsections.map((sub, subIdx) => (
              <div key={subIdx} className="px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {sub.icon && <span className="text-xl">{sub.icon}</span>}
                  <div>
                    <p className="font-bold text-gray-900">{sub.label}</p>
                    <p className="text-xs text-gray-500">{sub.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="px-4 py-8">
        {/* Logo Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">T</div>
        </div>

        {/* Logout Button */}
        <button className="w-full text-center py-3 text-red-600 font-bold text-xl hover:text-red-700 transition-colors mb-8">
          Logout
        </button>

        {/* Bottom Navigation Bar Placeholder */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 h-16 flex items-center justify-between px-4 rounded-t-2xl">
          <div className="text-white text-lg">⊡</div>
          <div className="text-white text-lg">↗</div>
          <div className="text-white text-lg">#</div>
          <div className="text-white text-lg">⚙</div>
          <div className="text-white text-lg">✕</div>
        </div>
      </div>
    </div>
  )
}
