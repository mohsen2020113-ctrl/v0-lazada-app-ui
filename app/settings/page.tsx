'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, User, Lock, Link2, Bell, BellOff, Zap, Package, Tag, Globe, DollarSign, Moon, MapPin, BarChart3, Info, FileText, Shield, Star, LogOut } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    orders: true,
    promos: true,
    flashSales: false,
    system: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [dataUsage, setDataUsage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const SettingRow = ({ icon: Icon, title, subtitle, onClick, rightElement }: {
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    onClick?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 text-left">
        <p className="font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      {rightElement || <ChevronRight className="w-5 h-5 text-gray-400" />}
    </button>
  );

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      className={`w-12 h-7 rounded-full p-1 transition-all ${
        enabled ? 'bg-[#E31C79]' : 'bg-gray-300'
      }`}
    >
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
      </div>

      {/* Account Section */}
      <div className="mt-3">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Account</p>
        <div className="bg-white">
          <SettingRow
            icon={User}
            title="Edit Profile"
            subtitle="Name, email, phone"
            onClick={() => router.push('/account/edit')}
          />
          <SettingRow
            icon={Lock}
            title="Change Password"
            subtitle="Update your password"
            onClick={() => {}}
          />
          <SettingRow
            icon={Link2}
            title="Linked Accounts"
            subtitle="Google, Facebook, Apple"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Notifications Section */}
      <div className="mt-3">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Notifications</p>
        <div className="bg-white">
          <SettingRow
            icon={Package}
            title="Order Updates"
            subtitle="Shipping and delivery alerts"
            rightElement={
              <Toggle
                enabled={notifications.orders}
                onChange={() => setNotifications(prev => ({ ...prev, orders: !prev.orders }))}
              />
            }
          />
          <SettingRow
            icon={Tag}
            title="Promotions"
            subtitle="Deals, discounts and offers"
            rightElement={
              <Toggle
                enabled={notifications.promos}
                onChange={() => setNotifications(prev => ({ ...prev, promos: !prev.promos }))}
              />
            }
          />
          <SettingRow
            icon={Zap}
            title="Flash Sales"
            subtitle="Limited time deals"
            rightElement={
              <Toggle
                enabled={notifications.flashSales}
                onChange={() => setNotifications(prev => ({ ...prev, flashSales: !prev.flashSales }))}
              />
            }
          />
          <SettingRow
            icon={Bell}
            title="System Alerts"
            subtitle="Security and account updates"
            rightElement={
              <Toggle
                enabled={notifications.system}
                onChange={() => setNotifications(prev => ({ ...prev, system: !prev.system }))}
              />
            }
          />
        </div>
      </div>

      {/* App Section */}
      <div className="mt-3">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">App Settings</p>
        <div className="bg-white">
          <SettingRow
            icon={Globe}
            title="Language"
            subtitle={selectedLanguage.name}
            onClick={() => setShowLanguagePicker(true)}
            rightElement={
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedLanguage.flag}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            }
          />
          <SettingRow
            icon={DollarSign}
            title="Currency"
            subtitle={`${selectedCurrency.code} (${selectedCurrency.symbol})`}
            onClick={() => setShowCurrencyPicker(true)}
          />
          <SettingRow
            icon={Moon}
            title="Dark Mode"
            subtitle="Reduce eye strain at night"
            rightElement={
              <Toggle
                enabled={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            }
          />
        </div>
      </div>

      {/* Privacy Section */}
      <div className="mt-3">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Privacy</p>
        <div className="bg-white">
          <SettingRow
            icon={MapPin}
            title="Location Services"
            subtitle="Allow location access"
            rightElement={
              <Toggle
                enabled={locationEnabled}
                onChange={() => setLocationEnabled(!locationEnabled)}
              />
            }
          />
          <SettingRow
            icon={BarChart3}
            title="Data Usage"
            subtitle="Share usage data to improve app"
            rightElement={
              <Toggle
                enabled={dataUsage}
                onChange={() => setDataUsage(!dataUsage)}
              />
            }
          />
        </div>
      </div>

      {/* About Section */}
      <div className="mt-3">
        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">About</p>
        <div className="bg-white">
          <SettingRow
            icon={Info}
            title="App Version"
            subtitle="v2.5.1 (Build 2026.05.04)"
            rightElement={<span className="text-sm text-green-600 font-medium">Up to date</span>}
          />
          <SettingRow
            icon={FileText}
            title="Terms of Service"
            onClick={() => {}}
          />
          <SettingRow
            icon={Shield}
            title="Privacy Policy"
            onClick={() => {}}
          />
          <SettingRow
            icon={Star}
            title="Rate App"
            subtitle="Love LEE? Leave a review!"
            onClick={() => {}}
          />
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-6 px-4">
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-4 rounded-xl font-semibold hover:bg-red-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* Language Picker Modal */}
      {showLanguagePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowLanguagePicker(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Select Language</h3>
              <button onClick={() => setShowLanguagePicker(false)} className="text-gray-500">Done</button>
            </div>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setSelectedLanguage(lang); setShowLanguagePicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                    selectedLanguage.code === lang.code ? 'bg-[#E31C79]/10 border-2 border-[#E31C79]' : 'bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {selectedLanguage.code === lang.code && (
                    <div className="ml-auto w-5 h-5 bg-[#E31C79] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Currency Picker Modal */}
      {showCurrencyPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowCurrencyPicker(false)}>
          <div className="w-full bg-white rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Select Currency</h3>
              <button onClick={() => setShowCurrencyPicker(false)} className="text-gray-500">Done</button>
            </div>
            <div className="space-y-2">
              {currencies.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => { setSelectedCurrency(curr); setShowCurrencyPicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl ${
                    selectedCurrency.code === curr.code ? 'bg-[#E31C79]/10 border-2 border-[#E31C79]' : 'bg-gray-50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                    {curr.symbol}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{curr.code}</p>
                    <p className="text-sm text-gray-500">{curr.name}</p>
                  </div>
                  {selectedCurrency.code === curr.code && (
                    <div className="ml-auto w-5 h-5 bg-[#E31C79] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
