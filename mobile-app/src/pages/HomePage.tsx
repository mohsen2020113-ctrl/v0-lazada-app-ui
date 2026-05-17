import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Globe, ShoppingCart, Heart, ChevronLeft, ChevronRight, Zap, Star, Camera, Mic, Tag, Flame, Sparkles, Clock, ChevronRight as ArrowRight } from 'lucide-react';
import { getProducts, ShopifyProduct, getProductImageUrl, getProductPrice, getCompareAtPrice, getDiscountPercent } from '../lib/shopify';
import { PageId, NavigationParams } from '../App';

const BANNERS = [
  { id:1, tag:'SALE', tagColor:'#f97316', title:'MEGA SALE', subtitle:'SHOP & SAVE BIG', percent:'UP TO 70%', desc:'Electronics, Fashion & More', btn:'Shop Now', btnColor:'#f97316', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800' },
  { id:2, tag:'KIDS', tagColor:'#ec4899', title:'BABY & KIDS', subtitle:'FOR YOUR LITTLE ONES', percent:'UP TO 60%', desc:'Toys, Clothes & Essentials', btn:'Shop Now', btnColor:'#ec4899', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { id:3, tag:'FASHION', tagColor:'#8b5cf6', title:'NEW SEASON', subtitle:'STYLE YOUR LOOK', percent:'UP TO 50%', desc:'Trending Styles & Collections', btn:'Explore', btnColor:'#8b5cf6', img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
  { id:4, tag:'HOME', tagColor:'#10b981', title:'HOME & LIVING', subtitle:'REFRESH YOUR SPACE', percent:'UP TO 40%', desc:'Furniture, Decor & Appliances', btn:'Shop Now', btnColor:'#10b981', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
  { id:5, tag:'TECH', tagColor:'#3b82f6', title:'TECH DEALS', subtitle:'GADGETS & DEVICES', percent:'UP TO 55%', desc:'Phones, Laptops & Accessories', btn:'Grab Now', btnColor:'#3b82f6', img:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
  { id:6, tag:'BEAUTY', tagColor:'#f43f5e', title:'BEAUTY FEST', subtitle:'GLOW UP THIS SEASON', percent:'UP TO 45%', desc:'Skincare, Makeup & Perfumes', btn:'Shop Now', btnColor:'#f43f5e', img:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800' },
  { id:7, tag:'SPORTS', tagColor:'#f59e0b', title:'SPORT ZONE', subtitle:'GEAR UP & GO', percent:'UP TO 35%', desc:'Fitness, Outdoor & Activewear', btn:'Explore', btnColor:'#f59e0b', img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800' },
  { id:8, tag:'FOOD', tagColor:'#a855f7', title:'FOOD & GROCERY', subtitle:'FRESH EVERY DAY', percent:'UP TO 25%', desc:'Organic, Snacks & Beverages', btn:'Order Now', btnColor:'#a855f7', img:'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800' },
  { id:9, tag:'FLASH', tagColor:'#ef4444', title:'FLASH DEALS', subtitle:'LIMITED TIME ONLY', percent:'UP TO 80%', desc:"Grab Before They're Gone", btn:'Grab Now', btnColor:'#ef4444', img:'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800' },
  { id:10, tag:'NEW', tagColor:'#0ea5e9', title:'NEW ARRIVALS', subtitle:'JUST DROPPED', percent:'EXPLORE NEW', desc:'Latest Collections & Styles', btn:'Shop New', btnColor:'#0ea5e9', img:'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800' },
];

const BOTTOM_ADS = [
  { id:1, bg:'#1e1b4b', text:'Shop LEEMall', sub:'Official Stores Only', btn:'Visit', color:'#f97316', img:'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
  { id:2, bg:'#065f46', text:'LEELive Now', sub:'Exclusive Live Deals', btn:'Watch', color:'#10b981', img:'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800' },
  { id:3, bg:'#7c2d12', text:'Daily Picks', sub:'Fresh Deals Every Day', btn:'Grab', color:'#f97316', img:'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800' },
];

const VOUCHERS = [
  { id:1, discount:'AED 10 OFF', min:'Min. spend AED 80', cat:'All Items', color:'#f97316', bg:'#fff7ed' },
  { id:2, discount:'20% OFF', min:'Min. spend AED 150', cat:'Electronics', color:'#6366f1', bg:'#eef2ff' },
  { id:3, discount:'AED 25 OFF', min:'Min. spend AED 200', cat:'Fashion', color:'#ec4899', bg:'#fdf2f8' },
  { id:4, discount:'15% OFF', min:'Min. spend AED 100', cat:'Home & Living', color:'#10b981', bg:'#ecfdf5' },
  { id:5, discount:'AED 5 OFF', min:'Min. spend AED 50', cat:'Beauty', color:'#ef4444', bg:'#fef2f2' },
];

const CATEGORIES = [
  {id:'mall',label:'LEEMall',icon:'🏬',bg:'#ef4444'},
  {id:'leeland',label:'LEELand',icon:'📍',bg:'#10b981'},
  {id:'leemart',label:'LEEMart',icon:'🏪',bg:'#3b82f6'},
  {id:'leelive',label:'LEELive',icon:'▶',bg:'#8b5cf6'},
  {id:'flash',label:'Flash Sale',icon:'⚡',bg:'#f97316'},
  {id:'fashion',label:'Fashion',icon:'👗',bg:'#ec4899'},
  {id:'electronics',label:'Electronics',icon:'💻',bg:'#6366f1'},
  {id:'mobiles',label:'Mobiles',icon:'📱',bg:'#0ea5e9'},
  {id:'home',label:'Home',icon:'🏠',bg:'#14b8a6'},
  {id:'gaming',label:'Gaming',icon:'🎮',bg:'#84cc16'},
  {id:'sports',label:'Sports',icon:'⚽',bg:'#f59e0b'},
  {id:'beauty',label:'Beauty',icon:'💄',bg:'#f43f5e'},
  {id:'food',label:'Food',icon:'🍔',bg:'#a855f7'},
  {id:'vouchers',label:'Vouchers',icon:'🎁',bg:'#f97316'},
  {id:'more',label:'More',icon:'···',bg:'#6b7280'},
];

interface HomePageProps {
  navigate: (page: PageId, params?: NavigationParams) => void;
  params: NavigationParams;
}

export default function HomePage({ navigate }: HomePageProps) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [adIndex, setAdIndex] = useState(0);
  const [flashProducts, setFlashProducts] = useState<ShopifyProduct[]>([]);
  const [dealProducts, setDealProducts] = useState<ShopifyProduct[]>([]);
  const [aiProducts, setAiProducts] = useState<ShopifyProduct[]>([]);
  const [recentProducts, setRecentProducts] = useState<ShopifyProduct[]>([]);
  const [feedProducts, setFeedProducts] = useState<ShopifyProduct[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [flashTime, setFlashTime] = useState({ h: 2, m: 34, s: 59 });
  const [dealTime, setDealTime] = useState({ h: 11, m: 59, s: 59 });
  const [claimedVouchers, setClaimedVouchers] = useState<Set<number>>(new Set());
  const loaderRef = useRef<HTMLDivElement>(null);
  const bannerTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const adTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Banner auto-advance
  useEffect(() => {
    bannerTimer.current = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % BANNERS.length);
    }, 4000);
    return () => { if (bannerTimer.current) clearInterval(bannerTimer.current); };
  }, []);

  // Bottom ad auto-advance
  useEffect(() => {
    adTimer.current = setInterval(() => {
      setAdIndex(prev => (prev + 1) % BOTTOM_ADS.length);
    }, 3500);
    return () => { if (adTimer.current) clearInterval(adTimer.current); };
  }, []);

  // Flash sale countdown
  useEffect(() => {
    const t = setInterval(() => {
      setFlashTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 2; m = 34; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Daily deals countdown
  useEffect(() => {
    const t = setInterval(() => {
      setDealTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 11; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Load products
  useEffect(() => {
    getProducts(6).then(r => setFlashProducts(r.products));
    getProducts(4, undefined).then(r => setDealProducts(r.products));
    getProducts(6, undefined).then(r => { setAiProducts(r.products); setRecentProducts(r.products.slice(0, 4)); });
  }, []);

  // Load feed products
  const loadMore = useCallback(async () => {
    if (loadingFeed || !hasMore) return;
    setLoadingFeed(true);
    try {
      const r = await getProducts(8, cursor ?? undefined);
      setFeedProducts(prev => [...prev, ...r.products]);
      setCursor(r.pageInfo.endCursor);
      setHasMore(r.pageInfo.hasNextPage);
    } finally {
      setLoadingFeed(false);
    }
  }, [loadingFeed, hasMore, cursor]);

  useEffect(() => { loadMore(); }, []);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) loadMore();
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const pad = (n: number) => String(n).padStart(2, '0');
  const banner = BANNERS[bannerIndex];
  const ad = BOTTOM_ADS[adIndex];

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen pb-20">

      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-white px-3 py-2 flex items-center gap-2 shadow-sm">
        <Globe size={22} className="text-gray-500 flex-shrink-0" onClick={() => {}} />
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-2" onClick={() => navigate('search')}>
          <Search size={15} style={{ color: '#f97316' }} />
          <input
            className="flex-1 bg-transparent text-sm outline-none text-gray-500 placeholder-gray-400"
            placeholder="Search in LEE"
            readOnly
          />
          <Camera size={16} className="text-gray-400" />
          <Mic size={16} className="text-gray-400" />
        </div>
        <button
          className="flex-shrink-0 text-white text-sm font-bold px-4 py-1.5 rounded-full"
          style={{ backgroundColor: '#f97316' }}
          onClick={() => navigate('search')}
        >
          Search
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <img src={banner.img} alt={banner.title} className="w-full h-full object-cover transition-all duration-500" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.05) 100%)' }} />
        <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1">
          <span className="text-white text-xs font-bold px-2 py-0.5 rounded self-start" style={{ backgroundColor: banner.tagColor }}>{banner.tag}</span>
          <div className="text-white text-xl font-black leading-tight">{banner.title}</div>
          <div className="text-white text-xs font-medium opacity-90">{banner.subtitle}</div>
          <div className="text-white text-2xl font-black" style={{ color: banner.tagColor }}>{banner.percent}</div>
          <div className="text-white text-xs opacity-80">{banner.desc}</div>
          <button className="mt-2 self-start text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{ backgroundColor: banner.btnColor }}>{banner.btn}</button>
        </div>
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 rounded-full p-1" onClick={() => setBannerIndex(prev => (prev - 1 + BANNERS.length) % BANNERS.length)}>
          <ChevronLeft size={18} className="text-white" />
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 rounded-full p-1" onClick={() => setBannerIndex(prev => (prev + 1) % BANNERS.length)}>
          <ChevronRight size={18} className="text-white" />
        </button>
        <div className="absolute bottom-2 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">{bannerIndex + 1}/{BANNERS.length}</div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          {BANNERS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === bannerIndex ? 16 : 6, height: 6, backgroundColor: i === bannerIndex ? '#ffffff' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      {/* Service Bar */}
      <div className="flex items-center justify-center gap-2 py-2 px-3" style={{ backgroundColor: '#1e1b4b' }}>
        <span className="text-white text-xs font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: '#10b981' }}>FREE</span>
        <span className="text-white text-xs font-medium">Free Shipping</span>
        <span className="text-gray-500 text-xs mx-1">|</span>
        <span className="text-green-400 text-xs">✓</span>
        <span className="text-white text-xs font-medium">Fast Delivery</span>
        <span className="text-gray-500 text-xs mx-1">|</span>
        <span className="text-blue-400 text-xs">↩</span>
        <span className="text-white text-xs font-medium">Free Return</span>
      </div>

      {/* Category Icons */}
      <div className="bg-white pt-3 pb-2">
        <div className="flex overflow-x-auto px-3 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
              onClick={() => {
                if (cat.id === 'flash') navigate('flash-sale');
                else if (cat.id === 'vouchers') navigate('vouchers');
                else if (cat.id === 'fashion') navigate('fashion');
                else if (cat.id === 'leelive') navigate('flash-sale');
                else if (cat.id === 'mall') navigate('search');
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ backgroundColor: cat.bg }}>
                {cat.icon}
              </div>
              <span className="text-xs text-gray-600 text-center leading-tight" style={{ maxWidth: 56 }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voucher Section */}
      <div className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-orange-500" />
            <span className="font-black text-gray-900 text-sm">Vouchers For You</span>
          </div>
          <button className="text-orange-500 text-xs font-semibold flex items-center gap-0.5" onClick={() => navigate('vouchers')}>
            All <ArrowRight size={12} />
          </button>
        </div>
        <div className="flex overflow-x-auto px-3 pb-3 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {VOUCHERS.map(v => (
            <div key={v.id} className="flex-shrink-0 rounded-xl overflow-hidden border" style={{ width: 150, borderColor: v.color + '40', backgroundColor: v.bg }}>
              <div className="px-3 py-2 border-b" style={{ borderColor: v.color + '30' }}>
                <div className="font-black text-lg leading-tight" style={{ color: v.color }}>{v.discount}</div>
                <div className="text-xs text-gray-500 mt-0.5">{v.min}</div>
              </div>
              <div className="px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-gray-600">{v.cat}</span>
                <button
                  className="text-xs font-bold px-2 py-1 rounded-full text-white"
                  style={{ backgroundColor: claimedVouchers.has(v.id) ? '#9ca3af' : v.color }}
                  onClick={() => setClaimedVouchers(prev => new Set([...prev, v.id]))}
                >
                  {claimedVouchers.has(v.id) ? 'Claimed' : 'Claim'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale */}
      <div className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 py-2" style={{ background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)' }}>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-white" fill="white" />
            <span className="text-white font-black text-base">Flash Sale</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white text-xs opacity-80">Ends in</span>
            {[pad(flashTime.h), pad(flashTime.m), pad(flashTime.s)].map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-white text-red-600 text-xs font-black px-1.5 py-0.5 rounded">{t}</span>
                {i < 2 && <span className="text-white font-black text-xs">:</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="flex overflow-x-auto px-3 py-3 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {flashProducts.map(p => {
            const price = getProductPrice(p);
            const compare = getCompareAtPrice(p);
            const discount = getDiscountPercent(p);
            return (
              <div key={p.id} className="flex-shrink-0 w-32 cursor-pointer" onClick={() => navigate('product', { productId: p.id })}>
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 128 }}>
                  <img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                  {discount > 0 && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</div>
                  )}
                </div>
                <div className="mt-1 px-0.5">
                  <div className="text-xs text-gray-700 line-clamp-1 font-medium">{p.title}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-red-500 font-bold text-sm">{'$'}{price}</span>
                    {compare && <span className="text-gray-400 text-xs line-through">{'$'}{compare}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Bottom Ad Banner */}
      <div className="mt-2 relative overflow-hidden" style={{ height: 100 }}>
        <img src={ad.img} alt={ad.text} className="w-full h-full object-cover transition-all duration-700" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)' }} />
        <div className="absolute inset-0 flex items-center px-5 gap-4">
          <div className="flex-1">
            <div className="text-white font-black text-base leading-tight">{ad.text}</div>
            <div className="text-white text-xs opacity-80 mt-0.5">{ad.sub}</div>
          </div>
          <button className="text-white text-xs font-bold px-4 py-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: ad.color }}>
            {ad.btn}
          </button>
        </div>
        <div className="absolute bottom-2 right-3 flex gap-1">
          {BOTTOM_ADS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300" style={{ width: i === adIndex ? 14 : 5, height: 5, backgroundColor: i === adIndex ? '#ffffff' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      </div>

      {/* Daily Deals */}
      <div className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)' }}>
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-white" fill="white" />
            <span className="text-white font-black text-base">Daily Deals</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white text-xs opacity-80">Resets in</span>
            {[pad(dealTime.h), pad(dealTime.m), pad(dealTime.s)].map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-white text-purple-600 text-xs font-black px-1.5 py-0.5 rounded">{t}</span>
                {i < 2 && <span className="text-white font-black text-xs">:</span>}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          {dealProducts.map((p, idx) => {
            const price = getProductPrice(p);
            const compare = getCompareAtPrice(p);
            const discount = getDiscountPercent(p);
            const dealDiscount = discount > 0 ? discount : 10 + idx * 5;
            return (
              <div key={p.id} className="border-b border-r border-gray-100 p-3 cursor-pointer" onClick={() => navigate('product', { productId: p.id })}>
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 130 }}>
                  <img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-black px-1.5 py-0.5 rounded">
                    -{dealDiscount}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-center text-xs font-bold py-0.5">
                    DAILY DEAL
                  </div>
                </div>
                <div className="mt-1.5">
                  <div className="text-xs text-gray-700 line-clamp-1 font-medium">{p.title}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-purple-600 font-bold text-sm">{'$'}{price}</span>
                    {compare && <span className="text-gray-400 text-xs line-through">{'$'}{compare}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="w-full py-2.5 text-purple-600 font-bold text-sm border-t border-gray-100"
          onClick={() => navigate('daily-deals')}
        >
          See All Daily Deals →
        </button>
      </div>

      {/* LEE AI Picks (RecGPT) */}
      <div className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              <span className="font-black text-gray-900 text-sm">LEE AI Picks ✨</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Personalized recommendations for you</div>
          </div>
          <div className="bg-indigo-100 text-indigo-600 text-xs font-bold px-2 py-0.5 rounded-full">AI</div>
        </div>
        <div className="flex overflow-x-auto px-3 pb-3 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {aiProducts.map((p, idx) => {
            const price = getProductPrice(p);
            const aiReasons = ['Top Pick', 'Trending', 'Best Value', 'Popular', 'New In', 'Hot Deal'];
            return (
              <div key={p.id} className="flex-shrink-0 w-36 cursor-pointer" onClick={() => navigate('product', { productId: p.id })}>
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 140 }}>
                  <img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 flex items-center gap-1 bg-indigo-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    <Sparkles size={8} />
                    {aiReasons[idx % aiReasons.length]}
                  </div>
                </div>
                <div className="mt-1.5 px-0.5">
                  <div className="text-xs text-gray-700 line-clamp-2 leading-snug">{p.title}</div>
                  <div className="text-indigo-600 font-bold text-sm mt-0.5">{'$'}{price}</div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={9} className="text-yellow-400" fill="#facc15" />)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <div className="mt-2 bg-white">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="font-black text-gray-900 text-sm">Recently Viewed</span>
            </div>
            <button className="text-orange-500 text-xs font-semibold">Clear</button>
          </div>
          <div className="flex overflow-x-auto px-3 pb-3 gap-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {recentProducts.map(p => {
              const price = getProductPrice(p);
              return (
                <div key={p.id} className="flex-shrink-0 w-28 cursor-pointer" onClick={() => navigate('product', { productId: p.id })}>
                  <div className="rounded-xl overflow-hidden bg-gray-100" style={{ height: 110 }}>
                    <img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-1 px-0.5">
                    <div className="text-xs text-gray-700 line-clamp-2 leading-snug">{p.title}</div>
                    <div className="text-red-500 font-bold text-xs mt-0.5">{'$'}{price}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Just For You */}
      <div className="mt-2 bg-white">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="font-black text-gray-900 text-base flex items-center gap-2">
            <Star size={16} className="text-yellow-400" fill="#facc15" />
            Just For You
          </div>
          <div className="text-xs text-gray-500 mt-0.5">Recommended based on your activity</div>
        </div>
        <div className="grid grid-cols-2 gap-0">
          {feedProducts.map(p => {
            const price = getProductPrice(p);
            const compare = getCompareAtPrice(p);
            const discount = getDiscountPercent(p);
            return (
              <div key={p.id} className="border-b border-r border-gray-100 p-3 cursor-pointer" onClick={() => navigate('product', { productId: p.id })}>
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 160 }}>
                  <img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />
                  {discount > 0 && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</div>
                  )}
                  <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow" onClick={e => { e.stopPropagation(); }}>
                    <Heart size={14} className="text-gray-400" />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="text-xs text-gray-700 line-clamp-2 leading-snug">{p.title}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-red-500 font-bold text-sm">{'$'}{price}</span>
                    {compare && <span className="text-gray-400 text-xs line-through">{'$'}{compare}</span>}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-yellow-400" fill="#facc15" />)}
                    <span className="text-gray-400 text-xs ml-1">(128)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="py-4 flex justify-center">
          {loadingFeed && (
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: i * 0.15 + 's' }} />
              ))}
            </div>
          )}
          {!hasMore && !loadingFeed && <span className="text-gray-400 text-xs">You've seen it all!</span>}
        </div>
      </div>
    </div>
  );
}
