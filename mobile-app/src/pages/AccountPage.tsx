import { ChevronRight, Package, Heart, Bell, Wallet, Tag, Settings, LogOut, LogIn, Star, Shield, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { PageId, NavigationParams } from '../App';

interface Props {
  navigate: (page: PageId, params?: NavigationParams) => void;
  params: NavigationParams;
}

export default function AccountPage({ navigate }: Props) {
  const { customer, logout } = useAuth();

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track your orders', page: 'orders' as PageId, color: 'text-blue-500 bg-blue-50' },
    { icon: Heart, label: 'Wishlist', desc: 'Saved products', page: 'wishlist' as PageId, color: 'text-pink-500 bg-pink-50' },
    { icon: Wallet, label: 'Wallet', desc: 'Balance & transactions', page: 'wallet' as PageId, color: 'text-green-500 bg-green-50' },
    { icon: Tag, label: 'Vouchers', desc: 'Coupons & discounts', page: 'vouchers' as PageId, color: 'text-purple-500 bg-purple-50' },
    { icon: Bell, label: 'Notifications', desc: 'Manage alerts', page: 'notifications' as PageId, color: 'text-orange-500 bg-orange-50' },
  ];

  const supportItems = [
    { icon: Star, label: 'Rate the App', desc: 'Share your feedback' },
    { icon: Shield, label: 'Privacy Policy', desc: 'How we use your data' },
    { icon: HelpCircle, label: 'Help Center', desc: 'FAQ & support' },
    { icon: Settings, label: 'Settings', desc: 'App preferences' },
  ];

  return (
    <div className="bg-gray-50 min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-500 to-orange-400 px-4 pt-12 pb-20">
        <h1 className="text-white text-xl font-bold">Account</h1>
      </div>

      {/* Profile card */}
      <div className="mx-4 -mt-12 card p-4 flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-none">
          {customer ? customer.firstName?.[0]?.toUpperCase() ?? '\u{1F464}' : '\u{1F464}'}
        </div>
        <div className="flex-1 min-w-0">
          {customer ? (
            <>
              <h2 className="font-bold text-gray-900 text-lg">{customer.firstName} {customer.lastName}</h2>
              <p className="text-sm text-gray-500 truncate">{customer.email}</p>
              <p className="text-xs text-orange-500 font-medium mt-0.5">LEE Member</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-gray-900">Guest User</h2>
              <p className="text-sm text-gray-500">Sign in to unlock all features</p>
            </>
          )}
        </div>
        {!customer && (
          <button onClick={() => navigate('login')} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
            <LogIn size={14} /> Sign In
          </button>
        )}
      </div>

      {/* Stats */}
      {customer && (
        <div className="mx-4 grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Orders', value: '0' },
            { label: 'Reviews', value: '0' },
            { label: 'Points', value: '0' },
          ].map(({ label, value }) => (
            <div key={label} className="card p-3 text-center">
              <p className="text-xl font-bold text-orange-500">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Menu */}
      <div className="mx-4 card mb-4 divide-y divide-gray-50">
        {menuItems.map(({ icon: Icon, label, desc, page, color }) => (
          <button key={page} onClick={() => navigate(page)} className="w-full flex items-center gap-3 p-4 active:bg-gray-50 transition-colors">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-none`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Support */}
      <div className="mx-4 card mb-4 divide-y divide-gray-50">
        {supportItems.map(({ icon: Icon, label, desc }) => (
          <button key={label} className="w-full flex items-center gap-3 p-4 active:bg-gray-50 transition-colors">
            <div className="w-10 h-10 text-gray-400 bg-gray-50 rounded-xl flex items-center justify-center flex-none">
              <Icon size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      {customer && (
        <div className="mx-4 mb-6">
          <button onClick={logout} className="w-full py-3.5 border border-red-200 rounded-xl text-red-500 font-medium text-sm flex items-center justify-center gap-2 active:bg-red-50">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-300 pb-6">LEE v1.0.0</p>
    </div>
  );
      }
