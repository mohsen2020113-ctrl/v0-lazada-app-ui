'use client'

import { ChevronLeft, Eye, EyeOff, ChevronDown, Globe, Moon, Lock, FileText, HelpCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [expandedSections, setExpandedSections] = useState({ account: true, privacy: false })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const SettingSection = ({ title, icon: Icon, id, children }: any) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <button
        onClick={() => toggleSection(id)}
        className="w-full bg-white hover:bg-gray-50 px-6 py-4 flex items-center justify-between transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-pink-600" />
          <span className="font-bold text-gray-900">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections[id] ? 'rotate-180' : ''}`} />
      </button>
      {expandedSections[id] && <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">{children}</div>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/account" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Account Information */}
        <SettingSection title="Account Information" icon={Lock} id="account">
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
            </div>
          </div>
          <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors">Update Password</button>
        </SettingSection>

        {/* Payment Setting */}
        <SettingSection title="Payment Setting" icon={Lock} id="payment">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
              <span className="font-bold text-gray-900">Payment Methods</span>
              <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
              <span className="font-bold text-gray-900">Linked Cards</span>
              <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </div>
        </SettingSection>

        {/* Address Book */}
        <SettingSection title="Address Book" icon={Lock} id="address">
          <Link href="/account/addresses" className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:bg-gray-50">
            <span className="font-bold text-gray-900">Manage Your Addresses</span>
            <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </Link>
        </SettingSection>

        {/* Messages & Notifications */}
        <SettingSection title="Messages" icon={MessageSquare} id="messages">
          <div className="space-y-4 mb-4">
            <p className="text-sm text-gray-600">Receive exclusive offers and personal updates</p>
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                  className="w-4 h-4 accent-pink-600"
                />
                <span className="font-bold text-gray-900 capitalize">{key} Notifications</span>
              </label>
            ))}
          </div>
        </SettingSection>

        {/* Country & Language */}
        <SettingSection title="Country & Language" icon={Globe} id="locale">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇹🇭</span>
                <div>
                  <p className="font-bold text-gray-900">Country</p>
                  <p className="text-sm text-gray-600">Thailand is your current country</p>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
              <div>
                <p className="font-bold text-gray-900">ภาษา - Language</p>
                <p className="text-sm text-gray-600">English</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </div>
        </SettingSection>

        {/* Dark Mode */}
        <SettingSection title="Dark Mode" icon={Moon} id="darkmode">
          <div className="flex items-center gap-3">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-pink-600" />
              <span className="ml-2 font-bold text-gray-900">Enable Dark Mode</span>
            </label>
          </div>
        </SettingSection>

        {/* Account Security */}
        <SettingSection title="Account Security" icon={Lock} id="security">
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-pink-600" />
              <span className="font-bold text-gray-900">Two-Factor Authentication</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-pink-600" />
              <span className="font-bold text-gray-900">Make profile private</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-pink-600" />
              <span className="font-bold text-gray-900">Allow others to see my purchases</span>
            </label>
          </div>
        </SettingSection>

        {/* Policies */}
        <SettingSection title="Policies" icon={FileText} id="policies">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">Privacy Policy</button>
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">Terms of Service</button>
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">Return & Refund Policy</button>
          </div>
        </SettingSection>

        {/* Help */}
        <SettingSection title="Help" icon={HelpCircle} id="help">
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">FAQ</button>
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">Contact Support</button>
            <button className="w-full text-left px-4 py-2 text-pink-600 font-bold hover:bg-gray-100 rounded">Report a Problem</button>
          </div>
        </SettingSection>

        {/* Feedback */}
        <SettingSection title="Feedback" icon={MessageSquare} id="feedback">
          <div className="space-y-3">
            <textarea placeholder="Tell us what you think..." rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600" />
            <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-bold hover:bg-pink-700 transition-colors">Send Feedback</button>
          </div>
        </SettingSection>

        {/* Logout & Delete Account */}
        <div className="flex gap-4 mt-8">
          <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">Log Out</button>
          <button className="flex-1 border border-red-600 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition-colors">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
