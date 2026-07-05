'use client'

import Link from 'next/link'
import React from 'react'
import { ZoomImage } from '@/components/ui/zoom-image'

interface ProductCardProps {
  id: string
  handle: string
  title: string
  price: string
  image: string
  discount?: number
  compareAtPrice?: string
  currencyCode: string
  availableForSale?: boolean
}

export const ProductCard = React.memo(function ProductCard({
  id,
  handle,
  title,
  price,
  image,
  discount,
  compareAtPrice,
  currencyCode,
  availableForSale,
}: ProductCardProps) {
  return (
    <Link href={`/product/${handle}`}>
      <div className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative bg-gray-100 aspect-square overflow-hidden">
          <ZoomImage
            src={image}
            alt={title}
            width={250}
            height={250}
            className="w-full h-full"
            zoomLevel={2.5}
          />
          {availableForSale === false && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">Out of Stock</span>
            </div>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 group-hover:text-pink-600 transition-colors">
            {title}
          </h3>

          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">{currencyCode} {parseFloat(price).toFixed(2)}</span>
            {compareAtPrice && (
              <span className="text-xs text-gray-500 line-through">
                {currencyCode} {parseFloat(compareAtPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
})

ProductCard.displayName = 'ProductCard'
