'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ShoppingCart } from 'lucide-react';
import { getWishlist } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth-context';
import { BottomNav } from '@/components/lee/bottom-nav-new';
import { fetchProducts } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/shopify';

interface WishlistProduct extends ShopifyProduct {
  isFavorite?: boolean;
}

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    async function loadWishlist() {
      try {
        const handles = await getWishlist(user.id);

        // Fetch product details for each handle
        const allProducts: WishlistProduct[] = [];
        for (const handle of handles) {
          const { products: fetchedProducts } = await fetchProducts(1);
          const product = fetchedProducts.find(p => p.handle === handle);
          if (product) {
            allProducts.push({ ...product, isFavorite: true });
          }
        }
        setProducts(allProducts);
      } catch (error) {
        console.error('[v0] Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-[#f85c98] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => router.back()} className="p-1">
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">My Wishlist</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Sign in to view your wishlist
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Save your favorite products to access them anytime
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#f85c98] text-white rounded-full font-medium"
          >
            Continue Shopping
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="p-1">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">My Wishlist</h1>
            <p className="text-xs text-gray-500">{products.length} items</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-gray-900 font-semibold mb-1">No saved items</h3>
          <p className="text-gray-500 text-sm text-center mb-6">
            Start adding products to your wishlist
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#f85c98] text-white rounded-full font-medium"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="p-3 grid grid-cols-2 gap-3">
          {products.map((product) => {
            const price = parseFloat(product.priceRange.minVariantPrice.amount);
            const imageUrl = product.images.edges[0]?.node.url;

            return (
              <Link
                key={product.id}
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
                </div>

                <div className="p-3">
                  <h3 className="text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {product.title}
                  </h3>

                  <div className="mt-2">
                    <span className="text-[#f85c98] font-bold">
                      AED {price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
