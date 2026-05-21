'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Ticket, Clock, Tag, Gift, ChevronRight, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const vouchers = {
  available: [
    { id: 1, type: 'discount', amount: 'AED 100', minSpend: 'AED 500', code: 'LEE100', expiry: 'May 31, 2026', category: 'All Products' },
    { id: 2, type: 'percent', amount: '15%', minSpend: 'AED 300', code: 'SAVE15', expiry: 'Jun 15, 2026', category: 'Fashion', maxDiscount: 'AED 200' },
    { id: 3, type: 'shipping', amount: 'FREE', minSpend: 'AED 199', code: 'FREESHIP', expiry: 'Jun 30, 2026', category: 'All Products' },
    { id: 5, type: 'percent', amount: '20%', minSpend: 'AED 1,000', code: 'MEGA20', expiry: 'Jun 5, 2026', category: 'All Products', maxDiscount: 'AED 500' },
  ],
  used: [
    { id: 6, type: 'discount', amount: 'AED 80', minSpend: 'AED 400', code: 'MAY80', usedDate: 'May 1, 2026', category: 'All Products' },
    { id: 7, type: 'shipping', amount: 'FREE', minSpend: 'AED 99', code: 'SHIP99', usedDate: 'Apr 28, 2026', category: 'All Products' },
  ],
  expired: [
    { id: 8, type: 'percent', amount: '25%', minSpend: 'AED 500', code: 'APR25', expiredDate: 'Apr 30, 2026', category: 'Fashion' },
    { id: 9, type: 'discount', amount: 'AED 200', minSpend: 'AED 1,000', code: 'BIG200', expiredDate: 'Apr 15, 2026', category: 'Electronics' },
  ],
};

export default function VouchersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getVoucherIcon = (type: string) => {
    switch (type) {
      case 'shipping': return <Gift className="w-5 h-5" />;
      case 'percent': return <Tag className="w-5 h-5" />;
      default: return <Ticket className="w-5 h-5" />;
    }
  };

  const currentVouchers = vouchers[activeTab];

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E31C79] to-purple-600 pt-4 pb-6 px-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">My Vouchers</h1>
        </div>

        {/* Collect More Banner */}
        <button
          onClick={() => router.push('/daily-deals')}
          className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white/30 hover:bg-white/30 transition-all"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-800" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white font-bold">Collect More Vouchers!</p>
            <p className="text-white/80 text-sm">Check out today&apos;s deals</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white px-4 py-3 flex gap-2 sticky top-0 z-10 shadow-sm">
        {(['available', 'used', 'expired'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === tab
                ? 'bg-[#E31C79] text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === 'available' && (
              <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                {vouchers.available.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vouchers List */}
      <div className="p-4 space-y-3">
        {currentVouchers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Ticket className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-gray-500 font-semibold mb-2">No {activeTab} vouchers</h3>
            <p className="text-gray-400 text-sm text-center mb-4">
              {activeTab === 'available' 
                ? 'Collect vouchers from deals and promotions!'
                : `You don&apos;t have any ${activeTab} vouchers yet.`}
            </p>
            {activeTab === 'available' && (
              <button
                onClick={() => router.push('/daily-deals')}
                className="bg-[#E31C79] text-white px-6 py-3 rounded-xl font-semibold"
              >
                Browse Deals
              </button>
            )}
          </div>
        ) : (
          currentVouchers.map((voucher) => (
            <div
              key={voucher.id}
              className={`bg-white rounded-xl overflow-hidden shadow-sm border-l-4 ${
                activeTab === 'expired' 
                  ? 'border-gray-300 opacity-60' 
                  : activeTab === 'used'
                  ? 'border-gray-400'
                  : 'border-[#E31C79]'
              }`}
            >
              <div className="p-4 flex gap-4">
                {/* Left: Icon & Amount */}
                <div className={`flex flex-col items-center justify-center w-20 ${
                  activeTab === 'available' ? 'text-[#E31C79]' : 'text-gray-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                    activeTab === 'available' ? 'bg-[#E31C79]/10' : 'bg-gray-100'
                  }`}>
                    {getVoucherIcon(voucher.type)}
                  </div>
                  <span className="text-2xl font-bold">{voucher.amount}</span>
                  <span className="text-xs text-gray-500">OFF</span>
                </div>

                {/* Dashed Divider */}
                <div className="w-px border-l-2 border-dashed border-gray-200" />

                {/* Right: Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{voucher.category}</p>
                      <p className="text-sm text-gray-500">Min. spend {voucher.minSpend}</p>
                      {'maxDiscount' in voucher && (
                        <p className="text-xs text-gray-400">Max discount: {voucher.maxDiscount}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      voucher.type === 'shipping' 
                        ? 'bg-green-100 text-green-700'
                        : voucher.type === 'percent'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-[#E31C79]/10 text-[#E31C79]'
                    }`}>
                      {voucher.type === 'shipping' ? 'FREE SHIP' : voucher.type.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {'expiry' in voucher && <span>Expires: {voucher.expiry}</span>}
                      {'usedDate' in voucher && <span>Used: {voucher.usedDate}</span>}
                      {'expiredDate' in voucher && <span>Expired: {voucher.expiredDate}</span>}
                    </div>
                    {activeTab === 'available' && (
                      <button
                        onClick={() => handleCopy(voucher.code)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          copiedCode === voucher.code
                            ? 'bg-green-500 text-white'
                            : 'bg-[#E31C79] text-white hover:bg-[#d11a6e]'
                        }`}
                      >
                        {copiedCode === voucher.code ? 'Copied!' : 'Use Now'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Code Display */}
              {activeTab === 'available' && (
                <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-t border-dashed border-gray-200">
                  <span className="text-xs text-gray-500">Code:</span>
                  <span className="font-mono font-bold text-gray-700">{voucher.code}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
