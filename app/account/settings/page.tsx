'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const sections = [
    'Account Information',
    'Payment Setting',
    'Address Book',
    'Messages',
    'Country',
    'ภาษา - Language',
    'Dark Mode',
    'Account Security',
    'Policies',
    'Help',
    'Feedback',
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-0 bg-white rounded-lg border border-gray-200 overflow-hidden">
          {sections.map((section, idx) => (
            <div key={idx}>
              <button className="w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
                <p className="font-bold text-gray-900">{section}</p>
              </button>
            </div>
          ))}
        </div>

        {/* Special Sections with Details */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Receive exclusive offers and personal updates</p>
          </div>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🇹🇭</span>
              <div>
                <p className="font-bold text-gray-900">Country</p>
                <p className="text-sm text-gray-600">Thailand is your current country</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            <p className="font-bold text-gray-900 mb-1">ภาษา - Language</p>
            <p className="text-sm text-gray-600">English</p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors">
            Log Out
          </button>
        </div>
      </div>
    </div>
  )
}
