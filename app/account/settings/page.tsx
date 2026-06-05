'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Bell, Lock, HelpCircle, MessageSquare } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleNavigateBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { 
      label: 'Account Information', 
      href: '/account/settings/info',
      icon: null 
    },
    { 
      label: 'Payment Setting', 
      href: '/account/settings/payment',
      icon: null 
    },
    { 
      label: 'Address Book', 
      href: '/account/addresses',
      icon: null 
    },
    { 
      label: 'Messages', 
      subtitle: 'Receive exclusive offers and personal updates',
      href: '/messages',
      icon: null 
    },
    { 
      label: 'Country', 
      subtitle: 'Thailand is your current country',
      hasFlag: true,
      href: '/account/settings/country',
      icon: null 
    },
    { 
      label: 'เปลี่ยนภาษา - Language', 
      subtitle: 'English',
      href: '/account/settings/language',
      icon: null 
    },
    { 
      label: 'Dark Mode', 
      href: '/account/settings/darkmode',
      icon: null 
    },
    { 
      label: 'Account Security', 
      href: '/account/settings/security',
      icon: Lock 
    },
    { 
      label: 'Policies', 
      href: '/account/settings/policies',
      icon: null 
    },
    { 
      label: 'Help', 
      href: '/account/settings/help',
      icon: HelpCircle 
    },
    { 
      label: 'Feedback', 
      href: '/account/settings/feedback',
      icon: MessageSquare 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 border-b border-gray-100">
        <div className="flex items-center px-4 py-4 gap-3">
          <button 
            onClick={handleNavigateBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Menu Items */}
        <div className="bg-white mt-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center px-4 py-4 hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-50 last:border-b-0"
            >
              {/* Thailand Flag for Country item */}
              {item.hasFlag && (
                <div className="w-9 h-6 mr-3 relative overflow-hidden rounded flex-shrink-0 flex-col flex">
                  <div className="flex-1 bg-red-600" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-[1.4] bg-blue-900" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-red-600" />
                </div>
              )}
              
              {/* Icon if available */}
              {item.icon && !item.hasFlag && (
                <div className="w-9 h-9 mr-3 flex items-center justify-center flex-shrink-0 text-pink-600">
                  <item.icon className="w-5 h-5" />
                </div>
              )}
              
              <div className="flex-1 text-left">
                <p className="text-base text-gray-900 font-medium">{item.label}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500 mt-0.5">{item.subtitle}</p>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 ml-2" strokeWidth={2.5} />
            </Link>
          ))}
        </div>

        {/* Logout Button Section */}
        <div className="mt-6 px-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors active:bg-red-800 disabled:opacity-70"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        {/* Bottom spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
