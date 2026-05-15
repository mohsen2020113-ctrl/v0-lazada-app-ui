'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Eye, EyeOff, Plus, ArrowUpRight, Clock, Coins, Gift, CreditCard, Building2, Shield, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const transactions = [
  { id: 1, type: 'topup', title: 'Top Up via Bank', amount: '+AED 500.00', date: 'Today, 2:30 PM', icon: Plus, color: 'text-green-600 bg-green-100' },
  { id: 2, type: 'purchase', title: 'Order #LEE8392847', amount: '-AED 299.00', date: 'Yesterday, 4:15 PM', icon: ArrowUpRight, color: 'text-red-500 bg-red-100' },
  { id: 3, type: 'refund', title: 'Refund - Order Return', amount: '+AED 150.00', date: 'May 2, 10:20 AM', icon: ArrowUpRight, color: 'text-green-600 bg-green-100' },
  { id: 4, type: 'coins', title: 'Coins Reward', amount: '+50 Coins', date: 'May 1, 9:00 AM', icon: Coins, color: 'text-yellow-600 bg-yellow-100' },
  { id: 5, type: 'purchase', title: 'Order #LEE7283945', amount: '-AED 1,250.00', date: 'Apr 30, 3:45 PM', icon: ArrowUpRight, color: 'text-red-500 bg-red-100' },
  { id: 6, type: 'topup', title: 'Top Up via Card', amount: '+AED 1,000.00', date: 'Apr 28, 11:30 AM', icon: Plus, color: 'text-green-600 bg-green-100' },
];

const linkedAccounts = [
  { id: 1, name: 'Kasikorn Bank', number: '****4521', icon: Building2, color: 'bg-green-600' },
  { id: 2, name: 'Bangkok Bank', number: '****8834', icon: Building2, color: 'bg-blue-600' },
];

export default function WalletPage() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-[#E31C79] via-[#E31C79] to-purple-600 pt-4 pb-32 px-4">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">LEE Wallet</h1>
          <button onClick={() => router.push('/notifications')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Balance Card - Overlapping */}
      <div className="-mt-24 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Available Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} className="text-gray-400 hover:text-gray-600">
              {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-bold text-gray-900">
              {showBalance ? 'AED 2,450.00' : 'AED •••••'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex flex-col items-center gap-1 bg-[#E31C79] text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Top Up</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 bg-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
              <ArrowUpRight className="w-6 h-6" />
              <span className="text-sm">Transfer</span>
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all">
              <Clock className="w-6 h-6" />
              <span className="text-sm">History</span>
            </button>
          </div>
        </div>
      </div>

      {/* LEE Coins Section */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm">LEE Coins</p>
              <p className="text-white text-2xl font-bold">1,250</p>
            </div>
          </div>
          <button className="bg-white text-orange-500 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-white/90 transition-all">
            Earn More
          </button>
        </div>
      </div>

      {/* Earn Coins */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Earn LEE Coins</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="w-10 h-10 bg-[#E31C79]/10 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-[#E31C79]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">Daily Check-in</p>
                <p className="text-xs text-gray-500">Earn up to 10 coins daily</p>
              </div>
              <span className="text-[#E31C79] text-sm font-bold">+10</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">Shop & Earn</p>
                <p className="text-xs text-gray-500">1 coin per AED 10 spent</p>
              </div>
              <span className="text-purple-600 text-sm font-bold">Unlimited</span>
            </button>
          </div>
        </div>
      </div>

      {/* Linked Bank Accounts */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Linked Accounts</h3>
            <button className="text-[#E31C79] text-sm font-semibold">+ Add New</button>
          </div>
          <div className="space-y-2">
            {linkedAccounts.map((account) => (
              <div key={account.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center`}>
                  <account.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.number}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-[#E31C79] text-sm font-semibold">See All</button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
            {['all', 'topup', 'purchase', 'refund'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-[#E31C79] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {transactions
              .filter((t) => activeTab === 'all' || t.type === activeTab)
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.color}`}>
                    <transaction.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{transaction.title}</p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                  <span className={`font-bold text-sm ${
                    transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.amount}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="px-4 mt-4 mb-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Your wallet is protected with bank-level security. All transactions are encrypted and monitored 24/7.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
