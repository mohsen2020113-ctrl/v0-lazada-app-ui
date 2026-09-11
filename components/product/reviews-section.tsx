'use client'

import { useState } from 'react'

interface Review {
  id: string
  author: string
  rating: number
  text: string
  images?: string[]
  videos?: string[]
  date: string
}

interface ReviewsSectionProps {
  reviews: Review[]
  rating: number
  reviewCount: number
}

export function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photos'>('all')

  return (
    <div className="bg-white border-b border-gray-100">
      {/* Reviews Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">
            Reviews ({reviewCount.toLocaleString()})
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{rating}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-lg">
                  ⭐
                </span>
              ))}
            </div>
            <button className="text-pink-600 font-bold text-sm ml-2">›</button>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xl">🤖</div>
            <p className="font-bold text-sm text-gray-900">AI Summary</p>
            <span className="text-xs text-blue-600 font-medium ml-auto">
              🔵 Powered by AI from genuine reviews
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            This product is well-designed, compact, and offers great storage capacity, making it perfect for
            organizing items. Its smooth-rolling wheels and easy assembly enhance usability. Customers appreciate
            its durability and functionality.
            <button className="text-pink-600 font-bold ml-2">more ›</button>
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs font-bold px-3 py-2 rounded transition ${
              activeFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🖼️ With images/videos (456)
          </button>
          <button
            onClick={() => setActiveFilter('photos')}
            className={`text-xs font-bold px-3 py-2 rounded transition ${
              activeFilter === 'photos'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔁 Repeat customer (186)
          </button>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="divide-y divide-gray-100">
        {reviews.map((review) => (
          <div key={review.id} className="px-4 py-4 hover:bg-gray-50 transition">
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />

              {/* Review Content */}
              <div className="flex-1">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-sm">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">{review.author}</span>
                </div>

                {/* Review Text */}
                <p className="text-xs text-gray-700 mb-2 leading-relaxed">{review.text}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review ${idx + 1}`}
                        className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition"
                      />
                    ))}
                    {review.images.length > 2 && (
                      <div className="w-16 h-16 rounded bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-700">
                        +{review.images.length - 2}
                      </div>
                    )}
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-gray-500">{review.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
