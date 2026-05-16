'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { Search, ChevronLeft, ShoppingCart, Grid, List, X, Heart } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n-context';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
}

const recentSearches = ['أزياء', 'إلكترونيات', 'زجاجة ماء', 'عطر'];
const popularSearches = ['ملابس نسائية', 'هاتف ذكي', 'حقيبة', 'حذاء', 'ساعة'];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const { isRTL, formatPrice } = useI18n();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevant');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 5000]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  // Fetch products when query changes
  useEffect(() => {
    async function fetchResults() {
      if (!searchQuery || searchQuery.trim().length < 2) {
        setProducts([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setProducts(data.results || []);
      } catch (error) {
        console.error('[v0] Search error:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, [searchQuery]);

  // Update URL when searching
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
      }
    },
    [router]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  // Filter products
  let filteredProducts = [...products].filter(
    (p) =>
      p.price >= priceFilter[0] &&
      p.price <= priceFilter[1] &&
      (!categoryFilter || p.category === categoryFilter)
  );

  // Sort products
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className={`min-h-screen bg-gray-100 flex flex-col max-w-[430px] mx-auto ${isRTL ? 'dir-rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-3 py-2">
        <form onSubmit={handleSubmit} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className={`flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 border-2 border-transparent focus-within:border-[#f85c98] transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="ابحث في LEE"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none min-w-0"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => {
                  setInputValue('');
                  setSearchQuery('');
                  setProducts([]);
                }}
                className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors relative flex-shrink-0"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
        </form>
      </div>

      {/* Show search suggestions when no query */}
      {!searchQuery && (
        <div className="bg-white p-4">
          <div className="mb-6">
            <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <h3 className="font-bold text-gray-900">آخر عمليات بحث</h3>
              <button className="text-sm text-[#f85c98]">حذف الكل</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(term);
                    handleSearch(term);
                  }}
                  className="px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">عمليات بحث شائعة</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(term);
                    handleSearch(term);
                  }}
                  className="px-3 py-1.5 bg-pink-50 border border-[#f85c98]/30 rounded-full text-sm text-[#f85c98] hover:bg-pink-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white border-b border-gray-200 p-3 sticky top-14 z-30">
          <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <h2 className="font-bold text-gray-900 text-sm">
              البحث عن: <span className="text-[#f85c98]">{searchQuery}</span>
            </h2>
            <span className="text-xs text-gray-500">{filteredProducts.length} نتيجة</span>
          </div>

          {/* Filters */}
          <div className={`flex items-center gap-2 mb-3 overflow-x-auto pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Price Filter */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700 whitespace-nowrap">
              السعر: {formatPrice(priceFilter[0])} - {formatPrice(priceFilter[1])}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-[#f85c98]"
              >
                <option value="">جميع الفئات</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Sort and View Toggle */}
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-[#f85c98]"
            >
              <option value="relevant">الأكثر صلة</option>
              <option value="price-low">السعر: الأقل أولاً</option>
              <option value="price-high">السعر: الأعلى أولاً</option>
              <option value="rating">التقييم</option>
            </select>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-[#f85c98] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-[#f85c98] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        {/* Loading State */}
        {isLoading && (
          <div className={`p-3 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && searchQuery && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">لا توجد نتائج</h2>
            <p className="text-gray-600 text-center mb-4">
              لم نتمكن من العثور على أي شيء يطابق "{searchQuery}"
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setInputValue('');
              }}
              className="text-[#f85c98] font-semibold"
            >
              جرب بحثاً آخر
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className={`p-3 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className={`bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all active:scale-[0.98] block ${
                  viewMode === 'list' ? 'flex gap-3' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative bg-gray-50 ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}`}>
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                    className="w-full h-full object-cover"
                  />

                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute bottom-2 left-2 bg-[#f85c98] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className={`p-3 ${viewMode === 'list' ? 'flex-1 py-2' : ''}`}>
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[#f85c98] font-bold text-sm">{formatPrice(product.price)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-gray-400 text-xs line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>

                  {/* Title */}
                  <p className="text-xs text-gray-700 mb-2 leading-tight font-medium line-clamp-2">{product.title}</p>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-500">
                      <span>⭐ {product.rating}</span>
                      {product.reviews && <span>({product.reviews})</span>}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#f85c98] border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
