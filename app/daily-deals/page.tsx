'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ShoppingCart, Clock, Zap, Bell, BellOff, ChevronRight } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Food', 'Sports'];

const dealProducts = [
  { id: 1, name: 'Wireless Noise Cancelling Headphones Pro', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', originalPrice: 4999, salePrice: 1999, discount: 60, sold: 847, stock: 100, category: 'Electronics' },
  { id: 2, name: 'Smart Fitness Watch with Heart Monitor', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', originalPrice: 3999, salePrice: 1499, discount: 63, sold: 1234, stock: 150, category: 'Electronics' },
  { id: 3, name: 'Designer Leather Crossbody Bag', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', originalPrice: 2499, salePrice: 999, discount: 60, sold: 523, stock: 80, category: 'Fashion' },
  { id: 4, name: 'Premium Skincare Gift Set Collection', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', originalPrice: 1899, salePrice: 699, discount: 63, sold: 2341, stock: 200, category: 'Beauty' },
  { id: 5, name: 'Portable Bluetooth Speaker Waterproof', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', originalPrice: 1599, salePrice: 599, discount: 63, sold: 876, stock: 120, category: 'Electronics' },
  { id: 6, name: 'Running Shoes Ultra Comfort Edition', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', originalPrice: 2999, salePrice: 1299, discount: 57, sold: 654, stock: 90, category: 'Sports' },
  { id: 7, name: 'Robot Vacuum Cleaner with Mop', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', originalPrice: 8999, salePrice: 3999, discount: 56, sold: 432, stock: 50, category: 'Home' },
  { id: 8, name: 'Organic Coffee Beans Premium Blend', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&q=80', originalPrice: 599, salePrice: 299, discount: 50, sold: 3421, stock: 500, category: 'Food' },
];

export default function DailyDealsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [notifyMe, setNotifyMe] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 32, seconds: 48 });

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = activeCategory === 'All' 
    ? dealProducts 
    : dealProducts.filter(p => p.category === activeCategory);

  const formatTime = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Hero Banner */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80"
          alt="Daily Deals"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#E31C79] via-[#E31C79]/80 to-transparent" />
        
        {/* Header */}
        <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => router.push('/cart')} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Title & Timer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <h1 className="text-2xl font-black text-white">DAILY DEALS</h1>
              </div>
              <p className="text-white/80 text-sm">Up to 70% OFF - Limited Time Only!</p>
            </div>
            
            {/* Countdown */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-white" />
              <div className="flex gap-1">
                <span className="bg-white text-[#E31C79] text-lg font-bold px-2 py-1 rounded">{formatTime(timeLeft.hours)}</span>
                <span className="text-white font-bold text-lg">:</span>
                <span className="bg-white text-[#E31C79] text-lg font-bold px-2 py-1 rounded">{formatTime(timeLeft.minutes)}</span>
                <span className="text-white font-bold text-lg">:</span>
                <span className="bg-white text-[#E31C79] text-lg font-bold px-2 py-1 rounded animate-pulse">{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white px-4 py-3 overflow-x-auto hide-scrollbar sticky top-0 z-10 shadow-sm">
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#E31C79] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Deal of the Day */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span className="text-white font-bold">DEAL OF THE DAY</span>
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-24 bg-white rounded-xl overflow-hidden relative flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" alt="" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold line-clamp-2 mb-1">Premium Wireless Headphones with Active Noise Cancellation</p>
              <div className="flex items-baseline gap-2">
                <span className="text-yellow-300 text-2xl font-bold">AED 1,999</span>
                <span className="text-white/60 text-sm line-through">AED 4,999</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '85%' }} />
                </div>
                <span className="text-white text-xs">85% sold</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => {
            const soldPercent = Math.min(100, (product.sold / (product.sold + product.stock)) * 100);
            const isNotified = notifyMe.includes(product.id);
            
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                  <button
                    onClick={() => setNotifyMe(prev => 
                      isNotified ? prev.filter(id => id !== product.id) : [...prev, product.id]
                    )}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      isNotified ? 'bg-[#E31C79] text-white' : 'bg-white/90 text-gray-600'
                    }`}
                  >
                    {isNotified ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm text-gray-800 line-clamp-2 mb-2 font-medium min-h-[40px]">
                    {product.name}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-[#E31C79] font-bold">AED {product.salePrice.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs line-through">AED {product.originalPrice.toLocaleString()}</span>
                  </div>
                  
                  {/* Stock Progress */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                        style={{ width: `${soldPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{product.sold.toLocaleString()} sold</p>
                  </div>

                  <button className="w-full bg-[#E31C79] text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 hover:bg-[#d11a6e] transition-all active:scale-95">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
