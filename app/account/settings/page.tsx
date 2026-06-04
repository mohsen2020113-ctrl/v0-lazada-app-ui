'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Toggle2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const menuItems = [
    { label: 'Account Information', href: '/account/settings/info' },
    { label: 'Payment Setting', href: '/account/settings/payment' },
    { label: 'Address Book', href: '/account/addresses' },
    { 
      label: 'Messages', 
      subtitle: 'Receive exclusive offers and personal updates',
      hasToggle: true,
      toggleKey: 'notifications',
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
      hasToggle: true,
      toggleKey: 'darkMode',
      href: '/account/settings/darkmode' 
    },
    { label: 'Account Security', href: '/account/settings/security' },
    { label: 'Policies', href: '/account/settings/policies' },
    { label: 'Help', href: '/account/settings/help' },
    { label: 'Feedback', href: '/account/settings/feedback' },
  ];

  const handleLogout = () => {
    router.push('/');
  };

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotificationsEnabled(!notificationsEnabled);
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDarkModeEnabled(!darkModeEnabled);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50">
        <div className="flex items-center px-4 py-4">
          <button 
            onClick={() => router.back()}
            className="p-1 -ml-1 mr-3"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        </div>
        <div className="h-[1px] bg-gray-200" />
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Menu Items */}
        <div className="bg-white">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => !item.hasToggle && router.push(item.href)}
              className="w-full flex items-center px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {/* Thailand Flag for Country item */}
              {item.hasFlag && (
                <div className="w-10 h-7 mr-3 relative overflow-hidden rounded-sm">
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
                <p className="text-base text-gray-900">{item.label}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                )}
              </div>

              {item.hasToggle ? (
                <button
                  onClick={item.toggleKey === 'notifications' ? toggleNotifications : toggleDarkMode}
                  className={`ml-3 w-12 h-6 rounded-full transition-colors flex items-center ${
                    item.toggleKey === 'notifications' 
                      ? (notificationsEnabled ? 'bg-pink-500' : 'bg-gray-300')
                      : (darkModeEnabled ? 'bg-pink-500' : 'bg-gray-300')
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      item.toggleKey === 'notifications'
                        ? (notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5')
                        : (darkModeEnabled ? 'translate-x-6' : 'translate-x-0.5')
                    }`}
                  />
                </button>
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="bg-white mt-3">
          <button
            onClick={handleLogout}
            className="w-full py-4 text-center text-[#f85c98] text-lg font-medium hover:bg-pink-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="h-20" />
      </main>
    </div>
  );
}
