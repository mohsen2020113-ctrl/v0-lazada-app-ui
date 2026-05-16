'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { useUser } from '@/app/contexts/user-context';
import { useRouter } from 'next/navigation';
import { ChevronRight, Settings, Wallet, Gift, Gamepad2, ShoppingBag, Truck, Package, Star, RotateCcw, Heart, MessageSquare, Headphones, CreditCard, Store, Award, Bell, MapPin, LogOut, Crown, Coins, Ticket, Eye, EyeOff, ChevronDown, Zap } from 'lucide-react';
import Image from 'next/image';

const orderStatuses = [
  { label: 'To Pay', icon: Wallet, count: 2, color: 'text-[#f85c98]', bg: 'bg-pink-50' },
  { label: 'To Ship', icon: Package, count: 1, color: 'text-[#f85c98]', bg: 'bg-pink-50' },
  { label: 'To Receive', icon: Truck, count: 3, color: 'text-[#f85c98]', bg: 'bg-pink-50' },
  { label: 'To Review', icon: Star, count: 5, color: 'text-[#f85c98]', bg: 'bg-pink-50' },
  { label: 'Returns', icon: RotateCcw, count: 0, color: 'text-[#f85c98]', bg: 'bg-pink-50' },
];

const menuItems = [
  { label: 'My Orders', icon: ShoppingBag, href: '/account/orders', badge: 11 },
  { label: 'Wishlist', icon: Heart, href: '/account/wishlist', badge: 24 },
  { label: 'Recently Viewed', icon: Eye, href: '/account/recent' },
  { label: 'My Addresses', icon: MapPin, href: '/account/addresses' },
  { label: 'Payment Methods', icon: CreditCard, href: '/account/payment' },
  { label: 'Followed Stores', icon: Store, href: '/account/stores', badge: 8 },
  { label: 'My Reviews', icon: MessageSquare, href: '/account/reviews' },
  { label: 'Notifications', icon: Bell, href: '/account/notifications', badge: 5 },
  { label: 'Help Center', icon: Headphones, href: '/help' },
  { label: 'Settings', icon: Settings, href: '/account/settings' },
];

