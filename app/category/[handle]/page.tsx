'use client';

import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, ShoppingCart, ChevronDown, Grid, List } from 'lucide-react';
import { useCart } from '@/app/contexts/cart-context';
import { useFavorites } from '@/app/contexts/favorites-context';
import { BottomNav } from '@/components/lee/bottom-nav-new';

type CollectionProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
};

type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    url: string;
    altText: string | null;
  } | null;
};

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

type SortOption = 'default' | 'price-low' | 'price-high' | 'newest';

// Memoized product card to prevent re-renders
const ProductCard = memo(function ProductCard({
  product,
  viewMode,
  isFavorite,
  onAddToCart,
  onToggleFavorite,
}: {
  product: CollectionProduct;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onAddToCart: (product: CollectionProduct, e: React.MouseEvent) => void;
  onToggleFavorite: (product: CollectionProduct, e: React.MouseEvent) => void;
}) {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount || '0');
  const hasDiscount = comparePrice > price;
  const discount = hasDiscount ? Math.round((1 - price / comparePrice) * 100) : 0;
  const imageUrl = product.images.edges[0]?.node.url;

  if (viewMode === 'list') {
    return (
      <Link
        href={`/product/${product.handle}`}
        className="bg-white rounded-lg overflow-hidden shadow-sm flex"
      >
        <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.png';
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-[#f85c98] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm text-gray-900 line-clamp-2 font-medium">
              {product.title}
            </h3>
            <div className="mt-1">
              <span className="text-[#f85c98] font-bold">
                AED {price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-gray-400 text-xs line-through">
                  AED {comparePrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="flex-1 bg-[#f85c98] text-white text-xs py-2 rounded-full font-medium"
            >
              Add to Cart
            </button>
            <button
              onClick={(e) => onToggleFavorite(product, e)}
              className="p-2 rounded-full bg-gray-100"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-[#f85c98] text-[#f85c98]' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link
      href={`/product/${product.handle}`}
      className="bg-white rounded-lg overflow-hidden shadow-sm"
    >
      <div className="relative aspect-square bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.png';
            }}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-300" />
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[#f85c98] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}

        <button
          onClick={(e) => onToggleFavorite(product, e)}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-[#f85c98] text-[#f85c98]' : 'text-gray-400'}`}
          />
        </button>
      </div>

      <div className="p-3">
        <h3 className="text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        <div className="mt-1">
          <span className="text-[#f85c98] font-bold">
            AED {price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="ml-2 text-gray-400 text-xs line-through">
              AED {comparePrice.toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={(e) => onAddToCart(product, e)}
          className="w-full mt-2 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] text-white text-xs py-2 rounded-full font-medium flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Cart
        </button>
      </div>
    </Link>
  );
});

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const handle = params.handle as string;

  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch initial collection
  useEffect(() => {
    async function fetchCollection() {
      setLoading(true);
      setError(null);
      setProducts([]);
      setPageInfo(null);

      try {
        // Special case: 'all' shows all products instead of a specific collection
        if (handle === 'all') {
          const res = await fetch(`/api/products?limit=20`);
          if (!res.ok) throw new Error('Failed to fetch products');
          const data = await res.json();
          setCollection({
            id: 'all',
            title: 'All Products',
            handle: 'all',
            description: 'Browse all our products',
            image: null,
          });
          setProducts(data.products || data);
          setPageInfo({ hasNextPage: false, endCursor: null });
        } else {
          const res = await fetch(`/api/collection/${handle}`);
          if (!res.ok) {
            if (res.status === 404) {
              setError('Collection not found');
            } else {
              throw new Error('Failed to fetch');
            }
            return;
          }
          const data = await res.json();
          setCollection({
            id: data.id,
            title: data.title,
            handle: data.handle,
            description: data.description,
            image: data.image,
          });
          setProducts(data.products);
          setPageInfo(data.pageInfo);
        }
      } catch (err) {
        console.error('[v0] Category fetch error:', err);
        setError('Failed to load collection. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (handle) {
      fetchCollection();
    }
  }, [handle]);

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Load more products
  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const res = await fetch(`/api/collection/${handle}?cursor=${pageInfo.endCursor}`);
      if (!res.ok) throw new Error('Failed to fetch more');
      const data = await res.json();
      setProducts(prev => [...prev, ...data.products]);
      setPageInfo(data.pageInfo);
    } catch (err) {
      console.error('[v0] Load more error:', err);
      setError('Failed to load more products');
    } finally {
      setLoadingMore(false);
    }
  }, [pageInfo, loadingMore, handle]);

  // Scroll listener for infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!pageInfo?.hasNextPage || loadingMore) return;
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 400) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageInfo, loadingMore, loadMore]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount)
        );
      case 'price-high':
        return sorted.sort((a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount)
        );
      case 'newest':
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [products, sortBy]);

  const handleAddToCart = (product: CollectionProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    addToCart({
      variantId: variant.id,
      title: product.title,
      variantTitle: 'Default',
      price: parseFloat(variant.price?.amount || product.priceRange.minVariantPrice.amount),
      image: product.images.edges[0]?.node.url || '/placeholder.png',
      quantity: 1,
      handle: product.handle,
    });
  };

  const handleToggleFavorite = (product: CollectionProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const price = parseFloat(product.priceRange.minVariantPrice.amount);
    const imageUrl = product.images.edges[0]?.node.url || '/placeholder.png';

    toggleFavorite({
      id: product.id,
      name: product.title,
      price,
      image: imageUrl,
    });
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="bg-white px-4 py-2 border-b">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="p-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <BottomNav />
      </div>
    );
  }

  // Error / Not found state
  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => router.back()} className="p-1">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Category</h1>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {error || 'Collection not found'}
          </h2>
          <p className="text-gray-500 text-center mb-6">
            This category doesn&apos;t exist or has no products.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-full font-medium"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-[#f85c98] text-white rounded-full font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900 truncate">{collection.title}</h1>
            <p className="text-xs text-gray-500">
              {products.length} {pageInfo?.hasNextPage ? '+' : ''} products
            </p>
          </div>
        </div>
      </div>

      {/* Sort & View Bar */}
      <div className="bg-white px-4 py-2 border-b flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-1 text-sm text-gray-700 font-medium"
          >
            Sort: {sortOptions.find(o => o.value === sortBy)?.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>

          {showSortMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-20 min-w-[180px]">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      sortBy === option.value ? 'text-[#f85c98] font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
          >
            <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-[#f85c98]' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
          >
            <List className={`w-5 h-5 ${viewMode === 'list' ? 'text-[#f85c98]' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No products found</h3>
          <p className="text-gray-500 text-sm text-center">
            This collection doesn&apos;t have any products yet.
          </p>
        </div>
      ) : (
        <>
          <div className={`p-3 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}`}>
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                isFavorite={favorites.some(f => f.id === product.id)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-4" />

        {/* Loading spinner */}
        {loadingMore && (
          <div className="flex justify-center items-center py-6">
            <div className="w-8 h-8 border-4 border-[#f85c98] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        
          {error && (
            <div className="px-4 pb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </>
      )}

      <BottomNav />
    </div>
  );
}
