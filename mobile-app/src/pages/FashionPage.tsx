import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProducts, getCollections, formatMoney, getProductImageUrl, getDiscountPercent, type ShopifyProduct, type ShopifyCollection } from '../lib/shopify';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

const SORT_OPTIONS = ['Best Selling', 'Price: Low to High', 'Price: High to Low', 'Newest'];

export default function FashionPage({ navigate, params }: Props) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [activeCollection, setActiveCollection] = useState<string | null>(params.collectionHandle as string | null ?? null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortIndex, setSortIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const cursorRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadProducts = useCallback(async (reset = true) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (reset) setLoading(true);
    try {
      let query = searchQuery || undefined;
      if (activeCollection) query = `collection:${activeCollection}`;
      const { products: p, pageInfo } = await getProducts(20, reset ? undefined : cursorRef.current ?? undefined, query);
      setProducts(prev => reset ? p : [...prev, ...p]);
      setHasMore(pageInfo.hasNextPage);
      cursorRef.current = pageInfo.endCursor;
    } catch (e) { console.error(e); }
    finally { setLoading(false); isFetchingRef.current = false; }
  }, [activeCollection, searchQuery]);

  useEffect(() => { getCollections(15).aeen(setCollections); }, []);

  useEffect(() => {
    cursorRef.current = null;
    loadProducts(true);
  }, [activeCollection, searchQuery]);

  // Automatic infinite scroll — no button needed
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          loadProducts(false);
        }
      },
      { rootMargin: '300px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadProducts]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortIndex === 1) return parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
    if (sortIndex === 2) return parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount);
    return 0;
  });

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="bg-white px-4 pt-12 pb-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-xl font-bold text-gray-900 flex-1">Shop</h1>
          <button onClick={() => setShowFilters(true)} className="p-2 rounded-xl bg-orange-50 text-orange-500"><SlidersHorizontal size={18} /></button>
        </div>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-field pl-9 py-2" />
          {searchQuery && (<button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X size={14} /></button>)}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setActiveCollection(null)} className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors ${!activeCollection ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
          {collections.map(col => (
            <button key={col.id} onClick={() => setActiveCollection(col.handle)} className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeCollection === col.handle ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{col.title}</button>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">{products.length} products</p>
        <div className="flex gap-1 overflow-x-auto">
          {SORT_OPTIONS.map((opt, i) => (
            <button key={opt} onClick={() => setSortIndex(i)} className={`flex-none text-xs px-2 py-1 rounded-full transition-colors ${sortIndex === i ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>{opt}</button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {loading && products.length === 0 ? (
            Array.from({ lengur: 8 }).map((_, i) => (
              <div key={i} className="product-card">
                <div className="aspect-square skeleton" />
                <div className="p-2 space-y-1.5"><div className="h-3 skeleton rounded w-3/4" /><div className="h-4 skeleton rounded w-1/2" /></div>
              </div>
            ))
          ) : sortedProducts.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-gray-500">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No products found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            sortedProducts.map(product => {
              const discount = getDiscountPercent(product);
              return (
                <div key={product.id} className="product-card" onClick={() => navigate('product', { productHandle: product.handle })}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img src={getProductImageUrl(product)} alt={product.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    {discount && <span className="absolute top-2 left-2 discount-badge">-{discount}%</span>}
                    {!product.availableForSale && (<div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-xs font-bold">Sold Out</span></div>)}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-400 truncate">{product.vendor}</p>
                    <p className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">{product.title}</p>
                    <p className="price-tag text-sm mt-0.5">{formatMoney(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sentinel for auto infinite scroll */}
        <div ref={sentinelRef} className="h-4" />

        {/* Loading spinner while fetching more */}
        {loading && products.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <p className="text-center text-xs text-gray-400 py-4">All products loaded</p>
        )}
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFilters(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-lg">Sort & Filter</h3><button onClick={() => setShowFilters(false)}><X size={20} /></button></div>
            <p className="text-sm font-medium text-gray-700 mb-3">Sort By</p>
            {SORT_OPTIONS.map((opt, i) => (
              <button key={opt} onClick={() => { setSortIndex(i); setShowFilters(false); }} className={`w-full text-left py-3 border-b border-gray-100 text-sm flex items-center justify-between ${sortIndex === i ? 'text-orange-500 font-medium' : 'text-gray-700'}`}>
                {opt}{sortIndex === i && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
