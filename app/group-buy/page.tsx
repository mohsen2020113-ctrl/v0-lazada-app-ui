'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Users, Clock, Plus, Bell, ShoppingCart, Star, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Food', 'Beauty'];

const groupDeals = [
  { id: '1', name: 'Wireless Earbuds Pro TWS Bluetooth 5.3', normalPrice: 1999, groupPrice: 799, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop', joined: 45, needed: 50, endsIn: 7200, category: 'Electronics' },
  { id: '2', name: 'Smart Watch Fitness Tracker Series 8', normalPrice: 3499, groupPrice: 1499, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', joined: 28, needed: 30, endsIn: 3600, category: 'Electronics' },
  { id: '3', name: 'Organic Skincare Set 5-in-1 Bundle', normalPrice: 2499, groupPrice: 999, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', joined: 72, needed: 100, endsIn: 14400, category: 'Beauty' },
  { id: '4', name: 'Premium Coffee Beans 1kg Pack', normalPrice: 899, groupPrice: 399, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop', joined: 156, needed: 200, endsIn: 28800, category: 'Food' },
  { id: '5', name: 'Designer Crossbody Bag Leather', normalPrice: 4999, groupPrice: 1999, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop', joined: 18, needed: 25, endsIn: 5400, category: 'Fashion' },
  { id: '6', name: 'Air Purifier HEPA Filter Smart', normalPrice: 5999, groupPrice: 2499, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&h=300&fit=crop', joined: 34, needed: 40, endsIn: 10800, category: 'Home' },
];

const myGroups = [
  { id: '1', name: 'Wireless Earbuds Pro', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&h=100&fit=crop', status: 'In Progress', progress: 90 },
  { id: '2', name: 'Premium Coffee Beans', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop', status: 'Success', progress: 100 },
];

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function GroupBuyPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const [heroCountdown, setHeroCountdown] = useState(43200);

  useEffect(() => {
    const initial: Record<string, number> = {};
    groupDeals.forEach(deal => {
      initial[deal.id] = deal.endsIn;
    });
    setCountdowns(initial);

    const interval = setInterval(() => {
      setCountdowns(prev => {
        const updated: Record<string, number> = {};
        Object.keys(prev).forEach(key => {
          updated[key] = Math.max(0, prev[key] - 1);
        });
        return updated;
      });
      setHeroCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const filteredDeals = activeCategory === 'All'
    ? groupDeals
    : groupDeals.filter(deal => deal.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 flex-1">Group Buy</h1>
        <button onClick={() => router.push('/cart')} className="relative p-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-br from-[#E31C79] via-pink-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <circle cx="350" cy="50" r="100" fill="white" fillOpacity="0.1" />
            <circle cx="50" cy="180" r="80" fill="white" fillOpacity="0.1" />
          </svg>
        </div>
        <div className="absolute inset-0 p-4 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-white" />
            <span className="text-white/90 text-sm font-medium">BUY TOGETHER</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Save More Together!</h2>
          <p className="text-white/80 text-sm mb-4">Join group deals and unlock massive discounts</p>
          
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-sm">Mega deals end in:</span>
            <div className="flex gap-1">
              {formatTime(heroCountdown).split(':').map((unit, idx) => (
                <span key={idx} className="bg-white/20 text-white font-mono font-bold px-2 py-1 rounded text-sm">
                  {unit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white py-3 px-3 overflow-x-auto hide-scrollbar border-b border-gray-100">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#E31C79] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Group Deals Grid */}
      <div className="p-3">
        <div className="grid grid-cols-1 gap-4">
          {filteredDeals.map((deal) => {
            const progress = (deal.joined / deal.needed) * 100;
            const savings = deal.normalPrice - deal.groupPrice;
            const timeLeft = countdowns[deal.id] || deal.endsIn;

            return (
              <div
                key={deal.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="flex">
                  {/* Product Image */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={deal.image}
                      alt={deal.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#E31C79] text-white text-xs font-bold px-2 py-1 rounded">
                      -{Math.round((savings / deal.normalPrice) * 100)}%
                    </div>
                  </div>

                  {/* Deal Info */}
                  <div className="flex-1 p-3">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                      {deal.name}
                    </h3>

                    {/* Prices */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-[#E31C79] font-bold text-lg">AED {deal.groupPrice.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm line-through">AED {deal.normalPrice.toLocaleString()}</span>
                    </div>

                    {/* Time Badge */}
                    <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
                      <Clock className="w-3 h-3" />
                      <span className="font-mono">{formatTime(timeLeft)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#E31C79] to-pink-400 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          <Users className="w-3 h-3 inline mr-1" />
                          {deal.joined}/{deal.needed} joined
                        </span>
                        <span className="text-xs text-[#E31C79] font-medium">
                          {deal.needed - deal.joined} more needed
                        </span>
                      </div>
                    </div>

                    {/* Join Button */}
                    <button className="w-full bg-[#E31C79] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#C91568] transition-colors">
                      Join Group
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Active Groups */}
      {myGroups.length > 0 && (
        <div className="bg-white mt-2 py-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-gray-900">My Active Groups</h2>
            <button className="text-[#E31C79] text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 space-y-3">
            {myGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image src={group.image} alt={group.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${group.progress === 100 ? 'bg-green-500' : 'bg-[#E31C79]'}`}
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${group.progress === 100 ? 'text-green-500' : 'text-[#E31C79]'}`}>
                      {group.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-[#E31C79] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#C91568] transition-colors z-30">
        <Plus className="w-6 h-6" />
      </button>

      <BottomNav />
    </div>
  );
}