const recentOrders = [
  { id: 'ORD001', status: 'Shipped', date: '2 days ago', items: 2, total: 1259, image: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=100&h=100&fit=crop' },
  { id: 'ORD002', status: 'Delivered', date: '1 week ago', items: 1, total: 890, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop' },
];

const recentlyViewed = [
  { id: '1', price: 1344.82, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=150&h=150&fit=crop' },
  { id: '2', price: 94.31, image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=150&h=150&fit=crop' },
  { id: '3', price: 2290.00, image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=150&h=150&fit=crop' },
  { id: '4', price: 459.00, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=150&h=150&fit=crop' },
];

export default function AccountPage() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [coins, setCoins] = useState(2580);
  const [vouchers, setVouchers] = useState(52);

  // Auto login if not logged in
  useEffect(() => {
    if (!user) {
      setUser({
        id: '1',
        name: 'Mohsen Alattas',
        email: 'mohsen@example.com',
        phone: '+66812345678',
        accountLevel: 'gold',
        joinDate: '2023-01-15',
      });
    }
  }, [user, setUser]);

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  const memberTier = user?.accountLevel || 'gold';
  const tierColors = {
    silver: 'from-gray-400 to-gray-500',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600',
  };

  return (
    <div className="min-h-screen min-h-dvh bg-gray-100 flex flex-col max-w-[430px] mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[#f85c98] via-[#ec407a] to-[#d81b60] pt-12 pb-6 px-4">
        {/* Settings Button */}
        <button 
          onClick={() => router.push('/account/settings')}
          className="absolute top-3 right-3 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>

        {/* Profile Info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=200&fit=crop&crop=face"
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Member Badge */}
            <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${tierColors[memberTier as keyof typeof tierColors]} flex items-center justify-center shadow-lg`}>
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1 text-white">
            <h1 className="text-xl font-bold">{user?.name || 'Guest'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${tierColors[memberTier as keyof typeof tierColors]} text-white uppercase`}>
                {memberTier} Member
              </span>
            </div>
            <p className="text-white/80 text-sm mt-1">Member since Jan 2023</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <button className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Coins className="w-4 h-4 text-yellow-300" />
              <span className="text-white font-bold">{coins.toLocaleString()}</span>
            </div>
            <p className="text-white/70 text-xs mt-0.5">Coins</p>
          </button>
          <button className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Ticket className="w-4 h-4 text-green-300" />
              <span className="text-white font-bold">{vouchers}</span>
            </div>
            <p className="text-white/70 text-xs mt-0.5">Vouchers</p>
          </button>
          <button className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Gift className="w-4 h-4 text-pink-200" />
              <span className="text-white font-bold">3</span>
            </div>
            <p className="text-white/70 text-xs mt-0.5">Rewards</p>
          </button>
        </div>
      </div>

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar -mt-4">
        {/* LEE Premium Banner */}
        <div className="mx-3 mb-3">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 text-white">
              <p className="font-bold">LEE Premium</p>
              <p className="text-sm text-gray-300">Upgrade for exclusive benefits & rewards</p>
            </div>
            <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors">
              Join
            </button>
          </div>
        </div>

        {/* My Orders Section */}
        <div className="bg-white mx-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">My Orders</h2>
            <button 
              onClick={() => router.push('/account/orders')}
              className="flex items-center text-sm text-[#f85c98] font-medium"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Order Status Icons */}
          <div className="flex justify-between mb-4">
            {orderStatuses.map((status, index) => {
              const Icon = status.icon;
              return (
                <button key={index} className="flex flex-col items-center gap-1.5 flex-1 relative">
                  <div className={`w-12 h-12 ${status.bg} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${status.color}`} />
                  </div>
                  {status.count > 0 && (
                    <span className="absolute -top-1 right-1/4 bg-[#f85c98] text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                      {status.count}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-600 text-center leading-tight">
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recent Orders Preview */}
          <div className="border-t pt-4 space-y-3">
            {recentOrders.map((order) => (
              <button
                key={order.id}
                onClick={() => router.push(`/account/orders/${order.id}`)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                  <Image src={order.image} alt="Order" width={56} height={56} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{order.items} items - {order.date}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${order.status === 'Shipped' ? 'text-blue-600' : 'text-green-600'}`}>
                    {order.status}
                  </p>
                  <p className="text-sm font-bold text-gray-900">AED {order.total.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* LEE Wallet */}
        <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[#f85c98]" />
              <h2 className="font-bold text-gray-900">LEE Wallet</h2>
            </div>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye className="w-5 h-5 text-gray-400" /> : <EyeOff className="w-5 h-5 text-gray-400" />}
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 bg-gradient-to-br from-[#f85c98] to-[#ec407a] rounded-xl p-4 text-white">
              <p className="text-sm text-white/80">Balance</p>
              <p className="text-2xl font-bold mt-1">
                {showBalance ? 'AED 1,250.00' : 'AED •••••'}
              </p>
              <button className="mt-3 bg-white text-[#f85c98] px-4 py-1.5 rounded-full text-sm font-bold">
                Top Up
              </button>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">Payment Methods</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
              <button className="mt-3 border border-gray-300 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
                Manage
              </button>
            </div>
          </div>
        </div>

        {/* Flash Sale Promo */}
        <button
          onClick={() => router.push('/flash-sale')}
          className="mx-3 mt-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 flex items-center gap-3 shadow-sm"
        >
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-6 h-6 text-yellow-300" fill="#fde047" />
          </div>
          <div className="flex-1 text-white text-left">
            <p className="font-bold">Flash Sale Live Now!</p>
            <p className="text-sm text-white/80">Up to 70% OFF - Limited time</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Recently Viewed */}
        <div className="bg-white mx-3 mt-3 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Recently Viewed</h2>
            <button className="flex items-center text-sm text-[#f85c98] font-medium">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {recentlyViewed.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/product/${item.id}`)}
                className="flex-shrink-0 w-24"
              >
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt="Product"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[#f85c98] font-bold text-sm mt-1">AED {item.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Menu List */}
        <div className="bg-white mx-3 mt-3 rounded-xl shadow-sm overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="flex-1 text-left text-gray-900 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="bg-[#f85c98] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mx-3 mt-3 mb-3 w-auto flex items-center justify-center gap-2 py-3 bg-white rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </main>

      <BottomNav />
    </div>
  );
}
