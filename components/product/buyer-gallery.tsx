'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BuyerGalleryProps {
  images: string[]
}

export function BuyerGallery({ images }: BuyerGalleryProps) {
  const [showAll, setShowAll] = useState(false)
  const displayImages = showAll ? images : images.slice(0, 4)

  return (
    <div className="bg-white px-4 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-900">Buyer Gallery (203)</h3>
        <button className="text-pink-600 font-bold text-sm hover:text-pink-700">
          View All ›
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {displayImages.map((img, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group cursor-pointer"
          >
            <img
              src={img}
              alt={`Buyer photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" />
          </div>
        ))}
      </div>
    </div>
  )
}
