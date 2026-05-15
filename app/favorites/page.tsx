'use client';

import { useState } from 'react';
import { Header } from '@/components/lee/header';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { useFavorites } from '@/app/contexts/favorites-context';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const mockProducts = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 2999,
    originalPrice: 5999,
    image: 'https://via.placeholder.com/200x200?text=Headphones',
    rating: 4.8,
    sold: 1250,
  },
  {
    id: '3',
    title: 'USB-C Cable',
    price: 199,
    originalPrice: 399,
    image: 'https://via.placeholder.com/200x200?text=Cable',
    rating: 4.6,
    sold: 8900,
  },
];

export default function FavoritesPage() {
  const { favorites, removeFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const favoriteProducts = mockProducts.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header title="My Favorites" showBack />

      <main className="flex-1 pb-24 overflow-y-auto hide-scrollbar">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
            <p className="text-gray-600 text-center mb-6">Items you like will appear here</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#f85c98] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#ec407a] transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {favoriteProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#f85c98] text-[#f85c98]" />
                    </button>
                  </div>

                  <div className="p-2 sm:p-2.5">
                    <p className="text-[10px] sm:text-[11px] text-gray-700 line-clamp-2 mb-1.5 leading-tight h-7 sm:h-8">
                      {product.title}
                    </p>

                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[#f85c98] font-bold text-xs sm:text-sm">AED {product.price}</span>
                      <span className="text-gray-400 text-[9px] sm:text-[10px] line-through">
                        AED {product.originalPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-[9px] sm:text-[10px] text-gray-600">{product.rating}</span>
                    </div>

                    <button className="w-full bg-[#f85c98] text-white text-[9px] sm:text-[10px] py-1.5 rounded font-bold hover:bg-[#ec407a] transition-colors flex items-center justify-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
