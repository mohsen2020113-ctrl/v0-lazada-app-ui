'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify';
import { useCart } from '@/app/contexts/cart-context';
import { useI18n } from '@/lib/i18n-context';

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

interface ShopifyProductsProps {
  products: ShopifyProduct[];
  initialPageInfo?: PageInfo;
}

const PRODUCTS_PER_PAGE = 50; // تحميل 50 منتج في كل مرة للأداء الأفضل
export function ShopifyProducts({ products: initialProducts, initialPageInfo }: ShopifyProductsProps) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [cursor, setCursor] = useState<string | null>(initialPageInfo?.endCursor ?? null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(initialPageInfo?.hasNextPage ?? false);
  const [loading, setLoading] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const allProductsPoolRef = useRef<ShopifyProduct[]>(initialProducts);
  const shuffledBatchRef = useRef<ShopifyProduct[]>([]);
  const shuffleIndexRef = useRef(0);
  const { addToCart } = useCart();
  const { t, formatPrice: formatPriceI18n, isRTL } = useI18n();

  useEffect(() => {
    setMounted(true);
  }, []);

  const shuffleArray = (arr: ShopifyProduct[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const fetchMoreProducts = useCallback(async () => {
    if (loading) return;
    
    if (isLoopMode) {
      // Serve from shuffled pool endlessly
      setLoading(true);
      await new Promise(r => setTimeout(r, 400));
      if (shuffleIndexRef.current + PRODUCTS_PER_PAGE >= shuffledBatchRef.current.length) {
        shuffledBatchRef.current = shuffleArray(allProductsPoolRef.current);
        shuffleIndexRef.current = 0;
      }
      const batch = shuffledBatchRef.current.slice(shuffleIndexRef.current, shuffleIndexRef.current + PRODUCTS_PER_PAGE);
      shuffleIndexRef.current += PRODUCTS_PER_PAGE;
      setProducts(prev => [...prev, ...batch]);
      setLoading(false);
      return;
    }
    
    if (!hasNextPage || !cursor) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?cursor=${encodeURIComponent(cursor)}&first=${PRODUCTS_PER_PAGE}`);
      const data = await res.json();
      if (data.products) {
        setProducts(prev => {
          const combined = [...prev, ...data.products];
          allProductsPoolRef.current = combined;
          return combined;
        });
        setCursor(data.pageInfo.endCursor);
        if (!data.pageInfo.hasNextPage) {
          shuffledBatchRef.current = shuffleArray([...allProductsPoolRef.current]);
          shuffleIndexRef.current = 0;
          setIsLoopMode(true);
        } else {
          setHasNextPage(true);
        }
      }
    } catch (err) {
      console.error('Error fetching more products:', err);
    } finally {
      setLoading(false);
    }
  }, [hasNextPage, loading, cursor, isLoopMode]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      if (!hasNextPage && !isLoopMode) return;
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 400) {
        fetchMoreProducts();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loading, fetchMoreProducts, isLoopMode]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  // Convert from AED and format with current currency
  const formatPrice = (amount: string) => {
    return formatPriceI18n(parseFloat(amount));
  };

  const getDiscount = (price: string, compareAt: string) => {
    const priceNum = parseFloat(price);
    const compareNum = parseFloat(compareAt);
    if (compareNum > priceNum) {
      return Math.round(((compareNum - priceNum) / compareNum) * 100);
    }
    return 0;
  };

  const handleAddToCart = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;
    
    addToCart({
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title || 'Default',
      price: parseFloat(variant.price?.amount || product.priceRange.minVariantPrice.amount),
      image: product.featuredImage?.url || '',
      quantity: 1,
      handle: product.handle,
    });
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white mx-3 mt-3 rounded-xl overflow-hidden">
      <div className={`px-4 py-3 border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-6 h-6 bg-gradient-to-r from-[#f85c98] to-[#e91e8c] rounded-md flex items-center justify-center">
            <ShoppingCart className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{t('promo.ourProducts')}</h2>
        </div>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        {products.map((product) => {
          const price = product.priceRange.minVariantPrice.amount;
          const compareAt = product.compareAtPriceRange?.minVariantPrice?.amount || price;
          const discount = getDiscount(price, compareAt);
          const isFav = favorites.includes(product.id);

          return (
            <Link
              key={product.id}
              href={`/product/${product.handle}`}
              className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] block"
            >
              <div className="relative aspect-square bg-gray-50">
                {product.featuredImage?.url ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ShoppingCart className="w-8 h-8 text-gray-300" />
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors z-10"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? 'fill-[#f85c98] text-[#f85c98]' : 'text-gray-400'
                    }`}
                  />
                </button>
                
                {discount > 0 && (
                  <span className="absolute bottom-2 left-2 bg-[#f85c98] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
              
              <div className="p-2">
                <p className="text-[10px] text-gray-700 line-clamp-2 mb-1 leading-tight font-medium h-7">
                  {product.title}
                </p>
                
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[#f85c98] font-bold text-sm">
                    {formatPrice(price)}
                  </span>
                  {discount > 0 && (
                    <span className="text-gray-400 text-[9px] line-through">
                      {formatPrice(compareAt)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[8px]">
                    <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-600">4.8</span>
                    <span className="text-gray-400">| 1.2k sold</span>
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-6 h-6 bg-[#f85c98] rounded-full flex items-center justify-center hover:bg-[#e91e8c] transition-colors"
                  >
                    <ShoppingCart className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-4" />

      {/* Loading spinner */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="w-8 h-8 border-4 border-[#f85c98] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </section>
  );
}
