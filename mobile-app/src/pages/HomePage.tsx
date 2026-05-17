import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, ShoppingCart, Heart, ChevronRight, Clock, Zap, Star, Camera, Package, Truck, RefreshCw } from 'lucide-react';
import { getProducts, ShopifyProduct, getProductImageUrl, getProductPrice, getCompareAtPrice, getDiscountPercent } from '../lib/shopify';
import { PageId, NavigationParams } from '../App';

interface Props {
  navigate: (page: PageId, params?: NavigationParams) => void;
  params: NavigationParams;
}

const BANNERS = [
  { id: 1, from: '#f97316', to: '#ef4444', label: 'Mega Sale', sub: 'Up to 80% Off', btn: 'Shop Now' },
  { id: 2, from: '#8b5cf6', to: '#ec4899', label: 'New Arrivals', sub: 'Fresh styles daily', btn: 'Explore' },
  { id: 3, from: '#0ea5e9', to: '#6366f1', label: 'Free Shipping', sub: 'Orders over AED 100', btn: 'Shop Now' },
  { id: 4, from: '#10b981', to: '#0891b2', label: 'Flash Deals', sub: 'Limited time only', btn: 'Grab Now' },
];

const BRAND_SHORTCUTS = [
  { id: 'coins', label: 'Earn Coins', bg: '#f97316', emoji: '🪙' },
  { id: 'mall', label: 'LEEMall', bg: '#ef4444', emoji: '🏬' },
  { id: 'leeland', label: 'LEEland', bg: '#10b981', emoji: '🌿' },
  { id: 'mart', label: 'LEEMart', bg: '#3b82f6', emoji: '🛒' },
  { id: 'beauty', label: 'LEEBeauty', bg: '#ec4899', emoji: '💄' },
  { id: 'sports', label: 'LEESports', bg: '#8b5cf6', emoji: '⚽' },
];

const CATEGORIES_ROW1 = [
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
];

const CATEGORIES_ROW2 = [
  { id: 'toys', label: 'Toys', emoji: '🧸' },
  { id: 'food', label: 'Food', emoji: '🍔' },
  { id: 'motors', label: 'Motors', emoji: '🚗' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'more', label: 'More', emoji: '···' },
];

