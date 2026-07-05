'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
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

const PAGE_SIZE = 20

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
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
          {discount && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-br-md">
              -{discount}%
            </div>
          )}
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
            <span className="text-sm font-bold text-[#C2185B]">
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
  const [displayed, setDisplayed] = useState<Product[]>(() => initialProducts.slice(0, PAGE_SIZE))
  const sentinelRef = useRef<HTMLDivElement>(null)
  const poolRef = useRef<Product[]>([...initialProducts])
  const offsetRef = useRef(PAGE_SIZE)
  const busyRef = useRef(false)

  // Reset busy flag after each render so IntersectionObserver can fire again
  useEffect(() => {
    busyRef.current = false
  }, [displayed])

  const loadMore = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true

    const pool = poolRef.current
    const offset = offsetRef.current

    if (offset < pool.length) {
      // More products remain in the current shuffle cycle
      const next = pool.slice(offset, offset + PAGE_SIZE)
      setDisplayed(prev => [...prev, ...next])
      offsetRef.current = offset + PAGE_SIZE
    } else {
      // All products shown — Fisher-Yates reshuffle and restart from top
      const newPool = fisherYatesShuffle(initialProducts)
      poolRef.current = newPool
      offsetRef.current = PAGE_SIZE
      setDisplayed(newPool.slice(0, PAGE_SIZE))
    }
  }, [initialProducts])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore() },
      { rootMargin: '300px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (loading) return <SkeletonGrid />

  return (
    <section className="py-3 sm:py-4">
      <div className="px-3 sm:px-4 md:px-6 mb-3 sm:mb-4 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">{title}</h2>
        <span className="text-xs sm:text-sm text-gray-500">{initialProducts.length} products</span>
      </div>
      <div className="px-3 sm:px-4 md:px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {displayed.map((product, idx) => (
          <ProductCard key={`${product.id}-${idx}`} product={product} />
        ))}
      </div>
      {/* Sentinel — IntersectionObserver fires loadMore when this enters viewport */}
      <div ref={sentinelRef} className="h-4 mt-2" />
      <div className="flex justify-center py-4">
        <span className="text-gray-400 text-sm animate-pulse">Loading more…</span>
      </div>
    </section>
  )
}
