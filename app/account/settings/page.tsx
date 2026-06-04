'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const menuItems = [
    { label: 'Account Information', href: '/account/settings/info' },
    { label: 'Payment Setting', href: '/account/settings/payment' },
    { label: 'Address Book', href: '/account/addresses' },
    { 
      label: 'Messages', 
      subtitle: 'Receive exclusive offers and personal updates',
      href: '/messages' 
    },
    { 
      label: 'Country', 
      subtitle: 'Thailand is your current country',
      hasFlag: true,
      href: '/account/settings/country' 
    },
    { 
      label: 'เปลี่ยนภาษา - Language', 
      subtitle: 'English',
      href: '/account/settings/language' 
    },
    { 
      label: 'Dark Mode', 
      href: '/account/settings/darkmode' 
    },
    { label: 'Account Security', href: '/account/settings/security' },
    { label: 'Policies', href: '/account/settings/policies' },
    { label: 'Help', href: '/account/settings/help' },
    { label: 'Feedback', href: '/account/settings/feedback' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={() => window.history.back()}
            className="p-1 -ml-1 mr-3 hover:bg-gray-100 rounded"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="h-[1px] bg-gray-200" />
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Menu Items */}
        <div className="bg-white">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="w-full flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Thailand Flag for Country item */}
              {item.hasFlag && (
                <div className="w-10 h-7 mr-3 relative overflow-hidden rounded-sm flex-shrink-0">
                  {/* Thai flag - red, white, blue stripes */}
                  <div className="absolute inset-0 flex flex-col">
                    <div className="flex-1 bg-red-600" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-[2] bg-blue-900" />
                    <div className="flex-1 bg-white" />
                    <div className="flex-1 bg-red-600" />
                  </div>
                </div>
              )}
              
              <div className="flex-1 text-left">
                <p className="text-base text-gray-900 font-medium">{item.label}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Logout Button */}
        <div className="bg-white mt-3">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full py-4 text-center text-[#f85c98] text-lg font-medium hover:bg-pink-50 transition-colors"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Bottom spacing */}
        <div className="h-20" />
      </main>
    </div>
  );
}
