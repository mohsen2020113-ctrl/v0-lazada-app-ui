import { useState, useEffect } from 'react';
import { ChevronLeft, Clock } from 'lucide-react';
import { getProducts, formatMoney, getProductImageUrl, getDiscountPercent, type ShopifyProduct } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function DailyDealsPage({ navigate }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    getProducts(20, undefined, 'sale').then(r => setProducts(r.products)).catch(() => {}).finally(() => setLoading(false));
    const t = setInterval(() => setTimeLeft(prev => {
      if (prev.s > 0) return { ...prev, s: prev.s - 1 };
      if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
      if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
      return prev;
    }), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-orange-500 px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('home')} className="text-white"><ChevronLeft size={22} /></button>
          <h1 className="text-xl font-bold text-white">Daily Deals 🔥</h1>
        </div>
        <div className="bg-white/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="text-white">
            <p className="text-xs opacity-80">Deals refresh in</p>
            <div className="flex gap-2 mt-1">
              {[{ v: timeLeft.h, l: 'H' }, { v: timeLeft.m, l: 'M' }, { v: timeLeft.s, l: 'S' }].map(({ v, l }) => (
                <div key={l} className="bg-white/20 rounded-lg px-2 py-1 text-center">
                  <p className="text-xl font-bold leading-none">{String(v).padStart(2, '0')}</p>
                  <p className="text-[10px] opacity-70">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <Clock size={40} className="text-white/40" />
        </div>
      </div>
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {loading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-card"><div className="aspect-square skeleton" /><div className="p-2 space-y-1.5"><div className="h-3 skeleton rounded" /><div className="h-4 skeleton rounded w-2/3" /></div></div>
        )) : products.map(product => {
          const discount = getDiscountPercent(product);
          return (
            <div key={product.id} className="product-card" onClick={() => navigate('product', { productHandle: product.handle })}>
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img src={getProductImageUrl(product)} alt={product.title} className="w-full h-full object-cover" />
                {discount && <span className="absolute top-2 left-2 discount-badge">-{discount}%</span>}
              </div>
              <div className="p-2">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</p>
                <p className="price-tag text-sm">{formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
