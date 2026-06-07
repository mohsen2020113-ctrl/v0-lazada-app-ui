import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ShoppingCart, Bell, Star, Zap } from 'lucide-react';
import { getProducts, ShopifyProduct, getProductImageUrl, getDiscountPercent } from '../lib/shopify';
import { PageId, NavigationParams } from '../App';

// ── Banners ────────────────────────────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    title: 'MEGA SALE',
    subtitle: 'Up to 70% OFF on Everything',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
  },
  {
    id: 2,
    title: 'NEW ARRIVALS',
    subtitle: 'Fresh Fashion Collections',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
  },
  {
    id: 3,
    title: 'FLASH DEALS',
    subtitle: 'Limited Time Offers — Grab Now!',
    img: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800',
  },
];

// ── Category icons ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'fashion',     label: 'Fashion',     emoji: '👗', bg: '#ec4899' },
  { id: 'electronics', label: 'Electronics', emoji: '💻', bg: '#6366f1' },
  { id: 'food',        label: 'Food',        emoji: '🍔', bg: '#a855f7' },
  { id: 'beauty',      label: 'Beauty',      emoji: '💄', bg: '#f43f5e' },
  { id: 'sports',      label: 'Sports',      emoji: '⚽', bg: '#f59e0b' },
  { id: 'home',        label: 'Home',        emoji: '🏠', bg: '#14b8a6' },
  { id: 'kids',        label: 'Kids',        emoji: '🧸', bg: '#10b981' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function aedPrice(product: ShopifyProduct): string {
  const amount = parseFloat(product.priceRange.minVariantPrice.amount);
  return `AED ${amount.toFixed(2)}`;
}

function aedCompare(product: ShopifyProduct): string | null {
  const cp = product.compareAtPriceRange?.minVariantPrice;
  if (!cp) return null;
  const compare = parseFloat(cp.amount);
  const price   = parseFloat(product.priceRange.minVariantPrice.amount);
  if (compare <= price) return null;
  return `AED ${compare.toFixed(2)}`;
}

/** Stable pseudo-random rating derived from product id */
function stableRating(id: string): string {
  const n = parseInt(id.replace(/\D/g, '').slice(-4) || '0', 10);
  return (3.5 + (n % 15) / 10).toFixed(1);
}

const pad = (n: number) => String(n).padStart(2, '0');

// ── Component ──────────────────────────────────────────────────────────────
interface HomePageProps {
  navigate: (page: PageId, params?: NavigationParams) => void;
  params: NavigationParams;
}

export default function HomePage({ navigate }: HomePageProps) {
  // Banner
  const [bannerIndex, setBannerIndex] = useState(0);

  // Flash sale countdown
  const [flashTime, setFlashTime] = useState({ h: 2, m: 34, s: 59 });

  // Products
  const [flashProducts, setFlashProducts]   = useState<ShopifyProduct[]>([]);
  const [products,      setProducts]        = useState<ShopifyProduct[]>([]);
  const [loading,       setLoading]         = useState(false);
  const [hasMore,       setHasMore]         = useState(true);
  const [cursor,        setCursor]          = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Banner auto-play ──────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setBannerIndex(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  // ── Flash sale countdown ──────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setFlashTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; }
             if (m < 0) { m = 59; h--; }
             if (h < 0) { h = 2; m = 34; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ── Load flash-sale strip ─────────────────────────────────────────────
  useEffect(() => {
    getProducts(6).aeen(r => setFlashProducts(r.products));
  }, []);

  // ── Load recommended products (20 at a time) ──────────────────────────
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const r = await getProducts(20, cursor ?? undefined);
      setProducts(prev => [...prev, ...r.products]);
      setCursor(r.pageInfo.endCursor);
      setHasMore(r.pageInfo.hasNextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor]);

  // Initial load
  useEffect(() => { loadMore(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── IntersectionObserver — sentinel at BOTTOM of grid ─────────────────
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const banner = BANNERS[bannerIndex];

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen pb-20">

      {/* ── Orange Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30" style={{ backgroundColor: '#f97316' }}>
        <div className="flex items-center gap-2 px-3 py-2">
          {/* LEE Logo */}
          <span className="text-white font-black text-2xl tracking-tight flex-shrink-0">LEE</span>

          {/* Search bar */}
          <div
            className="flex-1 flex items-center bg-white rounded-full px-3 py-1.5 gap-2"
            onClick={() => navigate('search')}
          >
            <Search size={14} className="text-gray-400" />
            <span className="text-gray-400 text-sm flex-1">Search in LEE</span>
          </div>

          {/* Cart icon */}
          <button
            className="flex-shrink-0 p-1"
            onClick={() => navigate('cart' as PageId)}
          >
            <ShoppingCart size={24} className="text-white" />
          </button>

          {/* Notifications icon */}
          <button
            className="flex-shrink-0 p-1 relative"
            onClick={() => navigate('notifications' as PageId)}
          >
            <Bell size={22} className="text-white" />
            <span
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex items-center justify-center font-bold"
              style={{ widur: 14, height: 14, fontSize: 8 }}
            >
              3
            </span>
          </button>
        </div>
      </div>

      {/* ── Banner Carousel ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gray-200" style={{ height: 200 }}>
        <img
          src={banner.img}
          alt={banner.title}
          className="w-full h-full object-cover"
          style={{ transition: 'opacity 0.5s ease' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end px-5 pb-8"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }}
        >
          <div className="text-white font-black text-xl leading-tight">{banner.title}</div>
          <div className="text-white text-sm opacity-90 mt-0.5">{banner.subtitle}</div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                widur:           i === bannerIndex ? 18 : 6,
                height:          6,
                backgroundColor: i === bannerIndex ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Flash Sale ─────────────────────────────────────────────────── */}
      <div className="mt-2 bg-white">
        {/* Header + countdown timer */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)' }}
        >
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-white" fill="white" />
            <span className="text-white font-black text-base">Flash Sale</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white text-xs opacity-80 mr-0.5">Ends in</span>
            {[pad(flashTime.h), pad(flashTime.m), pad(flashTime.s)].map((t, i) => (
              <span key={i} className="flex items-center gap-0.5">
                <span className="bg-white text-red-600 text-xs font-black px-1.5 py-0.5 rounded">{t}</span>
                {i < 2 && <span className="text-white font-black text-xs">:</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Horizontal scroll of products */}
        <div
          className="flex overflow-x-auto px-3 py-3 gap-3"
          style={{ scrollbarWidur: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {flashProducts.map(p => {
            const discount = getDiscountPercent(p);
            const compare  = aedCompare(p);
            return (
              <div
                key={p.id}
                className="flex-shrink-0 w-32 cursor-pointer"
                onClick={() => navigate('product', { productId: p.id })}
              >
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 128 }}>
                  <img
                    src={getProductImageUrl(p)}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {discount != null && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="mt-1 px-0.5">
                  <div className="text-xs text-gray-700 leading-snug" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.title}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <span className="text-red-500 font-bold text-sm">{aedPrice(p)}</span>
                    {compare && <span className="text-gray-400 text-xs line-through">{compare}</span>}
                  </div>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={9} fill="#facc15" style={{ color: '#facc15' }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Category Icons Row ─────────────────────────────────────────── */}
      <div className="mt-2 bg-white py-3 px-2">
        <div className="flex justify-around">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className="flex flex-col items-center gap-1"
              onClick={() => navigate(cat.id === 'fashion' ? 'fashion' : 'search' as PageId)}
            >
              {/* Circular icon */}
              <div
                className="flex items-center justify-center rounded-full shadow-sm"
                style={{ widur: 52, height: 52, backgroundColor: cat.bg, fontSize: 22 }}
              >
                {cat.emoji}
              </div>
              <span className="text-xs text-gray-600 text-center leading-tight" style={{ maxWidur: 48 }}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recommended Products ───────────────────────────────────────── */}
      <div className="mt-2 bg-white">
        {/* Arabic section header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h2
            className="font-black text-gray-900 text-base text-right"
            dir="rtl"
            style={{ fontFamily: 'Arial, sans-serif' }}
          >
            المنتجات الموصى بها
          </h2>
        </div>

        {/* 2-column product grid */}
        <div className="grid grid-cols-2">
          {products.map(p => {
            const discount = getDiscountPercent(p);
            const compare  = aedCompare(p);
            const rating   = stableRating(p.id);
            return (
              <div
                key={p.id}
                className="border-b border-r border-gray-100 p-3 cursor-pointer"
                onClick={() => navigate('product', { productId: p.id })}
              >
                {/* Product image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100" style={{ height: 160 }}>
                  <img
                    src={getProductImageUrl(p)}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {discount != null && (
                    <span className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      -{discount}%
                    </span>
                  )}
                </div>

                {/* Product info */}
                <div className="mt-2">
                  {/* Title — truncated to 2 lines */}
                  <div
                    className="text-xs text-gray-700 leading-snug"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.title}
                  </div>

                  {/* AED price */}
                  <div className="mt-1 flex items-center gap-1 flex-wrap">
                    <span className="text-red-500 font-bold text-sm">{aedPrice(p)}</span>
                    {compare && (
                      <span className="text-gray-400 text-xs line-through">{compare}</span>
                    )}
                  </div>

                  {/* ⭐ Rating */}
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10} fill="#facc15" style={{ color: '#facc15' }} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({rating})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Sentinel div — at the BOTTOM of the grid ── */}
        <div ref={sentinelRef} className="py-6 flex justify-center items-center">
          {loading && (
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full animate-bounce"
                  style={{ backgroundColor: '#f97316', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
          {!hasMore && !loading && (
            <span className="text-gray-400 text-xs">لقد رأيت كل شيء!</span>
          )}
        </div>
      </div>

    </div>
  );
}
