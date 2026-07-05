'use client'

import React, { useMemo } from 'react'
import { ProductCard } from '@/components/product/product-card'

interface Product {
  id: string
  handle: string
  title: string
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice?: { amount: string }
  }
  compareAtPriceRange?: {
    minVariantPrice: { amount: string }
  }
  featuredImage?: { url: string }
  images: { edges: { node: { url: string } }[] }
  availableForSale?: boolean
}

interface ProductsGridProps {
  products: Product[]
  className?: string
}

export const ProductsGrid = React.memo(function ProductsGrid({
  products,
  className = '',
}: ProductsGridProps) {
  // Memoize discount calculation
  const processedProducts = useMemo(() => {
    return products.map((product) => {
      const currentPrice = parseFloat(product.priceRange.minVariantPrice.amount)
      const compareAtPrice = product.compareAtPriceRange?.minVariantPrice?.amount

      let discount = 0
      if (compareAtPrice) {
        const originalPrice = parseFloat(compareAtPrice)
        discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      }

      const image = product.featuredImage?.url || product.images?.edges?.[0]?.node?.url || '/placeholder.jpg'

      return {
        id: product.id,
        handle: product.handle,
        title: product.title,
        price: currentPrice.toString(),
        image,
        discount,
        compareAtPrice: compareAtPrice || undefined,
        currencyCode: product.priceRange.minVariantPrice.currencyCode,
        availableForSale: product.availableForSale,
      }
    })
  }, [products])

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 ${className}`}
    >
      {processedProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
})

ProductsGrid.displayName = 'ProductsGrid'
