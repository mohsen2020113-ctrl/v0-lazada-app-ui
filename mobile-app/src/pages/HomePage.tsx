import { useState, useEffect } from 'react';
import { Search, Bell, ShoppingCart, ChevronRight, Zap, Star, Tag, Flame, Package } from 'lucide-react';
import { getProducts, getCollections, formatMoney, getProductImageUrl, getDiscountPercent, type ShopifyProduct, type ShopifyCollection } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const BANNERS = [
  { title: 'Summer Sale', subtitle: 'Up to 70% off', bg: 'from-orange-500 to-red-500', emoji: '☀️' },
  { title: 'New Arrivals', subtitle: 'Fresh styles daily', bg: 'from-purple-500 to-pink-500', emoji: '✨' },
  { title: 'Flash Deals', subtitle: 'Limited time only', bg: 'from-blue-500 to-cyan-500', emoji: '⚡' },
];

export default function HomePage({ navigate }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);
  const { itemCount } = useCart();
  const { customer } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const [p, c] = await Promise.all([getProducts(10), getCollections(8)]);
        setProducts(p.products); setCollections(c);
      } catch (e) { console.error('Failed to load home data:', e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveBanner(b => (b + 1) % BANNERS.length), 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-orange-500 px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-orange-100 text-xs">Welcome back</p>
            <h1 className="text-white font-bold text-lg">{customer?.firstName ? `${customer.firstName}!` : 'LEE Store'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('notifications')} className="text-white relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">3</span>
            </button>
            <button onClick={() => navigate('cart')} className="text-white relative">
              <ShoppingCart size={22} />
              {itemCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{itemCount}</span>}
            </button>
          </div>
        </div>
        <button onClick={() => navigate('search')} className="w-full bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-gray-400 text-sm">
          <Search size={16} /><span>Search products, brands...</span>
        </button>
      </div>

      <div className="px-4 py-4 space-y-5">
        <div className={`bg-gradient-to-r ${BANNERS[activeBanner].bg} rounded-2xl p-5 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl mb-1">{BANNERS[activeBanner].emoji}</p>
              <h2 className="text-xl font-bold">{BANNERS[activeBanner].title}</h2>
              <p className="text-sm opacity-90">{BANNERS[activeBanner].subtitle}</p>
              <button onClick={() => navigate('flash-sale')} className="mt-2 bg-white text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full">Shop Now</button>
            </div>
          </div>
          <div className="flex gap-1 mt-3">
            {BANNERS.map((_, i) => (<div key={i} className={`h-1 rounded-full transition-all ${i === activeBanner ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Zap, label: 'Flash Sale', page: 'flash-sale', color: 'text-red-500 bg-red-50' },
            { icon: Tag, label: 'Deals', page: 'daily-deals', color: 'text-blue-500 bg-blue-50' },
            { icon: Star, label: 'Wishlist', page: 'wishlist', color: 'text-pink-500 bg-pink-50' },
            { icon: Package, label: 'Orders', page: 'orders', color: 'text-green-500 bg-green-50' },
          ].map(({ icon: Icon, label, page, color }) => (
            <button key={page} onClick={() => navigate(page as PageId)} className="flex flex-col items-center gap-1">
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}><Icon size={22} /></div>
              <span className="text-xs text-gray-600 font-medium">{label}</span>
            </button>
          ))}
        </div>

        {collections.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Categories</h2>
              <button onClick={() => navigate('fashion')} className="text-orange-500 text-sm flex items-center gap-1">All <ChevronRight size={14} /></button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-none w-20"><div className="w-20 h-20 skeleton rounded-2xl mb-1" /><div className="h-3 skeleton rounded w-14 mx-auto" /></div>
              )) : collections.map(col => (
                <button key={col.id} onClick={() => navigate('fashion', { collectionHandle: col.handle })} className="flex-none flex flex-col items-center gap-1">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                    {col.image ? <img src={col.image.url} alt={col.title} className="w-full h-full object-cover" /> : <span className="text-2xl">🛍️</span>}
                  </div>
                  <span className="text-xs text-gray-700 font-medium text-center w-20 truncate">{col.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title flex items-center gap-2"><Flame size={18} className="text-orange-500" /> Best Sellers</h2>
            <button onClick={() => navigate('fashion')} className="text-orange-500 text-sm flex items-center gap-1">See all <ChevronRight size={14} /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="product-card"><div className="aspect-square skeleton" /><div className="p-2 space-y-1.5"><div className="h-3 skeleton rounded w-3/4" /><div className="h-4 skeleton rounded w-1/2" /></div></div>
            )) : products.slice(0, 6).map(product => {
              const discount = getDiscountPercent(product);
              return (
                <div key={product.id} className="product-card" onClick={() => navigate('product', { productHandle: product.handle })}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src={getProductImageUrl(product)} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                    {discount && <span className="absolute top-2 left-2 discount-badge">-{discount}%</span>}
                    {!product.availableForSale && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-xs font-bold">Sold Out</span></div>}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-500 truncate">{product.vendor}</p>
                    <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">{product.title}</p>
                    <p className="price-tag text-sm mt-1">{formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
