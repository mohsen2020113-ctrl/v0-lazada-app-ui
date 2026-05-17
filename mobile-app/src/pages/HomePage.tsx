import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, ShoppingCart, ChevronRight, Clock, Zap, Star, Heart } from 'lucide-react';
import { getProducts, ShopifyProduct, getProductImageUrl, getProductPrice, getCompareAtPrice, getDiscountPercent } from '../lib/shopify';
import { PageId, NavigationParams } from '../App';

interface Props {
  navigate: (page: PageId, params?: NavigationParams) => void;
  params: NavigationParams;
}

const BANNERS = [
  { id: 1, bg: 'from-orange-500 to-red-500', title: 'Mega Sale', subtitle: 'Up to 70% off everything!', emoji: '🔥' },
  { id: 2, bg: 'from-purple-500 to-pink-500', title: 'New Arrivals', subtitle: 'Fresh styles just dropped', emoji: '✨' },
  { id: 3, bg: 'from-blue-500 to-cyan-500', title: 'Free Shipping', subtitle: 'On orders over $50', emoji: '🚚' },
  { id: 4, bg: 'from-green-500 to-emerald-500', title: 'Flash Deal', subtitle: 'Limited time offers', emoji: '⚡' },
];

const CATEGORIES = [
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'beauty', label: 'Beauty', emoji: '💄' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'food', label: 'Food', emoji: '🍎' },
  { id: 'toys', label: 'Toys', emoji: '🎮' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
];

const QUICK_LINKS = [
  { id: 'coins', label: 'Coins', emoji: '🪙', page: 'wallet' as PageId },
  { id: 'vouchers', label: 'Vouchers', emoji: '🎟️', page: 'vouchers' as PageId },
  { id: 'daily-deals', label: 'Daily Deals', emoji: '🏷️', page: 'daily-deals' as PageId },
  { id: 'flash-sale', label: 'Flash Sale', emoji: '⚡', page: 'flash-sale' as PageId },
  { id: 'wishlist', label: 'Wishlist', emoji: '❤️', page: 'wishlist' as PageId },
  { id: 'orders', label: 'My Orders', emoji: '📦', page: 'orders' as PageId },
  { id: 'notifications', label: 'Alerts', emoji: '🔔', page: 'notifications' as PageId },
  { id: 'wallet', label: 'Wallet', emoji: '💳', page: 'wallet' as PageId },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return timeLeft;
}

