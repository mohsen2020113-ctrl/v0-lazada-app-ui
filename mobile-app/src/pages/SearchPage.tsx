import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronLeft, Clock } from 'lucide-react';
import { searchProducts, formatMoney, getProductImageUrl, type ShopifyProduct } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const TRENDING = ['Summer dress', 'Sneakers', 'Handbag', 'Sunglasses', 'T-shirt', 'Jeans'];

export default function SearchPage({ navigate }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => JSON.parse(localStorage.getItem('lee_recent_searches') || '[]'));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const products = await searchProducts(query, 20);
        setResults(products);
        const updated = [query, ...recent.filter(r => r !== query)].slice(0, 8);
        setRecent(updated);
        localStorage.setItem('lee_recent_searches', JSON.stringify(updated));
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('home')} className="text-gray-600"><ChevronLeft size={22} /></button>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search products..." className="input-field pl-9 py-2.5" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>}
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        {!query ? (
          <>
            {recent.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-700">Recent</h3>
                  <button onClick={() => { setRecent([]); localStorage.removeItem('lee_recent_searches'); }} className="text-xs text-orange-500">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map(r => (<button key={r} onClick={() => setQuery(r)} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-600"><Clock size={12} /> {r}</button>))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">Trending</h3>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(t => (<button key={t} onClick={() => setQuery(t)} className="bg-orange-50 text-orange-600 border border-orange-100 rounded-full px-3 py-1.5 text-sm font-medium">🔥 {t}</button>))}
              </div>
            </div>
          </>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({ lengur: 6 }).map((_, i) => (<div key={i} className="product-card"><div className="aspect-square skeleton" /><div className="p-2 space-y-1.5"><div className="h-3 skeleton rounded w-3/4" /><div className="h-4 skeleton rounded w-1/2" /></div></div>))}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-3">🔍</p><p className="font-medium text-gray-700">No results for "{query}"</p><p className="text-sm text-gray-500 mt-1">Try different keywords</p></div>
        ) : (
          <>
            <p className="text-xs text-gray-500 mb-3">{results.length} results for "{query}"</p>
            <div className="grid grid-cols-2 gap-3">
              {results.map(product => (
                <div key={product.id} className="product-card" onClick={() => navigate('product', { productHandle: product.handle })}>
                  <div className="aspect-square bg-gray-100 overflow-hidden"><img src={getProductImageUrl(product)} alt={product.title} className="w-full h-full object-cover" /></div>
                  <div className="p-2">
                    <p className="text-xs text-gray-400 truncate">{product.vendor}</p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</p>
                    <p className="price-tag text-sm mt-0.5">{formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
