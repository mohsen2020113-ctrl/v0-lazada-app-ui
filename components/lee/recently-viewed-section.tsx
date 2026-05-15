'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getRecentlyViewed, RecentlyViewed } from '@/lib/recently-viewed';
import { useFavorites } from '@/app/contexts/favorites-context';

export function RecentlyViewedSection() {
  const [products, setProducts] = useState<RecentlyViewed[]>([]);
  const [mounted, setMounted] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    setMounted(true);
    const items = getRecentlyViewed();
    setProducts(items.slice(0, 8)); // Show last 8
  }, []);

  if (!mounted || products.length === 0) return null;

  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100">
      {/* Heading */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Recently Viewed</h2>
        <Link
          href="/"
          className="text-sm text-[#f85c98] font-medium flex items-center gap-1"
        >
          See All →
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2">
          {products.map((product) => {
            const isFavorite = favorites.some(f => f.id === product.handle);

            return (
              <Link
                key={product.handle}
                href={`/product/${product.handle}`}
                className="flex-shrink-0 w-[140px] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] block"
              >
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite({
                        id: product.handle,
                        name: product.title,
                        price: product.price,
                        image: product.image,
                      });
                    }}
                    className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite
                          ? 'fill-[#f85c98] text-[#f85c98]'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-2">
                  <h3 className="text-xs text-gray-900 line-clamp-1 font-medium">
                    {product.title}
                  </h3>
                  <p className="text-[#f85c98] text-xs font-bold mt-1">
                    AED {product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
