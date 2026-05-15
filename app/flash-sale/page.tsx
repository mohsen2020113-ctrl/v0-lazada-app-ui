'use client';

import { useState, useEffect } from 'react';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { ChevronLeft, Bell, BellOff, Zap, Clock, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/cart-context';
import Image from 'next/image';

interface FlashProduct {
  id: string;
  title: string;
  image: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  soldPercent: number;
  stock: number;
}

interface FlashSession {
  id: string;
  time: string;
  label: string;
  status: 'ended' | 'live' | 'upcoming';
  endTime?: Date;
  startTime?: Date;
  products: FlashProduct[];
}

const flashSessions: FlashSession[] = [
  {
    id: 'live',
    time: '12:00',
    label: 'LIVE NOW',
    status: 'live',
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 2.5),
    products: [
      { id: 'f1', title: 'Apple AirPods Pro 2nd Gen', image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=300&h=300&fit=crop', originalPrice: 8990, salePrice: 5990, discount: 33, soldPercent: 87, stock: 13 },
      { id: 'f2', title: 'Samsung Galaxy Watch 6', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop', originalPrice: 12990, salePrice: 7990, discount: 38, soldPercent: 92, stock: 8 },
      { id: 'f3', title: 'Nike Air Max 90 Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', originalPrice: 5490, salePrice: 2990, discount: 46, soldPercent: 78, stock: 22 },
      { id: 'f4', title: 'Dyson V15 Detect Vacuum', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=300&h=300&fit=crop', originalPrice: 25990, salePrice: 18990, discount: 27, soldPercent: 65, stock: 35 },
      { id: 'f5', title: 'Sony WH-1000XM5 Headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop', originalPrice: 13990, salePrice: 9490, discount: 32, soldPercent: 81, stock: 19 },
      { id: 'f6', title: 'iPad Air M2 11-inch', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop', originalPrice: 24900, salePrice: 19900, discount: 20, soldPercent: 94, stock: 6 },
      { id: 'f7', title: 'Estee Lauder Advanced Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', originalPrice: 4200, salePrice: 2520, discount: 40, soldPercent: 72, stock: 28 },
      { id: 'f8', title: 'Philips Air Fryer XXL', image: 'https://images.unsplash.com/photo-1626509653291-18d9a934b9db?w=300&h=300&fit=crop', originalPrice: 8990, salePrice: 5390, discount: 40, soldPercent: 68, stock: 32 },
    ],
  },
  {
    id: '2pm',
    time: '14:00',
    label: 'Starting at 2PM',
    status: 'upcoming',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2),
    products: [
      { id: 'f9', title: 'MacBook Air M3 15-inch', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop', originalPrice: 49900, salePrice: 42900, discount: 14, soldPercent: 0, stock: 50 },
      { id: 'f10', title: 'JBL Flip 6 Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', originalPrice: 4490, salePrice: 2690, discount: 40, soldPercent: 0, stock: 100 },
      { id: 'f11', title: 'Adidas Ultraboost 23', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=300&h=300&fit=crop', originalPrice: 6800, salePrice: 3990, discount: 41, soldPercent: 0, stock: 75 },
      { id: 'f12', title: 'Canon EOS R50 Camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop', originalPrice: 32990, salePrice: 24990, discount: 24, soldPercent: 0, stock: 30 },
    ],
  },
  {
    id: '6pm',
    time: '18:00',
    label: 'Starting at 6PM',
    status: 'upcoming',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 6),
    products: [
      { id: 'f13', title: 'PlayStation 5 Slim', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop', originalPrice: 18990, salePrice: 14990, discount: 21, soldPercent: 0, stock: 20 },
      { id: 'f14', title: 'LG OLED TV 55-inch', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop', originalPrice: 49990, salePrice: 34990, discount: 30, soldPercent: 0, stock: 15 },
      { id: 'f15', title: 'Roborock S8 Pro Ultra', image: 'https://images.unsplash.com/photo-1603618090554-0fb9699ce2c4?w=300&h=300&fit=crop', originalPrice: 39990, salePrice: 29990, discount: 25, soldPercent: 0, stock: 25 },
      { id: 'f16', title: 'La Mer Moisturizing Cream', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop', originalPrice: 12500, salePrice: 8750, discount: 30, soldPercent: 0, stock: 40 },
    ],
  },
];

export default function FlashSalePage() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [activeSession, setActiveSession] = useState('live');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [notifyEnabled, setNotifyEnabled] = useState<string[]>([]);

  const currentSession = flashSessions.find(s => s.id === activeSession) || flashSessions[0];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const targetTime = currentSession.status === 'live' 
        ? currentSession.endTime?.getTime() || 0
        : currentSession.startTime?.getTime() || 0;
      const distance = targetTime - now;

      if (distance < 0) {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession]);

  const toggleNotify = (sessionId: string) => {
    setNotifyEnabled(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col max-w-[430px] mx-auto">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 pt-12 pb-6 px-4">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => router.push('/cart')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors relative">
            <ShoppingCart className="w-5 h-5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Flash Sale Title */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-8 h-8 text-yellow-300" fill="#fde047" />
            <h1 className="text-3xl font-black text-white tracking-tight">FLASH SALE</h1>
            <Zap className="w-8 h-8 text-yellow-300" fill="#fde047" />
          </div>
          <p className="text-white/90 text-sm">Limited time offers - Up to 70% OFF!</p>
        </div>

        {/* Massive Countdown Timer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mx-auto max-w-xs">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">
              {currentSession.status === 'live' ? 'Ends in' : 'Starts in'}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-white text-red-600 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-black font-mono">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-500 -mt-1">HOURS</span>
            </div>
            <span className="text-white text-3xl font-bold">:</span>
            <div className="bg-white text-red-600 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg">
              <span className="text-2xl font-black font-mono">{String(countdown.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-500 -mt-1">MINS</span>
            </div>
            <span className="text-white text-3xl font-bold">:</span>
            <div className="bg-white text-red-600 w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg animate-pulse">
              <span className="text-2xl font-black font-mono">{String(countdown.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-gray-500 -mt-1">SECS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Session Tabs */}
      <div className="bg-white sticky top-0 z-40 border-b border-gray-200">
        <div className="flex">
          {flashSessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session.id)}
              className={`flex-1 py-3 px-2 text-center transition-colors relative ${
                activeSession === session.id
                  ? 'bg-red-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className={`text-lg font-bold ${
                activeSession === session.id ? 'text-red-600' : 'text-gray-700'
              }`}>
                {session.time}
              </p>
              <p className={`text-xs ${
                session.status === 'live' 
                  ? 'text-red-500 font-bold' 
                  : 'text-gray-500'
              }`}>
                {session.status === 'live' ? 'LIVE NOW' : session.label}
              </p>
              {activeSession === session.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
              )}
              {session.status === 'live' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        {/* Notify Button for Upcoming Sessions */}
        {currentSession.status === 'upcoming' && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 mx-3 mt-3 rounded-xl p-4 flex items-center justify-between">
            <div className="text-white">
              <p className="font-bold">Get notified when sale starts!</p>
              <p className="text-sm text-white/80">We will remind you before the sale begins</p>
            </div>
            <button
              onClick={() => toggleNotify(currentSession.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                notifyEnabled.includes(currentSession.id)
                  ? 'bg-white text-red-600'
                  : 'bg-white/20 text-white'
              }`}
            >
              {notifyEnabled.includes(currentSession.id) ? (
                <Bell className="w-6 h-6" fill="currentColor" />
              ) : (
                <BellOff className="w-6 h-6" />
              )}
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="p-3 grid grid-cols-2 gap-3">
          {currentSession.products.map((product) => (
            <button
              key={product.id}
              onClick={() => router.push(`/product/${product.handle}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
                {/* Discount Badge */}
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-lg">
                  <span className="text-xs font-bold">-{product.discount}%</span>
                </div>
                {/* Stock Warning */}
                {product.soldPercent > 80 && (
                  <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-[10px] px-2 py-1 rounded font-bold">
                    Almost Gone!
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <p className="text-xs text-gray-600 line-clamp-2 mb-2 h-8">{product.title}</p>
                
                {/* Prices */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-lg font-bold text-red-600">AED {product.salePrice.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">AED {product.originalPrice.toLocaleString()}</span>
                </div>

                {/* Sold Progress Bar */}
                <div className="relative">
                  <div className="h-5 bg-red-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(product.soldPercent, 15)}%` }}
                    >
                      {product.soldPercent > 30 && (
                        <span className="text-[10px] text-white font-bold">{product.soldPercent}% SOLD</span>
                      )}
                    </div>
                  </div>
                  {product.soldPercent <= 30 && (
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-red-600 font-bold">
                      {currentSession.status === 'upcoming' ? 'Coming Soon' : `${product.soldPercent}% SOLD`}
                    </span>
                  )}
                </div>

                {/* Stock Count */}
                <p className="text-[10px] text-gray-500 mt-1 text-center">
                  {currentSession.status === 'upcoming' 
                    ? `${product.stock} items available`
                    : `Only ${product.stock} left!`
                  }
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