function useCountdown(ms: number) {
  const end = useRef(Date.now() + ms);
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const d = Math.max(0, end.current - Date.now());
      setT({ h: Math.floor(d / 3600000), m: Math.floor((d % 3600000) / 60000), s: Math.floor((d % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function ProductCard({ product, navigate, badge }: { product: ShopifyProduct; navigate: (p: PageId, params?: NavigationParams) => void; badge?: string }) {
  const price = getProductPrice(product);
  const compareAt = getCompareAtPrice(product);
  const discount = getDiscountPercent(product);
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
      onClick={() => navigate('product', { productHandle: product.handle })}>
      <div className="relative">
        <img src={getProductImageUrl(product)} alt={product.title}
          className="w-full h-36 object-cover bg-gray-100" loading="lazy" decoding="async" />
        {discount !== null && (
          <span className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{discount}%</span>
        )}
        {badge && <span className="absolute top-1.5 right-1.5 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{badge}</span>}
        <button className="absolute bottom-1.5 right-1.5 bg-white rounded-full p-1 shadow" onClick={e => e.stopPropagation()}>
          <Heart size={12} className="text-gray-400" />
        </button>
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-orange-500 font-bold text-sm">{price}</span>
          {compareAt && <span className="text-gray-400 text-[10px] line-through">{compareAt}</span>}
        </div>
        <div className="flex items-center gap-0.5 mt-0.5">
          <Star size={9} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[9px] text-gray-400">4.8 · 1.2k sold</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ navigate }: Props) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [flashProds, setFlashProds] = useState<ShopifyProduct[]>([]);
  const [dailyProds, setDailyProds] = useState<ShopifyProduct[]>([]);
  const [recProds, setRecProds] = useState<ShopifyProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const cursorRef = useRef<string | null>(null);
  const fetchRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const countdown = useCountdown(17 * 3600000 + 23 * 60000 + 47000);

  useEffect(() => {
    const id = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const r1 = await getProducts(6);
        setFlashProds(r1.products);
        const r2 = await getProducts(4, r1.pageInfo.endCursor ?? undefined);
        setDailyProds(r2.products);
      } catch(e) { console.error(e); }
    }
    load();
  }, []);

  const loadMore = useCallback(async (initial = false) => {
    if (fetchRef.current) return;
    if (!initial && !hasMore) return;
    fetchRef.current = true;
    setLoading(true);
    try {
      const { products, pageInfo } = await getProducts(10, initial ? undefined : (cursorRef.current ?? undefined));
      setRecProds(prev => initial ? products : [...prev, ...products]);
      cursorRef.current = pageInfo.endCursor;
      setHasMore(pageInfo.hasNextPage);
    } catch(e) { console.error(e); } finally {
      fetchRef.current = false;
      setLoading(false);
    }
  }, [hasMore]);

  useEffect(() => { loadMore(true); }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !fetchRef.current) loadMore(false);
    }, { rootMargin: '400px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loadMore]);

  const b = BANNERS[bannerIdx];

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div style={{background: 'linear-gradient(135deg, #f97316, #ef4444)'}} className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
              <span className="text-orange-500 font-black text-sm">L</span>
            </div>
            <span className="text-white text-xl font-black tracking-wider">LEE</span>
          </div>
          <div className="flex-1" />
          <button onClick={() => navigate('wishlist')} className="text-white/90 p-1"><Heart size={21} /></button>
          <button onClick={() => navigate('notifications')} className="text-white/90 p-1"><Bell size={21} /></button>
          <button onClick={() => navigate('cart')} className="text-white/90 p-1"><ShoppingCart size={21} /></button>
        </div>
        <div className="flex gap-2 bg-white rounded-full px-3 py-2 items-center mb-1">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && search.trim() && navigate('search', { query: search })}
            placeholder="Search in LEE | ابحث في LEE"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none" />
          <Camera size={15} className="text-gray-400 flex-shrink-0" />
        </div>
      </div>

      {/* BANNER */}
      <div className="relative overflow-hidden" style={{height: '200px', background: b.from}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, ' + b.from + ', ' + b.to + ')'}}>
          <div className="flex h-full items-center px-6">
            <div className="flex-1">
              <p className="text-white/70 text-xs mb-1 uppercase tracking-wider">Limited offer</p>
              <h2 className="text-white text-2xl font-black mb-1">{b.label}</h2>
              <p className="text-white/80 text-sm mb-4">{b.sub}</p>
              <button onClick={() => navigate('flash-sale')} className="bg-white text-orange-500 font-bold text-sm px-5 py-2 rounded-full shadow">{b.btn}</button>
            </div>
            <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center">
              <Zap size={48} className="text-white/60" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 right-4 bg-black/30 text-white text-[10px] px-2 py-0.5 rounded-full">{bannerIdx + 1}/{BANNERS.length}</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIdx(i)}
              className={'rounded-full transition-all ' + (i === bannerIdx ? 'bg-white w-5 h-1.5' : 'bg-white/50 w-1.5 h-1.5')} />
          ))}
        </div>
      </div>

      {/* COINS / VOUCHERS / REWARDS */}
      <div className="bg-white mx-3 -mt-3 rounded-2xl shadow-md relative z-10 mb-3">
        <div className="grid grid-cols-3 divide-x divide-gray-100">
          <button onClick={() => navigate('wallet')} className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg">🪙</span>
            <span className="text-orange-500 font-bold text-sm">1,250 pts</span>
            <span className="text-gray-400 text-[10px]">Coins</span>
          </button>
          <button onClick={() => navigate('vouchers')} className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg">🎟️</span>
            <span className="text-orange-500 font-bold text-sm">5 available</span>
            <span className="text-gray-400 text-[10px]">Vouchers</span>
          </button>
          <button onClick={() => navigate('vouchers')} className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-lg">🎁</span>
            <span className="text-orange-500 font-bold text-sm">Claim now</span>
            <span className="text-gray-400 text-[10px]">Rewards</span>
          </button>
        </div>
      </div>

      {/* SERVICE BADGES */}
      <div className="bg-white mx-3 rounded-2xl px-2 py-2.5 mb-3 shadow-sm">
        <div className="flex justify-around">
          <div className="flex items-center gap-1.5">
            <Truck size={15} className="text-orange-500" />
            <span className="text-[11px] font-medium text-gray-700">Free Shipping</span>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex items-center gap-1.5">
            <Zap size={15} className="text-orange-500" />
            <span className="text-[11px] font-medium text-gray-700">Fast Delivery</span>
          </div>
          <div className="w-px bg-gray-100" />
          <div className="flex items-center gap-1.5">
            <RefreshCw size={15} className="text-orange-500" />
            <span className="text-[11px] font-medium text-gray-700">Free Return</span>
          </div>
        </div>
      </div>

      {/* BIGGEST SAVING */}
      <div className="mx-3 mb-3 bg-orange-50 border border-orange-100 rounded-2xl p-3.5 flex items-center shadow-sm">
        <div className="flex-1">
          <p className="text-gray-600 text-xs mb-0.5">Biggest Saving</p>
          <div className="flex items-baseline gap-3">
            <div>
              <p className="text-orange-500 font-black text-lg leading-none">AED 500</p>
              <p className="text-gray-400 text-[10px]">Payday</p>
            </div>
            <div>
              <p className="text-gray-700 font-bold text-base leading-none">AED 30</p>
              <p className="text-gray-400 text-[10px]">Free shipping</p>
            </div>
          </div>
        </div>
        <button onClick={() => navigate('vouchers')} className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full">Collect All</button>
      </div>

      {/* BRAND SHORTCUTS */}
      <div className="bg-white px-4 py-3 mb-3">
        <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {BRAND_SHORTCUTS.map(s => (
            <button key={s.id} onClick={() => navigate('fashion')} className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-sm" style={{background: s.bg + '22', border: '2px solid ' + s.bg + '33'}}>
                {s.emoji}
              </div>
              <span className="text-[10px] text-gray-600 font-medium whitespace-nowrap">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="bg-white px-4 pt-3 pb-4 mb-3">
        <div className="grid grid-cols-5 gap-2 mb-2">
          {CATEGORIES_ROW1.map(c => (
            <button key={c.id} onClick={() => navigate('fashion')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100">{c.emoji}</div>
              <span className="text-[9px] text-gray-600 font-medium leading-tight text-center">{c.label}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {CATEGORIES_ROW2.map(c => (
            <button key={c.id} onClick={() => navigate('fashion')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl border border-gray-100">{c.emoji}</div>
              <span className="text-[9px] text-gray-600 font-medium leading-tight text-center">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FLASH SALE */}
      {flashProds.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 px-4 py-2.5" style={{background: 'linear-gradient(90deg, #ef4444, #f97316)'}}>
            <Zap size={16} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white font-black text-sm tracking-wide">LEE Flash Sale</span>
            <div className="flex items-center gap-1 ml-1">
              {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((v, i) => (
                <span key={i} className="flex items-center">
                  <span className="bg-black/40 text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">{v}</span>
                  {i < 2 && <span className="text-white/80 mx-0.5">:</span>}
                </span>
              ))}
            </div>
            <button onClick={() => navigate('flash-sale')} className="ml-auto flex items-center gap-0.5 text-white text-xs font-bold">MORE <ChevronRight size={13} /></button>
          </div>
          <div className="bg-white px-4 py-3">
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              {flashProds.map(p => (
                <div key={p.id} className="flex-shrink-0 w-[110px] cursor-pointer" onClick={() => navigate('product', { productHandle: p.handle })}>
                  <div className="relative">
                    <img src={getProductImageUrl(p)} alt={p.title} className="w-[110px] h-[110px] object-cover rounded-xl bg-gray-100" loading="lazy" decoding="async" />
                    {getDiscountPercent(p) !== null && (
                      <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">-{getDiscountPercent(p)}%</span>
                    )}
                    <span className="absolute top-1 right-1 bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 rounded">FREE SHIP</span>
                  </div>
                  <p className="text-[10px] text-gray-800 mt-1 line-clamp-1 font-medium">{p.title}</p>
                  <p className="text-orange-500 font-bold text-xs">{getProductPrice(p)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAILY CHOICE */}
      {dailyProds.length > 0 && (
        <div className="bg-white mb-3">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-gray-800 font-black text-base">Daily</span>
              <span className="text-gray-400 text-sm font-medium">9.-</span>
              <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">CHOICE</span>
            </div>
            <button onClick={() => navigate('daily-deals')} className="text-orange-500 text-xs flex items-center gap-0.5 font-medium">Buy 5 Get 1 Free <ChevronRight size={13} /></button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
            {dailyProds.map(p => (
              <div key={p.id} className="flex-shrink-0 w-36 cursor-pointer" onClick={() => navigate('product', { productHandle: p.handle })}>
                <div className="relative">
                  <img src={getProductImageUrl(p)} alt={p.title} className="w-36 h-36 object-cover rounded-xl bg-gray-100" loading="lazy" decoding="async" />
                  <div className="absolute top-1.5 left-1.5 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <span>✦</span> CHOICE
                  </div>
                </div>
                <p className="text-[11px] text-gray-800 mt-1.5 line-clamp-2 font-medium leading-tight">{p.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-orange-500 font-bold text-sm">{getProductPrice(p)}</span>
                  {getDiscountPercent(p) !== null && (
                    <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1 py-0.5 rounded">-{getDiscountPercent(p)}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JUST FOR YOU */}
      <div className="mb-3">
        <div className="bg-white px-4 py-3 mb-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-800 text-base">Just For You</h3>
              <p className="text-gray-400 text-[11px]">Recommended based on your activity</p>
            </div>
            <button onClick={() => navigate('fashion')} className="text-orange-500 text-xs flex items-center gap-0.5 font-medium">See All <ChevronRight size={13} /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-3 pb-4">
          {recProds.map(p => <ProductCard key={p.id} product={p} navigate={navigate} />)}
        </div>
        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div ref={sentinelRef} className="h-2" />
      </div>
    </div>
  );
}