function ProductCard({
  product,
  navigate,
}: {
  product: ShopifyProduct;
  navigate: (page: PageId, params?: NavigationParams) => void;
}) {
  const imageUrl = getProductImageUrl(product);
  const price = getProductPrice(product);
  const compareAt = getCompareAtPrice(product);
  const discount = getDiscountPercent(product);

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
      onClick={() => navigate('product', { productHandle: product.handle })}
    >
      <div className="relative">
        <img src={imageUrl} alt={product.title} className="w-full h-40 object-cover" loading="lazy" decoding="async" />
        {discount !== null && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
          <Heart size={13} className="text-gray-400" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-xs text-gray-700 line-clamp-2 mb-1 font-medium leading-tight">{product.title}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-orange-500 font-bold text-sm">{price}</span>
          {compareAt && <span className="text-gray-400 text-[10px] line-through">{compareAt}</span>}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] text-gray-500">4.8 · 1.2k sold</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ navigate }: Props) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [flashProducts, setFlashProducts] = useState<ShopifyProduct[]>([]);
  const [recProducts, setRecProducts] = useState<ShopifyProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const cursorRef = useRef<string | null>(null);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const flashSaleEnd = useRef(new Date(Date.now() + 4 * 3600000 + 23 * 60000 + 59000));
  const countdown = useCountdown(flashSaleEnd.current);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((i) => (i + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadFlash() {
      try {
        const { products } = await getProducts(8);
        setFlashProducts(products);
      } catch (e) {
        console.error('Flash sale load error:', e);
      }
    }
    loadFlash();
  }, []);

  const loadMore = useCallback(
    async (initial = false) => {
      if (fetchingRef.current) return;
      if (!initial && !hasMore) return;
      fetchingRef.current = true;
      setLoading(true);
      try {
        const { products, pageInfo } = await getProducts(
          10,
          initial ? undefined : (cursorRef.current ?? undefined)
        );
        setRecProducts((prev) => (initial ? products : [...prev, ...products]));
        cursorRef.current = pageInfo.endCursor;
        setHasMore(pageInfo.hasNextPage);
      } catch (e) {
        console.error('Product load error:', e);
      } finally {
        fetchingRef.current = false;
        setLoading(false);
      }
    },
    [hasMore]
  );

  useEffect(() => {
    loadMore(true);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          loadMore(false);
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate('search', { query: searchQuery });
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-orange-500 px-4 pt-4 pb-3 sticky top-0 z-30">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white text-2xl font-black tracking-widest">LEE</span>
          <div className="flex-1" />
          <button onClick={() => navigate('notifications')} className="text-white/90 hover:text-white p-1"><Bell size={22} /></button>
          <button onClick={() => navigate('cart')} className="text-white/90 hover:text-white p-1"><ShoppingCart size={22} /></button>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products... | ابحث عن منتج"
            className="w-full bg-white rounded-full pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none" />
        </form>
      </div>

      <div className="relative overflow-hidden h-44">
        {BANNERS.map((b, i) => (
          <div key={b.id}
            className={'absolute inset-0 bg-gradient-to-br ' + b.bg + ' transition-opacity duration-700 ' + (i === bannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none')}>
            <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
              <span className="text-5xl mb-2">{b.emoji}</span>
              <h2 className="text-2xl font-black drop-shadow">{b.title}</h2>
              <p className="text-white/80 text-sm mt-0.5">{b.subtitle}</p>
              <button onClick={() => navigate('flash-sale')} className="mt-3 bg-white text-orange-500 text-xs font-bold px-4 py-1.5 rounded-full self-start shadow">Shop Now →</button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setBannerIndex(i)}
              className={'h-1.5 rounded-full transition-all duration-300 ' + (i === bannerIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5')} />
          ))}
        </div>
      </div>

      <div className="bg-white mx-3 -mt-3 rounded-2xl shadow-md px-2 py-3 relative z-10">
        <div className="grid grid-cols-4 gap-1">
          {QUICK_LINKS.map((link) => (
            <button key={link.id} onClick={() => navigate(link.page)}
              className="flex flex-col items-center gap-1 py-2 hover:bg-orange-50 active:bg-orange-100 rounded-xl transition-colors">
              <span className="text-[22px] leading-none">{link.emoji}</span>
              <span className="text-[9px] text-gray-600 font-medium leading-tight text-center">{link.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white mt-3 px-4 pt-3 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 text-sm">Browse Categories</h3>
          <button onClick={() => navigate('fashion')} className="text-orange-500 text-xs flex items-center gap-0.5">View all <ChevronRight size={12} /></button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => navigate('fashion')} className="flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl hover:bg-orange-100 active:scale-95 transition-all">
                {cat.emoji}
              </div>
              <span className="text-[10px] text-gray-600 font-medium">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {flashProducts.length > 0 && (
        <div className="mt-3">
          <div className="bg-red-500 px-4 py-2.5 flex items-center gap-2">
            <Zap size={17} className="text-yellow-300 fill-yellow-300" />
            <span className="text-white font-black text-sm tracking-wide">FLASH SALE</span>
            <div className="flex items-center gap-1 ml-auto">
              <Clock size={12} className="text-white/80" />
              <span className="text-white text-xs mr-1">Ends in</span>
              {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((val, i) => (
                <span key={i} className="flex items-center">
                  <span className="bg-black/40 text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded">{val}</span>
                  {i < 2 && <span className="text-white/80 text-xs mx-0.5">:</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-white px-4 py-3">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {flashProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-28 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => navigate('product', { productHandle: product.handle })}>
                  <div className="relative">
                    <img src={getProductImageUrl(product)} alt={product.title}
                      className="w-28 h-28 object-cover rounded-xl bg-gray-100" loading="lazy" decoding="async" />
                    {getDiscountPercent(product) !== null && (
                      <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">-{getDiscountPercent(product)}%</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-700 mt-1.5 line-clamp-2 font-medium leading-tight">{product.title}</p>
                  <p className="text-orange-500 text-sm font-bold mt-0.5">{getProductPrice(product)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('flash-sale')} className="w-full mt-2.5 text-center text-red-500 text-xs font-semibold py-2 border border-red-200 rounded-xl hover:bg-red-50">See All Flash Deals →</button>
          </div>
        </div>
      )}

      <div className="mt-3 pb-4">
        <div className="bg-white px-4 py-3 mb-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5"><Star size={14} className="text-yellow-400 fill-yellow-400" />Just For You</h3>
            <button onClick={() => navigate('fashion')} className="text-orange-500 text-xs flex items-center gap-0.5">View all <ChevronRight size={12} /></button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-3">
          {recProducts.map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
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
