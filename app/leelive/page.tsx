'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Search, Eye, Heart, ShoppingBag, MessageCircle, X, Gift, Share2 } from 'lucide-react';
import { BottomNav } from '@/components/lee/bottom-nav-new';

const liveStreams = [
  { id: 1, streamer: 'FashionQueen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80', viewers: 12453, category: 'Fashion', isLive: true, featured: true },
  { id: 2, streamer: 'TechGuru', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=80', viewers: 8234, category: 'Electronics', isLive: true },
  { id: 3, streamer: 'BeautyBoss', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80', viewers: 6521, category: 'Beauty', isLive: true },
  { id: 4, streamer: 'HomeDecorPro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80', viewers: 4532, category: 'Home', isLive: true },
  { id: 5, streamer: 'FitLife', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80', viewers: 3876, category: 'Sports', isLive: true },
  { id: 6, streamer: 'FoodieDelight', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80', thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', viewers: 5643, category: 'Food', isLive: true },
];

const chatMessages = [
  { id: 1, user: 'Sarah', message: 'Love this product!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80' },
  { id: 2, user: 'Mike', message: 'What size should I get?', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80' },
  { id: 3, user: 'Lisa', message: 'Just ordered! So excited!', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&q=80' },
  { id: 4, user: 'John', message: 'Best deals ever!', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&q=80' },
];

export default function LEELivePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'recommended' | 'following'>('recommended');
  const [watchingStream, setWatchingStream] = useState<typeof liveStreams[0] | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  const [likeCount, setLikeCount] = useState(1234);

  const handleHeart = () => {
    const newHeart = { id: Date.now(), x: Math.random() * 40 - 20 };
    setHearts(prev => [...prev, newHeart]);
    setLikeCount(prev => prev + 1);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 2000);
  };

  const formatViewers = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const featuredStream = liveStreams.find(s => s.featured);
  const otherStreams = liveStreams.filter(s => !s.featured);

  // Full Screen Live View
  if (watchingStream) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Video Background */}
        <div className="absolute inset-0">
          <Image src={watchingStream.thumbnail} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Header */}
        <div className="relative z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white relative">
              <Image src={watchingStream.avatar} alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="text-white font-semibold">{watchingStream.streamer}</p>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3 text-white/80" />
                <span className="text-white/80 text-xs">{formatViewers(watchingStream.viewers)}</span>
              </div>
            </div>
            <button className="bg-[#E31C79] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
              Follow
            </button>
          </div>
          <button onClick={() => setWatchingStream(null)} className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* LIVE Badge */}
        <div className="absolute top-20 left-4 z-10">
          <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-bold">LIVE</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 relative z-10 flex flex-col justify-end p-4">
          <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit max-w-[80%]">
                <div className="w-6 h-6 rounded-full overflow-hidden relative flex-shrink-0">
                  <Image src={msg.avatar} alt="" fill className="object-cover" />
                </div>
                <span className="text-yellow-400 text-sm font-semibold">{msg.user}</span>
                <span className="text-white text-sm">{msg.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heart Animations */}
        <div className="absolute right-16 bottom-40 w-12 overflow-visible">
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute bottom-0 animate-float-up"
              style={{ left: `${heart.x}px` }}
            >
              <Heart className="w-8 h-8 text-[#E31C79] fill-[#E31C79]" />
            </div>
          ))}
        </div>

        {/* Side Actions */}
        <div className="absolute right-4 bottom-48 flex flex-col items-center gap-4 z-10">
          <button onClick={handleHeart} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">{formatViewers(likeCount)}</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Chat</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Gift</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Share</span>
          </button>
        </div>

        {/* Product Card */}
        <div className="relative z-10 p-4">
          <div className="bg-white rounded-xl p-3 flex gap-3 items-center shadow-xl">
            <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
              <Image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80" alt="" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">Premium Smart Watch Series 5</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[#E31C79] font-bold">AED 1,299</span>
                <span className="text-gray-400 text-xs line-through">AED 2,999</span>
                <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded font-bold">-57%</span>
              </div>
            </div>
            <button className="bg-[#E31C79] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              Buy
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes float-up {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-150px) scale(1.5); }
          }
          .animate-float-up {
            animation: float-up 2s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  // Live Grid View
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}>
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">LEE Live</h1>
          </div>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4">
          {(['recommended', 'following'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-semibold transition-all ${
                activeTab === tab
                  ? 'text-[#E31C79] border-b-2 border-[#E31C79]'
                  : 'text-gray-500'
              }`}
            >
              {tab === 'recommended' ? 'Recommended' : 'Following'}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Live */}
      {featuredStream && (
        <button
          onClick={() => setWatchingStream(featuredStream)}
          className="w-full relative h-56 overflow-hidden"
        >
          <Image src={featuredStream.thumbnail} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* LIVE Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-bold">LIVE</span>
          </div>

          {/* Viewers */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
            <Eye className="w-3 h-3 text-white" />
            <span className="text-white text-xs">{formatViewers(featuredStream.viewers)}</span>
          </div>

          {/* Streamer Info */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white relative">
              <Image src={featuredStream.avatar} alt="" fill className="object-cover" />
            </div>
            <div>
              <p className="text-white font-bold">{featuredStream.streamer}</p>
              <p className="text-white/80 text-sm">{featuredStream.category}</p>
            </div>
          </div>
        </button>
      )}

      {/* Live Grid */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Live Now</h2>
        <div className="grid grid-cols-2 gap-3">
          {otherStreams.map((stream) => (
            <button
              key={stream.id}
              onClick={() => setWatchingStream(stream)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="relative aspect-[4/5]">
                <Image src={stream.thumbnail} alt="" fill className="object-cover" />
                
                {/* LIVE Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold">LIVE</span>
                </div>

                {/* Viewers */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-full">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-white text-[10px]">{formatViewers(stream.viewers)}</span>
                </div>

                {/* Category */}
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded-full">
                  <span className="text-white text-[10px]">{stream.category}</span>
                </div>
              </div>

              {/* Streamer Info */}
              <div className="p-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  <Image src={stream.avatar} alt="" fill className="object-cover" />
                </div>
                <span className="text-sm font-semibold text-gray-900 truncate">{stream.streamer}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
