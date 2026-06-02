'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { SkeletonGrid } from '@/components/skeleton-card'

interface Product {
  id: string
  title: string
  handle: string
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } }
  compareAtPriceRange?: { minVariantPrice: { amount: string; currencyCode: string } }
  images: { edges: { node: { url: string; altText: string | null } }[] }
  availableForSale?: boolean
}

interface ShopifyProductsProps {
  products: Product[]
  loading?: boolean
  title?: string
}

function ProductCard({ product }: { product: Product }) {
  const [wishlist, setWishlist] = useState(false)
  const price = parseFloat(product.priceRange.minVariantPrice.amount)
  const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null
  const discount = comparePrice && comparePrice > price
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : null
  const image = product.images.edges[0]?.node

  return (
    <Link href={'/product/' + product.handle} className="block group">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg"
           style={{boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {image && (
            <Image
              src={image.url}
              alt={image.altText || product.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {/* Discount badge */}
          {discount && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-md">
              -{discount}%
            </div>
          )}
          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
            className="absolute top-1.5 right-1.5 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={'w-3.5 h-3.5 ' + (wishlist ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-2">
          <p className="text-xs text-gray-800 line-clamp-2 leading-tight mb-1">{product.title}</p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-orange-500">
              {product.priceRange.minVariantPrice.currencyCode} {price.toFixed(2)}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-xs text-gray-400 line-through">
                {product.priceRange.minVariantPrice.currencyCode} {comparePrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export function ShopifyProducts({ products: initialProducts, loading = false, title = 'All Products' }: ShopifyProductsProps) {
  const [displayCount, setDisplayCount] = useState(20)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const displayedProducts = initialProducts.slice(0, displayCount)
  const hasMore = displayCount < initialProducts.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setDisplayCount((prev) => Math.min(prev + 20, initialProducts.length))
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, initialProducts.length])

  if (loading) return <SkeletonGrid />

  return (
    <section className="py-3 sm:py-4">
      <div className="px-3 sm:px-4 md:px-6 mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-xs sm:text-sm text-gray-500">{initialProducts.length} products</span>
      </div>
      <div className="px-3 sm:px-4 md:px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {displayedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {/* Sentinel for IntersectionObserver */}
      <div ref={sentinelRef} className="h-4 mt-2" />
      {hasMore && (
        <div className="flex justify-center py-4">
          <span className="text-gray-400 text-sm">Loading more...</span>
        </div>
      )}
    </section>
  )
}
